import React from 'react';
import styled from 'styled-components';

import Select from '@/components/Select';

interface Props {
  changePage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  maxPages: number;
  maxElements: number;
  limits: number[];
  limit: number;
  hideSelectLimit?: boolean;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  setPrevOffset?: React.Dispatch<React.SetStateAction<number>>;
}

type StringAndNumber = number | string;

const Pagination: React.FC<Props> = ({
  changePage,
  currentPage,
  maxPages,
  maxElements,
  limits,
  limit,
  hideSelectLimit,
  setLimit,
  setPrevOffset,
}) => {
  const previousPage = () => {
    if (currentPage === 0) return;

    if (setPrevOffset) setPrevOffset(currentPage);

    changePage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage + 1 === maxPages) return;

    if (setPrevOffset) setPrevOffset(currentPage);

    changePage(currentPage + 1);
  };

  const toElements = currentPage * limits[limit] + limits[limit] < maxElements
    ? currentPage * limits[limit] + limits[limit]
    : maxElements;

  const getPages = () => {
    if (maxPages < 8) {
      const arr = [];
      for (let i = 0; i < maxPages; i += 1) arr.push(i);
      return arr;
    }

    const arr: StringAndNumber[] = [0];

    if (currentPage > 2) {
      if (currentPage < maxPages - 3) {
        arr.push(
          'Left',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          'Right',
          maxPages - 1,
        );
        return arr;
      }
      arr.push(
        'Left',
        maxPages - 4,
        maxPages - 3,
        maxPages - 2,
        maxPages - 1,
      );
      return arr;
    }

    arr.push(1, 2, 3, 'Right', maxPages - 1);
    return arr;
  };

  return (
    <Wrapper>
      <StyledPagination>
        <Arrow onClick={previousPage} isDisabled={!currentPage}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.99998 13.28L5.65331 8.93333C5.13998 8.42 5.13998 7.58 5.65331 7.06667L9.99998 2.72"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Arrow>
        <Pages>
          {getPages().map((el) => {
            if (el === 'Left') {
              return (
                <PageNumber
                  key="Left"
                  onClick={() => {
                    if (setPrevOffset) setPrevOffset(currentPage);
                    changePage(1);
                  }}
                >
                  ...
                </PageNumber>
              );
            }
            if (el === 'Right') {
              return (
                <PageNumber
                  key="Right"
                  onClick={() => {
                    if (setPrevOffset) setPrevOffset(currentPage);
                    changePage(maxPages - 2);
                  }}
                >
                  ...
                </PageNumber>
              );
            }
            return (
              <PageNumber
                key={el}
                isActive={currentPage === +el}
                onClick={() => {
                  if (setPrevOffset) setPrevOffset(currentPage);
                  changePage(+el);
                }}
              >
                {+el + 1}
              </PageNumber>
            );
          })}
        </Pages>
        <Arrow onClick={nextPage} isDisabled={currentPage + 1 === maxPages}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.93994 13.28L10.2866 8.93333C10.7999 8.42 10.7999 7.58 10.2866 7.06667L5.93994 2.72"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Arrow>
      </StyledPagination>
      <Info>
        {!hideSelectLimit && (
        <Label>
          <Select
            selectedItem={limit}
            setSelectedItem={setLimit}
            items={limits}
            prefix="Show"
            openToTop
          />
        </Label>
        )}
        <p>
          {`Showing ${
            currentPage * limits[limit] + 1
          } to ${toElements} of ${maxElements}`}

        </p>
      </Info>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-gap: 40px;
`;

const StyledPagination = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 16px;
`;

const Arrow = styled.div<{ isDisabled: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(35, 35, 35, 0.16);
  border-radius: 8px;
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};

  :hover {
    border-color: ${({ isDisabled }) => (isDisabled ? 'rgba(35, 35, 35, 0.16)' : 'var(--primary-dark-color)')};
  }

  svg * {
    stroke: ${({ isDisabled }) => (isDisabled ? 'rgba(35, 35, 35, 0.16)' : '#292D32')};
  }
`;

const Pages = styled.ul`
  display: flex;
  align-items: center;
`;

const PageNumber = styled.li<{ isActive?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  font-size: 12px;
  font-weight: ${({ isActive }) => (isActive ? '600' : '400')};
  cursor: pointer;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 24px;

  p {
    font-size: 14px;
    font-weight: 500;
  }
`;

const Label = styled.label`
  max-width: 120px;
`;

export default Pagination;
