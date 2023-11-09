import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';

import AddIcon from '@/assets/icons/AddIcon';

import { Disclaimer } from '@/components/AddOrder/Page/ResultTable';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import Input from '@/components/Input';
import SelectWithLabel from '@/components/SelectWithLabel';

import { orderActions } from '@/store/actions/orderActions';
import { userActions } from '@/store/actions/userActions';

import {
  CommonInputTypes,
  IFoundedItems,
  TManualProducts,
} from '@/store/reducers/order';
import { FullfilmentType } from '@/store/reducers/services';
import { PopupTypes } from '@/store/reducers/user';

import {
  selectMatter,
  selectOrderManuallyProducts, selectProductToScroll,
  selectShouldClearManualItems,
} from '@/store/selectors/orderSelectors';

import useIsFirstRender from '@/hooks/useIsFirstRender';
import useKeyPress from '@/hooks/useKeyPress';
import useToggle from '@/hooks/useToggle';

import extendCommonInputs from '@/utils/extendCommonInputs';
import generateManualDescription from '@/utils/generateManualDescription';
import { ExistingRegions } from '@/utils/getRegionsData';
import isNumber from '@/utils/isNumber';
import servicesValidation, {
  ExtendedCommonInputTypes,
  validateCommonInputs, validateMatter,
} from '@/utils/servicesValidation';

import { AppDispatch } from '@/store';

interface Props {
  name: string,
  price: string,
  productId: string,
  region: ExistingRegions,
  inputs: CommonInputTypes[],
  disclaimer?: string,
  isLast: boolean,
  mask?: string,
}

