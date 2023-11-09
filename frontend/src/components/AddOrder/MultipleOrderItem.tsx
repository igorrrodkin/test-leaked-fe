import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import AddIcon from '@/assets/icons/AddIcon';

import {
  Arrow,
  Inputs,
  Item,
  Li,
  OrderItemName,
  StyledButton,
  SubItem,
  SubItems,
  TotalCount,
  TotalInfo,
  TotalPrice,
} from '@/components/AddOrder/OrderItem';
import { Disclaimer } from '@/components/AddOrder/Page/ResultTable';
import Checkbox from '@/components/Checkbox';
import Input from '@/components/Input';
import SelectWithLabel from '@/components/SelectWithLabel';

import { orderActions } from '@/store/actions/orderActions';
import { userActions } from '@/store/actions/userActions';

import {
  IFoundedItems,
  MaskedInputTypes,
  TManualProducts,
} from '@/store/reducers/order';
import { FullfilmentType } from '@/store/reducers/services';
import { PopupTypes } from '@/store/reducers/user';

import {
  selectInitialStandardSearcheData,
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
  inputs: [string, MaskedInputTypes][],
  disclaimer?: string,
  isLast: boolean,
}

const OrderItem: React.FC<Props> = ({
  name,
  price,
  productId,
  region,
  inputs,
  disclaimer,
  isLast,
}) => {
  const [isSelected, toggleIsSelected] = useToggle();
  const [value, setValue] = useState<[string, ExtendedCommonInputTypes[]]>(
    [inputs[0][0], extendCommonInputs(inputs[0][1].data, region)],
  );
  const [selectedStructure, setSelectedStructure] = useState(0);
  const [items, setItems] = useState<IFoundedItems[]>([]);
  const [isButtonPressed, toggleIsButtonPressed] = useToggle();
  const itemRef = useRef<HTMLLIElement>(null);

  const matter = useSelector(selectMatter);
  const products = useSelector(selectOrderManuallyProducts);
  const data = useSelector(selectInitialStandardSearcheData);
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
    setValue([inputs[selectedStructure][0], extendCommonInputs(inputs[selectedStructure][1].data, region)]);
  }, [selectedStructure]);

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
            maxWidth="257px"
            labelFontSize="14px"
            labelColor="var(--primary-dark-color)"
            openToTop={isLast}
            topThreshold={82}
            bottomThreshold={103}
          />
        );
      }
      case 'checkbox': {
        return (
          <CheckboxWrapper key={el.label + el.type + i}>
            <Checkbox
              type="checkbox"
              checked={el.value}
              onChange={() => onChangeHandler(!el.value, i)}
            />
            <span>
              {el.label}
            </span>
          </CheckboxWrapper>
        );
      }
      default: return '';
    }
  };

  const validateAll = () => {
    setValue((prevState) => [
      prevState[0],
      validateCommonInputs(prevState[1], productId),
    ]);
  };

  const validateService = (v: string | number, inputIndex: number) => {
    if (value[1][inputIndex].type === 'checkbox') return;

    setValue((prevState) => {
      const result = [...prevState[1]];
      let isError = '';

      const currentInput = result[inputIndex];
      const isRequired = 'isRequired' in currentInput ? currentInput.isRequired : false;

      if (typeof v === 'string') {
        isError = servicesValidation(v, productId, result[inputIndex].label, isRequired);
      } else if (isRequired && !isNumber(v)) {
        isError = 'Field is required';
      }

      result[inputIndex].isError = !!isError;
      result[inputIndex].errorMessage = isError;

      return [prevState[0], result];
    });
  };

  const onChangeHandler = (v: string | number | boolean, index: number) => {
    setValue((prevState) => {
      const result = [...prevState[1]];

      result[index].value = v;

      return [prevState[0], result];
    });

    if (typeof v !== 'boolean') validateService(v, index);
  };

  const onAddClick = () => {
    validateAll();
    toggleIsButtonPressed(true);

    const { mask } = inputs[selectedStructure][1];

    const result = generateManualDescription(value[1], mask);

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
      const isHaveError = value[1].find((item) => item.isError || item.errorMessage);

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

      value[1].forEach((el) => {
        if (typeof el.value === 'string' && el.value.trim()) {
          newItem.manualInputs!.push({
            key: el.label,
            value: el.value.trim(),
          });
        }

        if (typeof el.value === 'number' && 'keys' in el) {
          newItem.manualInputs!.push({
            key: el.label,
            value: el.keys[el.value],
          });
        }

        if (typeof el.value === 'boolean') {
          newItem.manualInputs!.push({
            key: 'Additional',
            value: el.label,
          });
        }
      });

      setItems((prevState) => [...prevState, newItem]);
      setValue([inputs[selectedStructure][0], extendCommonInputs(inputs[selectedStructure][1].data, region)]);
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
        const result = [...prevState[1]];
        result[i].isError = false;
        result[i].errorMessage = '';
        return [prevState[0], result];
      });
    }
  };

  const selectedItemsCount = items.filter((el) => el.isChosen).length;
  const totalPrice = selectedItemsCount * +price;
  const isError = useMemo(() => (
    value[1].find((el) => el.type !== 'checkbox' && el.errorMessage)
  ), [value, isButtonPressed]);
  const isSmall = value[1].length < 3 && !value[1].some((el) => el.type === 'checkbox');

  useEffect(() => {
    if (data) {
      onChangeHandler(data.firstName || '', 0);
      onChangeHandler(data.surname || '', 1);
    }

    if (productToScroll === productId) {
      toggleIsSelected(true);
    }

    return () => {
      dispatch(orderActions.setInitialStandardSearcheData(null));
    };
  }, [data]);

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
          <SelectWithLabel
            label="Search By"
            isRequired={false}
            selectedItem={selectedStructure}
            infotip={inputs[selectedStructure][1].infotip}
            setSelectedItem={setSelectedStructure}
            items={inputs
              .filter((el) => el[0] !== 'sortOrder')
              .map((el) => el[0])}
            maxWidth="257px"
            labelFontSize="14px"
            labelColor="var(--primary-dark-color)"
          />
          <Inputs
            style={{
              marginBottom: disclaimer
                ? '8px'
                : items.length ? '24px' : '16px',
              marginTop: '24px',
            }}
          >
            {value[1].map((el, i) => getInputByType(el, i, value[1].length === 1))}
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
              style={{ marginBottom: items.length ? '24px' : '16px' }}
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

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  grid-gap: 8px;
  flex-basis: 100%;
  cursor: pointer;
  
  span {
    font-size: 14px;
    user-select: none;
  }
`;

export default OrderItem;
