import React, {
  useCallback,
  useEffect, useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';

import AddIcon from '@/assets/icons/AddIcon';
import CloseIcon from '@/assets/icons/CloseIcon';

import Background from '@/components/Background';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import Loader from '@/components/Loader';
import Pagination from '@/components/Pagination';

import { getPaginatedDataAction, orderActions } from '@/store/actions/orderActions';

import { EPaginationIdentifiers, IFoundedItems } from '@/store/reducers/order';
import { FullfilmentType } from '@/store/reducers/services';

import {
  selectCurrentService,
  selectCurrentServiceName,
  selectFoundedItems, selectMatter,
  selectOrder,
  selectOrderManuallyProducts,
  selectOrderProducts, selectPagination,
} from '@/store/selectors/orderSelectors';

import useIsFirstRender from '@/hooks/useIsFirstRender';
import useModalWindow from '@/hooks/useModalWindow';
import useToggle from '@/hooks/useToggle';

import getNounByForm from '@/utils/getNounByForm';
import orderTableStructure from '@/utils/orderTableStructure';

import { AppDispatch } from '@/store';

const limits = [10, 20, 50, 100];

const ResultTable = () => {
  const [selectedItems, setSelectedItems] = useState<IFoundedItems[]>([]);
  const [isAllCheckboxSelected, toggleIsAllCheckboxSelected] = useToggle();
  const [limit, setLimit] = useState(0);
  const [prevOffset, setPrevOffset] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, toggleIsLoading] = useToggle();
  const containerRef = useRef<HTMLDivElement>(null);

  const matter = useSelector(selectMatter);
  const currentService = useSelector(selectCurrentService)!;
  const currentServiceName = useSelector(selectCurrentServiceName);
  const currentOrder = useSelector(selectOrder)!;
  const foundedData = useSelector(selectFoundedItems)![currentService.identifier!] || [];
  const orderProducts = useSelector(selectOrderProducts);
  const orderManualProducts = useSelector(selectOrderManuallyProducts);
  const pagination = useSelector(selectPagination)[currentService.identifier!];

  const dispatch = useDispatch<AppDispatch>();
  const isFirstRender = useIsFirstRender();

  useModalWindow();

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth',
      });
    }

    if (!isFirstRender) {
      getNewData();
    }
  }, [offset]);

  useEffect(() => {
    if (orderProducts) {
      setSelectedItems(orderProducts.filter((el) => (
        foundedData.find((item) => item.id === el.id)
      )));
    }
  }, [orderProducts]);

  const getNewData = async () => {
    if (foundedData.find((el) => el.pageIndex === offset)) return;

    try {
      toggleIsLoading(true);
      await dispatch(getPaginatedDataAction(
        {
          identifier: EPaginationIdentifiers[currentService.identifier!],
          region: currentService.region,
          matter,
          input: {
            ...foundedData[0].searchCriteria!,
            pageIndex: offset + 1,
          },
        },
        foundedData[0].price,
        foundedData[0].searchDescription,
        offset,
      ));
      toggleIsLoading(false);
    } catch (e) {
      setOffset(prevOffset);
      toggleIsLoading(false);
    }
  };

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

        return {
          ...el,
          render: { ...el.render, searchedBy: currentServiceName },
          isChosen: typeof isChosen === 'boolean' ? isChosen : true,
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

  return foundedData.length ? (
    <Background close={close}>
      <Container onClick={(evt) => evt.stopPropagation()}>
        <HeaderWrapper>
          <Header>
            <H3>
              {currentOrder ? (
                currentOrder.orderItems[0].service
              ) : 'Results'}
            </H3>
            <CloseIcon handler={close} />
          </Header>
        </HeaderWrapper>
        <TableWrapper
          ref={containerRef}
          isLoading={isLoading}
        >
          <SearchCriteria>
            Your search for ‘
            <span>{currentOrder.description}</span>
            ’ returned the following
            <span>
              {' '}
              {pagination.totalCount}
            </span>
            {' '}
            {pagination.totalCount > 1 || pagination.totalCount === 0 ? 'results' : 'result'}
            .
          </SearchCriteria>
          {currentService.productId === 'INT-SAPLNPRCLS' && pagination.totalCount > 1 && (
          <Warning>
            Due to a current technical limitation, this search has been limited to the first page results.
            If additional pages are required, please reach out to support.
          </Warning>
          )}
          <div style={{ margin: '12px 0 32px 0' }} />
          {!isLoading ? (
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
                {foundedData.filter((el) => el.pageIndex === offset).map((item) => (
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
          ) : <Loader flexGrow="1" />}
          {!!foundedData && (
            <Pagination
              changePage={setOffset}
              currentPage={offset}
              maxPages={pagination.totalPages}
              maxElements={pagination.totalCount}
              limits={limits}
              limit={limit}
              hideSelectLimit
              setLimit={setLimit}
              setPrevOffset={setPrevOffset}
            />
          )}
          {currentService.region === 'SA' ? null : (
            <Info>
              This information is provided as a searching aid only.
              the register general does not guarantee the information
            </Info>
          )}
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
  height: 100%;
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

const TableWrapper = styled.div<{ isLoading: boolean }>`
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
  
  ${({ isLoading }) => isLoading && css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `}
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

const Info = styled.p`
  margin-bottom: 32px;
  padding: 32px 0;
  border-bottom: 1px solid #e8e8e8;
  font-size: 12px;
  color: #111827;
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

const Warning = styled.p`
  margin: 12px 0 0 0;
  padding: 12px 24px;
  border-left: 4px solid var(--primary-warning-color);
  background-color: var(--primary-warning-background-color);
  font-size: 18px;
  color: var(--primary-warning-color);
`;

export default ResultTable;