const OrderItem: React.FC<Props> = ({
  name,
  price,
  productId,
  region,
  inputs,
  disclaimer,
  isLast,
  mask,
}) => {
  const [isSelected, toggleIsSelected] = useToggle();
  const [value, setValue] = useState(extendCommonInputs(inputs, region));
  const [items, setItems] = useState<IFoundedItems[]>([]);
  const [isButtonPressed, toggleIsButtonPressed] = useToggle();
  const itemRef = useRef<HTMLLIElement>(null);

  const matter = useSelector(selectMatter);
  const products = useSelector(selectOrderManuallyProducts);
  const shouldClearManualItems = useSelector(selectShouldClearManualItems);
  const productToScroll = useSelector(selectProductToScroll);

  const dispatch = useDispatch<AppDispatch>();
  const isFirstRender = useIsFirstRender();
  const isEnterPressed = useKeyPress('Enter');

  useEffect(() => {
    if (itemRef.current && productToScroll === productId) {
      const top = itemRef.current.offsetTop;

      window.scrollTo({
        top,
        behavior: 'smooth',
      });
      dispatch(orderActions.setProductToScroll(null));
      toggleIsSelected(true);
    }
  }, [productToScroll, itemRef]);

  useEffect(() => {
    if (isEnterPressed && itemRef.current) {
      const { activeElement } = document;

      if (itemRef.current.contains(activeElement)) {
        onAddClick();
      }
    }
  }, [isEnterPressed]);

  useEffect(() => {
    validateAll();
  }, [isFirstRender]);

  useEffect(() => {
    const newItems: TManualProducts = {
      ...products,
    };
    newItems[productId] = items;
    dispatch(orderActions.setOrderManuallyProducts(newItems));
  }, [items]);

  useEffect(() => {
    if (shouldClearManualItems) {
      setItems([]);
      toggleIsSelected(false);
      dispatch(orderActions.setShouldClearManualItems(false));
    }
  }, [shouldClearManualItems]);

  const getInputByType = (el: ExtendedCommonInputTypes, i: number, isSingle: boolean) => {
    switch (el.type) {
      case 'text': {
        return (
          <Input
            key={el.label + el.placeholder + i}
            value={el.value}
            onChange={(evt) => onChangeHandler(evt.target.value, i)}
            onBlur={(evt) => onBlurHandler(evt.target.value, i)}
            label={el.label}
            labelColor="#1A1C1E"
            labelFontSize="14px"
            infotip={el.infotip}
            placeholder={el.placeholder}
            inputMarginBottom="0"
            isError={isButtonPressed && el.isError}
            errorMessage={el.errorMessage}
            required={el.isRequired}
            isRequired={!isSingle && el.isRequired}
            style={{
              width: '257px',
            }}
          />
        );
      }
      case 'dropdown': {
        return (
          <SelectWithLabel
            key={el.label + el.placeholder + i}
            label={el.label}
            isRequired={el.isRequired}
            infotip={el.infotip}
            selectedItem={el.value}
            setSelectedItem={onChangeHandler}
            additionalSetData={i}
            placeholder={el.placeholder}
            items={el.keys}
            isError={isButtonPressed && el.isError}
            errorMessage={el.errorMessage}
            labelFontSize="14px"
            labelColor="var(--primary-dark-color)"
            maxWidth="257px"
            openToTop={isLast}
            topThreshold={82}
            bottomThreshold={103}
          />
        );
      }
      default: return <></>;
    }
  };

  const validateAll = () => {
    setValue((prevState) => validateCommonInputs(prevState, productId));
  };

  const validateService = (v: string | number, inputIndex: number) => {
    if (value[inputIndex].type === 'checkbox') return;

    setValue((prevState) => {
      const result = [...prevState];
      let isError = '';

      const currentInput = result[inputIndex];
      const isRequired = 'isRequired' in currentInput ? currentInput.isRequired : false;

      if (typeof v === 'string') {
        isError = servicesValidation(v, productId, currentInput.label, isRequired);
      } else if (isRequired && !isNumber(v)) {
        isError = 'Field is required';
      }

      result[inputIndex].isError = !!isError;
      result[inputIndex].errorMessage = isError;

      return result;
    });
  };

  const onChangeHandler = (v: string | number | boolean, index: number) => {
    setValue((prevState) => {
      const result = [...prevState];

      result[index].value = v;

      return result;
    });

    if (typeof v !== 'boolean') validateService(v, index);
  };

  const onAddClick = () => {
    validateAll();
    toggleIsButtonPressed(true);

    const result = generateManualDescription(value, mask);

    const isItemExist = items.find((item) => item.id === result);

    if (isItemExist) {
      dispatch(userActions.setPopup({
        type: PopupTypes.INFO,
        mainText: 'Info',
        additionalText: `Item already added to ${name}`,
        applyTimeout: false,
      }));

      return;
    }

    if (value && products) {
      const isHaveError = value.find((item) => item.isError || item.errorMessage);

      if (isHaveError) return;

      if (!result.length) return;

      const isMatterError = validateMatter(matter);

      if (isMatterError) {
        dispatch(orderActions.setIsMatterError(isMatterError));
        return;
      }

      const newItem: IFoundedItems = {
        id: result,
        description: result,
        identifier: '',
        price,
        render: {
          value: result,
        },
        isChosen: true,
        productId,
        searchDescription: result,
        type: FullfilmentType.MANUAL,
        manualInputs: [],
      };

      value.forEach((el, i) => {
        if (typeof el.value === 'string' && el.value.trim()) {
          newItem.manualInputs!.push({
            key: inputs[i].label,
            value: el.value.trim(),
          });
        }
      });

      setValue(extendCommonInputs(inputs, region));
      setItems((prevState) => [...prevState, newItem]);
      toggleIsButtonPressed(false);
      dispatch(orderActions.setIsOrderStarted(true));
    }
  };

  const onItemClick = (item: IFoundedItems) => {
    setItems((prevState) => prevState.map((el) => {
      if (el.id === item.id) {
        return {
          ...el,
          isChosen: !el.isChosen,
        };
      }

      return el;
    }));
  };

  const onBlurHandler = (v: string, i: number) => {
    if (!v) {
      toggleIsButtonPressed(false);
      setValue((prevState) => {
        const result = [...prevState];
        result[i].isError = false;
        result[i].errorMessage = '';
        return result;
      });
    }
  };

  const selectedItemsCount = items.filter((el) => el.isChosen).length;
  const totalPrice = selectedItemsCount * +price;
  const isError = useMemo(() => (
    value.find((el) => el.type !== 'checkbox' && el.errorMessage)
  ), [value, isButtonPressed]);

  const isSmall = value.length < 3 && !value.some((el) => el.type === 'checkbox');

  return (
    <Li ref={itemRef}>
      <Item onClick={toggleIsSelected}>
        <OrderItemName>
          <Arrow
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="rgba(0, 0, 0, .5)"
            isSelected={isSelected}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </Arrow>
          <p>
            {name}
            <span>{` ($${Number(+price / 100).toFixed(2)})`}</span>
          </p>
        </OrderItemName>
        <TotalInfo>
          {selectedItemsCount ? (
            <TotalCount>
              x
              {selectedItemsCount}
            </TotalCount>
          ) : ''}
          <TotalPrice>
            {totalPrice ? `$${(totalPrice / 100).toFixed(2)}` : '--'}
          </TotalPrice>
        </TotalInfo>
      </Item>
      {isSelected && (
        <>
          <Inputs
            style={{
              marginBottom: disclaimer
                ? '8px'
                : items.length ? '24px' : '16px',
              marginTop: '10px',
            }}
          >
            {value.map((el, i) => getInputByType(el, i, value.length === 1))}
            {isSmall && (
              <StyledButton
                onClick={(evt) => {
                  evt.stopPropagation();
                  onAddClick();
                }}
                style={{ marginBottom: isButtonPressed && isError ? '20px' : '0' }}
              >
                <AddIcon />
                Add
              </StyledButton>
            )}
          </Inputs>
          {disclaimer && (
            <Disclaimer
              marginBottom={items.length ? '24px' : '16px'}
              padding="0"
              border="none"
              color="rgba(0, 0, 0, .5)"
            >
              {disclaimer}
            </Disclaimer>
          )}
          {!isSmall && (
            <StyledButton
              onClick={(evt) => {
                evt.stopPropagation();
                onAddClick();
              }}
              style={{ marginBottom: isButtonPressed && isError ? '20px' : '0' }}
            >
              <AddIcon />
              Add
            </StyledButton>
          )}
        </>
      )}
      {!!items.length && isSelected && (
        <SubItems>
          {items.map((item) => (
            <SubItem
              key={item.id}
              isSelected={item.isChosen}
              onClick={() => onItemClick(item)}
            >
              <Checkbox
                type="checkbox"
                readOnly
                checked={item.isChosen}
                onChange={() => onItemClick(item)}
              />
              {item.render.value}
            </SubItem>
          ))}
        </SubItems>
      )}
    </Li>
  );
};

