import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';

import CloseIcon from '@/assets/icons/CloseIcon';

import Background from '@/components/Background';
import Loader from '@/components/Loader';
import Pagination from '@/components/Pagination';

import { getPaginatedDataAction, initializeOrderAction, orderActions } from '@/store/actions/orderActions';

import { EPaginationIdentifiers, IVerifiedItem } from '@/store/reducers/order';

import {
  selectCurrentService, selectMatter, selectPagination,
  selectVerifiedItems, selectVerifyTempData,
} from '@/store/selectors/orderSelectors';

import useIsFirstRender from '@/hooks/useIsFirstRender';
import useModalWindow from '@/hooks/useModalWindow';
import useToggle from '@/hooks/useToggle';

import orderTableStructure from '@/utils/orderTableStructure';

import { AppDispatch } from '@/store';

const limits = [10, 20, 50, 100];

const VerifiedTableWithPagination: React.FC = () => {
  const [limit, setLimit] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, toggleIsLoading] = useToggle();
  const [isPaginationLoading, toggleIsPaginationLoading] = useToggle();
  const [itemToLoad, setItemToLoad] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const matter = useSelector(selectMatter);
  const currentService = useSelector(selectCurrentService)!;
  const verifiedItems = useSelector(selectVerifiedItems)!;
  const verifyTempData = useSelector(selectVerifyTempData)!;
  const pagination = useSelector(selectPagination)[verifyTempData.identifier];

  const dispatch = useDispatch<AppDispatch>();
  const isFirstRender = useIsFirstRender();

  useModalWindow();

  useEffect(() => () => {
    close();
  }, []);

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

  const getNewData = async () => {
    if (verifiedItems.find((el) => el.pageIndex === offset)) return;

    try {
      toggleIsPaginationLoading(true);
      await dispatch(getPaginatedDataAction(
        {
          identifier: EPaginationIdentifiers[verifyTempData.identifier],
          region: currentService.region,
          matter,
          input: {
            ...verifiedItems[0].searchCriteria!,
            pageIndex: offset + 1,
          },
        },
        '',
        '',
        offset,
        true,
      ));
      toggleIsPaginationLoading(false);
    } catch (e) {
      toggleIsPaginationLoading(false);
    }
  };

  const selectItem = async (item: IVerifiedItem) => {
    try {
      if (item.inputs.matterReference) {
        toggleIsLoading(true);
        await dispatch(initializeOrderAction(
          currentService.region,
          `${currentService.region}: ${currentService.label}`,
          {
            productId: currentService.productId,
            identifier: currentService.identifier!,
            input: {
              ...item.inputs,
              matterReference: matter,
              givenNames: item.searchCriteria?.givenNames || item.render?.givenNames || '',
            },
          },
          item.description,
          () => {
            dispatch(orderActions.setVerifiedItems(null));
            dispatch(orderActions.setVerifyTempData(null));
          },
        ));
        toggleIsLoading(false);
        setItemToLoad(null);
      }
    } catch (e) {
      toggleIsLoading(false);
      setItemToLoad(null);
    }
  };

  const close = () => {
    if (!isLoading) {
      dispatch(orderActions.setVerifiedItems(null));
      dispatch(orderActions.setVerifyTempData(null));
    }
  };

  return (
    <Background close={close}>
      <Container
        onClick={(evt) => evt.stopPropagation()}
      >
        <HeaderWrapper>
          <Header>
            <H3>
              {currentService.productId === 'SATITLEOWNER' ? 'Please select an owner name from the list' : 'Results'}
            </H3>
            <CloseIcon handler={close} />
          </Header>
        </HeaderWrapper>
        <TableWrapper
          ref={containerRef}
          isLoading={isPaginationLoading}
        >
          <div>
            <SearchCriteria>
              Your search for ‘
              <span>{verifyTempData.description}</span>
              ’ returned the following
              <span>
                {' '}
                {pagination.totalCount}
              </span>
              {' '}
              {pagination.totalCount > 1 || pagination.totalCount === 0 ? 'results' : 'result'}
              .
            </SearchCriteria>
            <div style={{ margin: '12px 0 32px 0' }}>
              {currentService.productId === 'SATITLEOWNER' ? (
                <Warning>
                  Please note that results include both individuals and companies.
                </Warning>
              ) : null}
            </div>
          </div>
          {!isPaginationLoading ? (
            <Table>
              <THead>
                <tr>
                  {orderTableStructure[verifyTempData.identifier][0].map(
                    (el: string, i: number) => (
                      <th key={el + i}>{el}</th>
                    ),
                  )}
                  <LoaderCell />
                </tr>
              </THead>
              <TBody>
                {verifiedItems.filter((el) => el.pageIndex === offset).map((item) => (
                  <TRow
                    key={item.id}
                    isValid={!!item.inputs.matterReference}
                    onClick={() => {
                      if (!isLoading) {
                        selectItem(item);
                        setItemToLoad(item.id);
                      }
                    }}
                  >
                    {orderTableStructure[verifyTempData.identifier][1].map(
                      (el: string) => (
                        <th key={item.id + el}>
                          <RowWrapper>
                            <span style={{ color: Object.keys(item.inputs).length ? '' : 'rgba(17,24,39,0.5)' }}>{item.render[el]}</span>
                          </RowWrapper>
                        </th>
                      ),
                    )}
                    <LoaderCell>
                      {isLoading && item.id === itemToLoad && (
                        <div style={{ maxWidth: '24px' }}>
                          <Loader size={24} thickness={2} color="var(--primary-green-color)" />
                        </div>
                      )}
                    </LoaderCell>
                  </TRow>
                ))}
              </TBody>
            </Table>
          ) : <Loader />}
          {currentService.productId !== 'SATITLEOWNER' ? (
            <Info>
              This information is provided as a searching aid only. the register
              general does not guarantee the information
            </Info>
          ) : null}
        </TableWrapper>
        <PaginationWrapper>
          <Pagination
            changePage={!isLoading ? setOffset : () => {}}
            currentPage={offset}
            maxPages={pagination.totalPages}
            maxElements={pagination.totalCount}
            limits={limits}
            limit={limit}
            hideSelectLimit
            setLimit={setLimit}
          />
        </PaginationWrapper>
      </Container>
    </Background>
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
  margin: 0 0 12px 0;
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

const TRow = styled.tr<{ isValid: boolean }>`
  cursor: pointer;

  th span {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  
  :hover th {
    background-color: #F9F9F9;
    
    * {
      color: var(--primary-green-hover-color);
    }
  }

  :last-child {
    th:first-child {
      border-bottom-left-radius: 4px;
    }

    th:last-child {
      border-bottom-right-radius: 4px;
    }
  }
  
  ${({ isValid }) => !isValid && css`
    cursor: default;
    
    :hover th * {
      color: var(--primary-dark-color);
    }
  `}}
`;

const LoaderCell = styled.th`
  width: 24px;
`;

const RowWrapper = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 16px;
`;

const Info = styled.p`
  margin-bottom: 32px;
  padding: 32px 0;
  border-bottom: 1px solid #e8e8e8;
  font-size: 12px;
  color: #111827;
`;

const PaginationWrapper = styled.div`
  padding: 0 32px;
`;

const Warning = styled.p`
  padding: 12px 24px;
  border-left: 4px solid var(--primary-warning-color);
  background-color: var(--primary-warning-background-color);
  font-size: 18px;
  color: var(--primary-warning-color);
`;

export default VerifiedTableWithPagination;
