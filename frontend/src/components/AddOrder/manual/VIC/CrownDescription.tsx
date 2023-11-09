import React, {
  FC,
  useEffect, useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
import DoubleSelect from '@/components/DoubleSelect';
import Input from '@/components/Input';
import SelectWithLabel from '@/components/SelectWithLabel';
import Textarea from '@/components/Textarea';

import { orderActions } from '@/store/actions/orderActions';
import { userActions } from '@/store/actions/userActions';

import { IFoundedItems, TManualProducts } from '@/store/reducers/order';
import { FullfilmentType, IOrganisationService } from '@/store/reducers/services';
import { PopupTypes } from '@/store/reducers/user';

import { selectMatter, selectOrderManuallyProducts, selectProductToScroll } from '@/store/selectors/orderSelectors';

import useInput from '@/hooks/useInput';
import useIsFirstRender from '@/hooks/useIsFirstRender';
import useToggle from '@/hooks/useToggle';

import formatByMask from '@/utils/formatByMask';
import { getRegionsSelectorData } from '@/utils/getRegionsData';
import servicesValidation, { validateMatter } from '@/utils/servicesValidation';

import { AppDispatch } from '@/store';

const structure = ['Free-Text', 'Structured'];
const dividers = ['Parish', 'Township'];
const parishTownship = [
  ...getRegionsSelectorData.VIC.parish,
  ...getRegionsSelectorData.VIC.township,
];

interface Props {
  product: IOrganisationService,
  isLast: boolean,
}

const CrownDescription: FC<Props> = ({ product, isLast }) => {
  const itemRef = useRef<HTMLLIElement>(null);
  const [isSelected, toggleIsSelected] = useToggle();
  const [selectedStructure, setSelectedStructure] = useState(0);
  const [isButtonPressed, toggleIsButtonPressed] = useToggle();
  const [freeText, setFreeText] = useInput();
  const [allotments, setAllotments] = useInput();
  const [portion, setPortion] = useInput();
  const [block, setBlock] = useInput();
  const [section, setSection] = useInput();
  const [subdivision, setSubdivision] = useInput();
  const [selectedParishTownship, setSelectedParishTownship] = useState();
  const [isFreeTextError, setIsFreeTextError] = useState('');
  const [isAllotmentsError, setIsAllotmentsError] = useState('');
  const [isPortionError, setIsPortionError] = useState('');
  const [isBlockError, setIsBlockError] = useState('');
  const [isSectionError, setIsSectionError] = useState('');
  const [isSubdivisionError, setIsSubdivisionError] = useState('');
  const [isParishTownshipError, setIsParishTownshipError] = useState('');
  const [items, setItems] = useState<IFoundedItems[]>([]);

  const matter = useSelector(selectMatter);
  const products = useSelector(selectOrderManuallyProducts);
  const productToScroll = useSelector(selectProductToScroll);

  const dispatch = useDispatch<AppDispatch>();
  const isFirstRender = useIsFirstRender();

  useLayoutEffect(() => {
    if (itemRef.current && productToScroll === product.productId) {
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
    const newItems: TManualProducts = {
      ...products,
    };
    newItems[product.productId] = items;
    dispatch(orderActions.setOrderManuallyProducts(newItems));
  }, [items]);

  useEffect(() => {
    setIsFreeTextError(
      !selectedStructure
        ? servicesValidation(
          freeText.trim(),
          product.productId,
          'Crown Description',
          true,
        ) : '',
    );
  }, [selectedStructure, freeText, isFirstRender]);

  useEffect(() => {
    setIsAllotmentsError(
      selectedStructure
        ? servicesValidation(
          allotments.trim(),
          product.productId,
          'Allotments',
        ) : '',
    );
  }, [selectedStructure, allotments, isFirstRender]);

  useEffect(() => {
    setIsPortionError(
      selectedStructure
        ? servicesValidation(
          portion.trim(),
          product.productId,
          'Portion',
        ) : '',
    );
  }, [selectedStructure, portion, isFirstRender]);

  useEffect(() => {
    setIsBlockError(
      selectedStructure
        ? servicesValidation(
          block.trim(),
          product.productId,
          'Block',
        ) : '',
    );
  }, [selectedStructure, block, isFirstRender]);

  useEffect(() => {
    setIsSectionError(
      selectedStructure
        ? servicesValidation(
          section.trim(),
          product.productId,
          'Section',
        ) : '',
    );
  }, [selectedStructure, section, isFirstRender]);

  useEffect(() => {
    setIsSubdivisionError(
      selectedStructure
        ? servicesValidation(
          subdivision.trim(),
          product.productId,
          'Subdivision',
        ) : '',
    );
  }, [selectedStructure, subdivision, isFirstRender]);

  useEffect(() => {
    setIsParishTownshipError(
      selectedStructure
        ? selectedParishTownship
          ? ''
          : 'Field is required'
        : '',
    );
  }, [selectedStructure, selectedParishTownship, isFirstRender]);

  const onAddClick = () => {
    toggleIsButtonPressed(true);

    if (isUnableToAdd) return;

    const isMatterError = validateMatter(matter);

    if (isMatterError) {
      dispatch(orderActions.setIsMatterError(isMatterError));
      return;
    }

    let result: string;

    if (selectedStructure) {
      const mask = '{{allotments}}{{portion}}{{block}}{{section}}{{subdivision}}{{parish}}{{township}}';
      const data: { [p in string]: string } = {
        allotments: allotments ? `Allotments ${allotments} ` : '',
        portion: portion ? `Portion ${portion} ` : '',
        block: block ? `Block ${block} ` : '',
        section: section ? `Section ${section} ` : '',
        subdivision: subdivision ? `Subdivision ${subdivision} ` : '',
      };

      const isParish = getRegionsSelectorData.VIC.parish.includes(selectedParishTownship!);

      if (isParish) {
        data.parish = `Parish of ${selectedParishTownship!}`;
        data.township = '';
      } else {
        data.township = `Township of ${selectedParishTownship!}`;
        data.parish = '';
      }

      result = formatByMask(mask, data);
    } else {
      result = freeText;
    }

    const isItemExist = items.find((item) => item.id === result);

    if (isItemExist) {
      dispatch(userActions.setPopup({
        type: PopupTypes.INFO,
        mainText: 'Info',
        additionalText: `Item already added to ${product.label}`,
        applyTimeout: false,
      }));

      return;
    }

    const newItem: IFoundedItems = {
      id: result,
      description: result,
      identifier: '',
      price: product.priceInclGST,
      render: {
        value: result,
      },
      isChosen: true,
      productId: product.productId,
      searchDescription: result,
      type: FullfilmentType.MANUAL,
      manualInputs: [{
        key: 'Crown Description',
        value: result,
      }],
    };

    setItems((prevState) => [...prevState, newItem]);

    setFreeText('');
    setAllotments('');
    setPortion('');
    setBlock('');
    setSection('');
    setSubdivision('');
    setSelectedParishTownship(undefined);
    toggleIsButtonPressed(false);
    dispatch(orderActions.setIsOrderStarted(true));
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

  const isUnableToAdd = !!(
    isFreeTextError
    || isAllotmentsError
    || isPortionError
    || isBlockError
    || isSectionError
    || isSubdivisionError
    || isParishTownshipError
  );

  const selectedItemsCount = items.filter((el) => el.isChosen).length;
  const totalPrice = selectedItemsCount * +product.priceInclGST;

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
            {product.label}
            <span>{` ($${Number(+product.priceInclGST / 100).toFixed(2)})`}</span>
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
            setSelectedItem={setSelectedStructure}
            items={structure}
            maxWidth="257px"
            labelFontSize="14px"
            labelColor="var(--primary-dark-color)"
          />
          <Inputs
            style={{
              marginBottom: product.serviceDisclaimer && !selectedStructure ? '8px' : '24px',
              marginTop: '24px',
            }}
          >
            {selectedStructure ? (
              <>
                <Input
                  key={`${product.label} Allotments`}
                  value={allotments}
                  onChange={setAllotments}
                  onBlur={() => !allotments && setIsAllotmentsError('')}
                  label="Allotments"
                  labelColor="#1A1C1E"
                  labelFontSize="14px"
                  placeholder="123"
                  inputMarginBottom="0"
                  isError={!!(isButtonPressed && isAllotmentsError)}
                  errorMessage={isAllotmentsError}
                  style={{
                    width: '257px',
                  }}
                />
                <Input
                  key={`${product.label} Portion`}
                  value={portion}
                  onChange={setPortion}
                  onBlur={() => !portion && setIsPortionError('')}
                  label="Portion"
                  labelColor="#1A1C1E"
                  labelFontSize="14px"
                  placeholder="49"
                  inputMarginBottom="0"
                  isError={!!(isButtonPressed && isPortionError)}
                  errorMessage={isPortionError}
                  style={{
                    width: '257px',
                  }}
                />
                <Input
                  key={`${product.label} Block`}
                  value={block}
                  onChange={setBlock}
                  onBlur={() => !block && setIsBlockError('')}
                  label="Block"
                  labelColor="#1A1C1E"
                  labelFontSize="14px"
                  placeholder="1"
                  inputMarginBottom="0"
                  isError={!!(isButtonPressed && isBlockError)}
                  errorMessage={isBlockError}
                  style={{
                    width: '257px',
                  }}
                />
                <Input
                  key={`${product.label} Section`}
                  value={section}
                  onChange={setSection}
                  onBlur={() => !section && setIsSectionError('')}
                  label="Section"
                  labelColor="#1A1C1E"
                  labelFontSize="14px"
                  placeholder="A"
                  inputMarginBottom="0"
                  isError={!!(isButtonPressed && isSectionError)}
                  errorMessage={isSectionError}
                  style={{
                    width: '257px',
                  }}
                />
                <Input
                  key={`${product.label} Subdivision`}
                  value={subdivision}
                  onChange={setSubdivision}
                  onBlur={() => !subdivision && setIsSubdivisionError('')}
                  label="Subdivision"
                  labelColor="#1A1C1E"
                  labelFontSize="14px"
                  placeholder="ABC"
                  inputMarginBottom="0"
                  isError={!!(isButtonPressed && isSubdivisionError)}
                  errorMessage={isSubdivisionError}
                  style={{
                    width: '257px',
                  }}
                />
              </>
            ) : (
              <Textarea
                label="Crown Description"
                labelColor="#1A1C1E"
                labelFontSize="14px"
                inputHeight="70px"
                inputMarginBottom="0"
                placeholder="Allotments 12A Section B Parish of Hotham"
                value={freeText}
                onChange={setFreeText}
                isError={!!(isButtonPressed && isFreeTextError)}
                errorMessage={isFreeTextError}
                required
                style={{
                  width: '538px',
                  resize: 'none',
                }}
              />
            )}
          </Inputs>
          {!!selectedStructure && (
            <DoubleSelect
              label="Parish/Township"
              selectedItem={selectedParishTownship}
              setSelectedItem={setSelectedParishTownship}
              dividers={dividers}
              items={parishTownship}
              isRequired
              labelFontSize="14px"
              maxWidth="538px"
              marginBottom={product.serviceDisclaimer ? '8px' : '24px'}
              labelColor="var(--primary-dark-color)"
              placeholder="Select or search a Parish or Township"
              isError={!!(isButtonPressed && isParishTownshipError)}
              errorMessage={isParishTownshipError}
              openToTop={isLast}
              topThreshold={82}
              bottomThreshold={103}
            />
          )}
          {product.serviceDisclaimer && (
            <Disclaimer
              marginBottom={items.length ? '24px' : '16px'}
              padding="0"
              border="none"
              color="rgba(0, 0, 0, .5)"
            >
              {product.serviceDisclaimer}
            </Disclaimer>
          )}
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

export default CrownDescription;
