import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import CloseIcon from '@/assets/icons/CloseIcon';

import Background from '@/components/Background';
import Loader from '@/components/Loader';
import Pagination from '@/components/Pagination';

import { initializeOrderAction, orderActions } from '@/store/actions/orderActions';

import { IVerifiedItem } from '@/store/reducers/order';

import {
  selectCurrentService, selectMatter,
  selectVerifiedItems, selectVerifyTempData,
} from '@/store/selectors/orderSelectors';

import useModalWindow from '@/hooks/useModalWindow';
import useToggle from '@/hooks/useToggle';

import { ExistingRegions } from '@/utils/getRegionsData';
import orderTableStructure from '@/utils/orderTableStructure';

import { AppDispatch } from '@/store';

const limits = [20, 50, 100];

const VerifiedTable: React.FC = () => {
  const [limit, setLimit] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, toggleIsLoading] = useToggle();
  const [itemToLoad, setItemToLoad] = useState<string | null>(null);

  const matter = useSelector(selectMatter);
  const currentService = useSelector(selectCurrentService)!;
  const verifiedItems = useSelector(selectVerifiedItems)!;
  const verifyTempData = useSelector(selectVerifyTempData)!;

  const dispatch = useDispatch<AppDispatch>();

  useModalWindow();

  useEffect(() => () => {
    close();
  }, []);

  const selectItem = async (link: string, description: string) => {
    try {
      toggleIsLoading(true);
      await dispatch(initializeOrderAction(
        currentService.region,
        `${currentService.region}: ${currentService.label}`,
        {
          productId: currentService.productId,
          identifier: currentService.identifier!,
          input: {
            links: [{
              link,
            }],
            matterReference: matter,
          },
        },
        description,
        () => {
          dispatch(orderActions.setVerifiedItems(null));
          dispatch(orderActions.setVerifyTempData(null));
        },
      ));
      toggleIsLoading(false);
      setItemToLoad(null);
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

  const maxPages = Math.ceil(verifiedItems.length / limits[limit]);
  const calculatedOffset = maxPages > 1 ? offset : 0;
  const filteredItems: IVerifiedItem[] = [];

  if (maxPages >= 1) {
    const idk = calculatedOffset * limits[limit] + limits[limit];
    const pageLimit = idk > verifiedItems.length ? verifiedItems.length : idk;

    for (let i = calculatedOffset * limits[limit]; i < pageLimit; i += 1) {
      filteredItems.push(verifiedItems[i]);
    }
  }

  return (
    <Background close={close}>
      <Container
        onClick={(evt) => evt.stopPropagation()}
      >
        <HeaderWrapper>
          <Header>
            <H3>
              {currentService.region === ExistingRegions.VIC ? 'Browse Address' : 'Results'}
            </H3>
            <CloseIcon handler={close} />
          </Header>
        </HeaderWrapper>
        <TableWrapper>
          <SearchCriteria>
            Your search for ‘
            <span>{verifyTempData.description}</span>
            ’ returned the following
            <span>
              {' '}
              {verifiedItems.length}
            </span>
            {' '}
            {verifiedItems.length > 1 || verifiedItems.length === 0 ? 'results' : 'result'}
            {' '}
            {currentService.region === ExistingRegions.VIC ? 'and you have not been charged for this browse' : ''}
            .
          </SearchCriteria>
          {currentService.region === ExistingRegions.VIC ? (
            <Instruction>
              Please select a match from the names listed below to receive property details.
            </Instruction>
          ) : null}
          <Table>
            <THead>
              <tr>
                {orderTableStructure[verifyTempData.identifier][0].map(
                  (el: string, i: number) => (
                    <th key={el + i}>{el}</th>
                  ),
                )}
              </tr>
            </THead>
            <TBody>
              {filteredItems.map((item) => (
                <TRow
                  key={item.id}
                  onClick={() => {
                    if (!isLoading) {
                      selectItem(item.render.link, item.render.address);
                      setItemToLoad(item.id);
                    }
                  }}
                >
                  {orderTableStructure[verifyTempData.identifier][1].map(
                    (el: string) => (
                      <th key={item.id + el}>
                        <RowWrapper>
                          {item.render[el]}
                          {isLoading && item.id === itemToLoad && (
                            <div style={{ maxWidth: '24px' }}>
                              <Loader size={24} thickness={2} color="var(--primary-green-color)" />
                            </div>
                          )}
                        </RowWrapper>
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
              maxElements={verifiedItems.length}
              limits={limits}
              limit={limit}
              setLimit={setLimit}
            />
          )}
          <Info>
            {currentService.region === ExistingRegions.VIC ? '© State of Victoria. This publication is copyright and includes confidential information. No part may be reproduced by any process except in accordance with the provisions of the Copyright Act 1968 (Cth) or pursuant to a written agreement. the State of Victoria does not warrant the accuracy or completeness of information in the publication and any person using or relying upon such information does so on the basis that the State of Victoria shall bear no responsibility or liability whatsoever for any errors, faults, defects or omissions in the information.' : 'This information is provided as a searching aid only. the register general does not guarantee the information'}
          </Info>
        </TableWrapper>
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
  margin-bottom: 16px;
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

const Instruction = styled.p`
margin-bottom: 16px;
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

const TRow = styled.tr`
  cursor: pointer;
  
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

export default VerifiedTable;
