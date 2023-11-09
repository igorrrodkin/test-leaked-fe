import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import CloseIcon from '@/assets/icons/CloseIcon';

import Background from '@/components/Background';
import Button from '@/components/Button';
import Status from '@/components/Orders/Status';
import Pagination from '@/components/Pagination';

import { orderActions } from '@/store/actions/orderActions';

import { IPlaceOrderResult } from '@/store/reducers/order';

import useModalWindow from '@/hooks/useModalWindow';

import { AppDispatch } from '@/store';

const limits = [20, 50, 100];

interface Props {
  placeOrderResults: IPlaceOrderResult[],
}

const PlaceOrderResultsTable: React.FC<Props> = ({ placeOrderResults }) => {
  const [limit, setLimit] = useState(0);
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useModalWindow();

  useEffect(() => () => {
    dispatch(orderActions.setPlaceOrderResults(null));
  }, []);

  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.scrollTo(0, 0);
    }
  }, [offset]);

  const close = useCallback(() => {
    dispatch(orderActions.setIsResultsVisible(false));
    navigate('/dashboard/matters');
  }, []);

  const maxPages = Math.ceil(placeOrderResults.length / limits[limit]);
  const calculatedOffset = maxPages > 1 ? offset : 0;
  const filteredItems: IPlaceOrderResult[] = [];

  if (maxPages >= 1) {
    const idk = calculatedOffset * limits[limit] + limits[limit];
    const pageLimit = idk > placeOrderResults.length ? placeOrderResults.length : idk;

    for (let i = calculatedOffset * limits[limit]; i < pageLimit; i += 1) {
      filteredItems.push(placeOrderResults[i]);
    }
  }

  return placeOrderResults.length ? (
    <Background close={close}>
      <Container onClick={(evt) => evt.stopPropagation()}>
        <HeaderWrapper>
          <Header>
            <H3>
              Results
            </H3>
            <CloseIcon handler={close} />
          </Header>
        </HeaderWrapper>
        <TableWrapper ref={containerRef}>
          <Table>
            <THead>
              <tr>
                <th>ORDER ID</th>
                <th>STATUS</th>
                <th>STATUS DESCRIPTION</th>
              </tr>
            </THead>
            <TBody>
              {filteredItems.map((item) => (
                <TRow
                  key={item.orderId}
                >
                  <th>{item.orderId}</th>
                  <th>
                    <Status
                      status={item.status}
                    />
                  </th>
                  <th>{item.description}</th>
                </TRow>
              ))}
            </TBody>
          </Table>
          {filteredItems ? (
            <Pagination
              changePage={setOffset}
              currentPage={calculatedOffset}
              maxPages={maxPages}
              maxElements={placeOrderResults.length}
              limits={limits}
              limit={limit}
              setLimit={setLimit}
            />
          ) : (
            ''
          )}
        </TableWrapper>
        <ButtonSection>
          <StyledButton
            onClick={close}
          >
            Continue
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
  max-width: 820px;
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

const TRow = styled.tr<{ isChecked?: boolean }>`
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

const ButtonSection = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  grid-gap: 16px;
  padding: 0 32px;
`;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  grid-gap: 8px;
`;

export default PlaceOrderResultsTable;