export const Li = styled.li`
  &:not(:last-child) {
    border-bottom: 1px solid rgb(229, 231, 235);
  }
`;

export const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  height: 55px;
  cursor: pointer;
`;

export const OrderItemName = styled.div`
  display: flex;
  align-items: center;
  
  p {
    font-size: 14px;
    color: #111827;
    font-weight: 500;
  }
  
  p, span {
    user-select: none;
  }

  span {
    color: #818388;
    font-weight: 400;
  }

  :hover {
    svg {
      stroke: rgba(0, 0, 0, .9);
    }
  }
`;

export const Arrow = styled.svg<{ isSelected: boolean }>`
  width: 1rem;
  height: 1rem;
  margin-right: 8px;
  transition: .2s ease-in-out;
  ${({ isSelected }) => (isSelected ? 'transform: rotate(90deg)' : '')}
`;

export const TotalInfo = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 16px;
`;

export const TotalCount = styled.span`
  display: block;
  padding: 2px 10px;
  border: 1px solid rgba(35, 35, 35, 0.16);
  border-radius: 100px;
  font-size: 14px;
  font-weight: 500;
`;

export const TotalPrice = styled.span`
  font-size: 14px;
  color: #232323;
  font-weight: 500;
`;

export const SubItems = styled.ul`
  display: flex;
  grid-gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

export const SubItem = styled.li<{ isSelected: boolean }>`
  display: flex;
  grid-gap: 4px;
  align-items: center;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  line-height: 14px;
  border: 1px solid rgb(229, 231, 235);
  border-radius: 100px;
  cursor: pointer;
  user-select: none;

  label, svg {
    width: 18px;
    height: 18px;
  }

  ${({ isSelected }) => (isSelected ? css`
    background-color: var(--primary-green-background-color);
  ` : '')}
`;

export const Inputs = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  grid-gap: 24px;
`;

export const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  align-self: flex-end;
  grid-gap: 4px;
  padding: 0 18px;
  font-size: 12px;
  
  transition: color .1s ease-in-out;
`;

export default OrderItem;
