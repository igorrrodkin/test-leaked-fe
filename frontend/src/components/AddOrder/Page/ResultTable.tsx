import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import AddIcon from '@/assets/icons/AddIcon';
import CloseIcon from '@/assets/icons/CloseIcon';

import Background from '@/components/Background';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import Pagination from '@/components/Pagination';

import { orderActions } from '@/store/actions/orderActions';

import { IFoundedItems } from '@/store/reducers/order';
import { FullfilmentType } from '@/store/reducers/services';

import {
  selectCurrentService,
  selectCurrentServiceName,
  selectFoundedItems,
  selectOrder,
  selectOrderManuallyProducts,
  selectOrderProducts,
} from '@/store/selectors/orderSelectors';

import useModalWindow from '@/hooks/useModalWindow';
import useToggle from '@/hooks/useToggle';

import { getIdentifier } from '@/utils/getIdentifier';
import { getLotPlanName } from '@/utils/getLotPlanName';
import getNounByForm from '@/utils/getNounByForm';
import getRegionsData, { ExistingRegions, regionsWithInlineVerification } from '@/utils/getRegionsData';
import orderTableStructure from '@/utils/orderTableStructure';

import { AppDispatch } from '@/store';

const limits = [20, 50, 100];

const ResultTable = () => {
  const [selectedItems, setSelectedItems] = useState<IFoundedItems[]>([]);
  const [isAllCheckboxSelected, toggleIsAllCheckboxSelected] = useToggle();
  const [limit, setLimit] = useState(0);
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentService = useSelector(selectCurrentService)!;
  const currentOrder = useSelector(selectOrder)!;
  const currentServiceName = useSelector(selectCurrentServiceName);
  const foundedData = useSelector(selectFoundedItems)![currentService.identifier!] || [];
  const orderProducts = useSelector(selectOrderProducts);
  const orderManualProducts = useSelector(selectOrderManuallyProducts);
  const currentRegion = getRegionsData().find((el) => el.region === currentService.region)!;

  const dispatch = useDispatch<AppDispatch>();

  useModalWindow();

  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.scrollTo(0, 0);
    }
  }, [offset]);

  useEffect(() => {
    if (orderProducts) {
      setSelectedItems(orderProducts.filter((el) => (
        foundedData.find((item) => item.id === el.id)
      )));
    }
  }, [orderProducts]);

  const selectAllCheckboxes = (isSelected: boolean) => {
    if (!isSelected) {
      setSelectedItems([]);
      toggleIsAllCheckboxSelected(false);
    } else {
      setSelectedItems(foundedData);
      toggleIsAllCheckboxSelected(true);
    }
  };

  const selectItem = (item: any) => {
    setSelectedItems((prevState) => {
      const isChecked = prevState.findIndex((el) => el.id === item.id);

      if (isChecked >= 0) {
        return prevState.filter((el) => el.id !== item.id);
      }

      return [...prevState, item];
    });
    toggleIsAllCheckboxSelected(false);
  };

  const createWorkspace = () => {
    if (selectedItems.length) {
      let mappedItems: IFoundedItems[] = selectedItems.map((el) => {
        const isChosen = orderProducts?.find((product) => product.id === el.id)?.isChosen;
        const isInline = regionsWithInlineVerification.includes(currentRegion.region);
        const status = el.render?.status;

        return {
          ...el,
          render: { ...el.render, searchedBy: currentServiceName },
          identifier: getIdentifier(currentRegion.region),
          isChosen: status === 'Cancelled' ? false : typeof isChosen === 'boolean' ? isChosen : !isInline,
          isUnable: (el.identifier === 'HTOIQ' || el.identifier === 'HTOOQ') ? false : typeof isChosen !== 'boolean',
          isVerified: false,
        };
      });

      if (orderProducts) {
        mappedItems = mappedItems.filter((el) => (
          !orderProducts.find((p) => p.id === el.id)
        ));
      }

      dispatch(orderActions.setOrderProducts([
        ...(orderProducts || []),
        ...mappedItems,
      ]));

      const updatedManualProducts = { ...orderManualProducts };

      mappedItems.forEach((el) => {
        if (el.type === FullfilmentType.MANUAL) {
          updatedManualProducts[el.productId] = [
            ...updatedManualProducts[el.productId],
            {
              ...el,
              isChosen: true,
            },
          ];
        }
      });

      dispatch(orderActions.setOrderManuallyProducts(updatedManualProducts));

      close();
    }
  };

  const close = useCallback(() => {
    dispatch(orderActions.setIsResultsVisible(false));
  }, []);

  const maxPages = Math.ceil(foundedData.length / limits[limit]);
  const calculatedOffset = maxPages > 1 ? offset : 0;
  const filteredItems: IFoundedItems[] = [];

  if (maxPages >= 1) {
    const idk = calculatedOffset * limits[limit] + limits[limit];
    const pageLimit = idk > foundedData.length ? foundedData.length : idk;

    for (let i = calculatedOffset * limits[limit]; i < pageLimit; i += 1) {
      filteredItems.push(foundedData[i]);
    }
  }

  return foundedData.length ? (
    <Background close={close}>
      <Container onClick={(evt) => evt.stopPropagation()}>
        <HeaderWrapper>
          <Header>
            <H3>
              {currentService.productId === 'LANSTADDR' ? (
                'Verify Address - Property Details'
              ) : currentService.productId === 'LANLOTPLN' ? (
                'Verify Lot/Plan - Property Details'
              ) : currentOrder ? (
                currentOrder.orderItems[0].service
              ) : 'Results'}
            </H3>
            <CloseIcon handler={close} />
          </Header>
        </HeaderWrapper>
        <TableWrapper ref={containerRef}>
          <Banners>
            <SearchCriteria>
              Your search for ‘
              {foundedData[0].identifier === 'HTLPV' ? (
                <span>{getLotPlanName(foundedData[0].searchDescription)}</span>
              ) : (
                <span>{foundedData[0].searchDescription}</span>
              )}
              ’ returned the following
              <span>
                {' '}
                {foundedData.length}
              </span>
              {' '}
              {foundedData.length > 1 || foundedData.length === 0 ? 'results' : 'result'}
              {currentRegion.region === ExistingRegions.VIC ? ' and you have been charged' : ''}
              . A copy of the results have been sent to Order Manager
            </SearchCriteria>
            {currentService.productId === 'INT-SAPLNPRCLS' && (
            <Warning>
              Due to a current technical limitation, this search has been limited to the first page results.
              If additional pages are required, please reach out to support.
            </Warning>
            )}
            {currentRegion.maxResultsBeforeWarning && foundedData.length >= currentRegion.maxResultsBeforeWarning && (
              <Warning>
                {currentRegion.warningMessage}
              </Warning>
            )}
          </Banners>
          {!!orderTableStructure[foundedData[0].identifier][2] && (
            <Table>
              <THead>
                <tr>
                  {orderTableStructure[foundedData[0].identifier][2].map(
                    (el: string, i: number) => (
                      <th key={el + i}>
                        {el}
                      </th>
                    ),
                  )}
                </tr>
              </THead>
              <TBody>
                {filteredItems.slice(0, 1).map((item) => (
                  <TRow
                    key={item.id}
                  >
                    {orderTableStructure[foundedData[0].identifier][3].map(
                      (el: string) => (
                        <th key={item.id + el}>
                          {item.render[el]}
                        </th>
                      ),
                    )}
                  </TRow>
                ))}
              </TBody>
            </Table>
          )}
          <Table>
            <THead>
              <tr>
                <CheckboxCell>
                  <Checkbox
                    type="checkbox"
                    checked={isAllCheckboxSelected}
                    onChange={({ target }) => selectAllCheckboxes(target.checked)}
                  />
                </CheckboxCell>
                {orderTableStructure[foundedData[0].identifier][0].map(
                  (el: string, i: number) => el[0] !== ' ' && (
                    <th key={el + i}>
                      {el.trim()}
                    </th>
                  ),
                )}
              </tr>
            </THead>
            <TBody>
              {filteredItems.map((item) => (
                <TRow
                  key={item.id}
                  isChecked={!!selectedItems.find((el) => item.id === el.id)}
                  onClick={() => selectItem(item)}
                >
                  <th>
                    <Checkbox
                      type="checkbox"
                      checked={!!selectedItems.find((el) => item.id === el.id)}
                      onChange={() => selectItem(item)}
                    />
                  </th>
                  {orderTableStructure[foundedData[0].identifier][1].map(
                    (el: string) => el[0] !== ' ' && (
                      <th
                        key={item.id + el}
                        style={{
                          whiteSpace: foundedData[0].identifier === 'HTPPS' && (el === 'address' || el === 'valuations')
                            ? 'pre-wrap' : 'initial',
                        }}
                      >
                        {item.render[el.trim()]}
                      </th>
                    ),
                  )}
                </TRow>
              ))}
            </TBody>
          </Table>
          {!!filteredItems && (
            <Pagination
              changePage={setOffset}
              currentPage={calculatedOffset}
              maxPages={maxPages}
              maxElements={foundedData.length}
              limits={limits}
              limit={limit}
              setLimit={setLimit}
            />
          )}
          {currentService.productId === 'LANLOTPLN' ? (
            <Disclaimer>
              © State of Victoria. This publication is copyright and includes confidential information.
              No part may be reproduced by any process except in accordance with the provisions
              of the Copyright Act 1968 (Cth) or pursuant to a written agreement.
              the State of Victoria does not warrant the accuracy or completeness of information
              in the publication and any person using or relying upon such information does
              so on the basis that the State of Victoria shall bear no responsibility or
              liability whatsoever for any errors, faults, defects or omissions in the information.
            </Disclaimer>
          ) : currentService.searchResultDisclaimer ? (
            <Disclaimer>
              {currentService.searchResultDisclaimer}
            </Disclaimer>
          ) : null}
        </TableWrapper>
        <ButtonSection>
          <ItemsCount>
            {getNounByForm(selectedItems.length, 'Item')}
          </ItemsCount>
          <StyledButton
            disabled={!selectedItems.length}
            onClick={createWorkspace}
          >
            <AddIcon />
            Add Selected
          </StyledButton>
        </ButtonSection>
      </Container>
    </Background>
  ) : (
    <></>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: auto minmax(50px, 1fr) auto;
  padding: 32px 0;
  border-radius: 12px;
  background-color: #fff;
  max-width: 1120px;
  width: 100%;
  max-height: 80vh;
  min-height: 400px;
  overflow-y: auto;
  cursor: default;
  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const HeaderWrapper = styled.div`
  padding: 0 32px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-gap: 16px;
  margin-bottom: 32px;

  svg {
    cursor: pointer;
  }
`;

const H3 = styled.h3`
  font-size: 18px;
  font-weight: 600;
`;

const Banners = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 16px;
  margin-bottom: 32px;
`;

const SearchCriteria = styled.p`
  padding: 12px 24px;
  border-left: 4px solid var(--primary-green-color);
  background-color: #d4fadd;
  font-size: 18px;
  color: #074b4e;

  span {
    font-weight: 600;
    color: #074b4e;
  }
`;

const Warning = styled.p`
  padding: 12px 24px;
  border-left: 4px solid var(--primary-warning-color);
  background-color: var(--primary-warning-background-color);
  font-size: 18px;
  color: var(--primary-warning-color);
`;

const TableWrapper = styled.div`
  margin-bottom: 1rem;
  padding: 0 32px;
  overflow-x: auto;
  overflow-y: auto;
  width: calc(100% - 4px);
  scrollbar-color: rgba(163, 163, 163, 0.7);

  &::-webkit-scrollbar-thumb {
    outline: 2px solid transparent;
    height: 20%;
    width: 20%;
    background-color: rgba(163, 163, 163, 0.7);
    border-radius: 4px;
  }

  &::-webkit-scrollbar {
    transition: all 0.3s ease-in;
    width: 5px;
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 0 transparent;
    -webkit-box-shadow: inset 0 0 0 transparent;
    background: transparent;
    margin: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(163, 163, 163, 0.7);
  }
`;

const Table = styled.table`
  display: table;
  margin-bottom: 32px;
  width: 100%;
  border-spacing: 0;
  -webkit-border-horizontal-spacing: 0;
  -webkit-border-vertical-spacing: 0;

  * {
    white-space: nowrap;
  }
`;

const THead = styled.thead`
  background-color: #f9f9f9;

  th {
    padding: 12px 35px 12px 0;
    font-size: 12px;
    font-weight: 400;
    color: rgba(17, 24, 39, 0.5);
    text-transform: uppercase;
    text-align: left;
    user-select: none;

    :first-child {
      padding: 12px;
      border-top-left-radius: 4px;
    }

    :last-child {
      border-top-right-radius: 4px;
    }
  }
`;

const CheckboxCell = styled.th`
  width: 18px;
`;

const TBody = styled.tbody`
  th {
    padding: 14px 35px 14px 0;
    max-width: 200px;
    height: 64px;
    background-color: #fff;
    font-size: 14px;
    font-weight: 500;
    text-align: left;
    white-space: normal;

    :first-child {
      padding-left: 12px;
    }
  }
`;

const TRow = styled.tr<{ isChecked?: boolean }>`
  cursor: pointer;

  th {
    background-color: ${({ isChecked }) => (isChecked ? '#E8F6FA' : '#fff')};
    user-select: none;
  }

  :hover th {
    background-color: ${({ isChecked }) => (isChecked ? '#E8F6FA' : '#F9F9F9')};
  }

  :last-child {
    th:first-child {
      border-bottom-left-radius: 4px;
    }

    th:last-child {
      border-bottom-right-radius: 4px;
    }
  }
`;

export const Disclaimer = styled.p<{
  padding?: string,
  marginTop?: string,
  marginBottom?: string,
  color?: string,
  border?: string,
}>`
  margin-top: ${({ marginTop = '0' }) => marginTop};
  margin-bottom: ${({ marginBottom = '32px' }) => marginBottom};
  padding: ${({ padding = '32px 0' }) => padding};
  border-bottom: ${({ border = '1px solid #e8e8e8' }) => border};
  font-size: 12px;
  color: ${({ color = '#111827' }) => color};
  white-space: pre-line;
`;

const ButtonSection = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  grid-gap: 16px;
  padding: 0 32px;
`;

const ItemsCount = styled.span`
  padding: 10px 24px;
  border: 1px solid #dce4e8;
  border-radius: 100px;
  font-size: 18px;
  font-weight: 600;
  text-transform: capitalize;
`;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  grid-gap: 8px;
`;

export default ResultTable;
