import React, { useState } from 'react';
import styled, { css } from 'styled-components';

import Search from '@/components/Dashboard/Search';
import Datepicker, { setDates } from '@/components/Datepicker/Datepicker';
import FilterButton from '@/components/Table/FilterButton';

import { HandleToggle } from '@/hooks/useToggle';

import dropdownSelectHelper from '@/utils/dropdownSelectHelper';
import toSentenceCase from '@/utils/toSentenceCase';

interface ISearch {
  searchValue: string;
  setSearchValue: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  clear: () => void;
}

export interface IFilter {
  id?: string;
  name: string;
  value: string | null;
  setValue: Function;
  values: any[];
  keyForValue?: string;
  isApplied: boolean;
  ref: React.RefObject<HTMLDivElement>;
  isDropdownVisible: boolean;
  toggleIsVisible: HandleToggle;
  normalizeValue?: (value: string) => string;
  containLargeValues?: boolean;
  isBilling?: boolean;
  isAdmin?: boolean;
  sentenceCase?: boolean;
  isUseSearch?: boolean;
  isSortValeus?:boolean;
}

interface IDatepickerFilter {
  title?: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  isForMatters?: boolean;
  setDates: setDates;
  makeItLast?: boolean;
  billingFilters?: IFilter[];
}

interface Props {
  search: ISearch;
  datepicker?: IDatepickerFilter;
  filters?: IFilter[];
  isMarginBottom?: boolean

}

const Filters: React.FC<Props> = ({
  search, filters, datepicker, isMarginBottom = true,
}) => {
  const [searchVal, setSearchVal] = useState('');

  return (
    <StyledFilters isMarginBottom={isMarginBottom}>
      <Search
        value={search.searchValue}
        onChange={search.setSearchValue}
        placeholder={search.placeholder}
        clearField={search.clear}
      />
      {(datepicker || filters) && (
      <Buttons withOrder={!!datepicker?.makeItLast}>
        {datepicker ? (
          <Datepicker
            title={datepicker.title}
            isForMatters={datepicker.isForMatters}
            initialStartDate={datepicker.startDate}
            initialEndDate={datepicker.endDate}
            isApplied={!!(datepicker.startDate && datepicker.endDate)}
            setDates={datepicker.setDates}
            billingFilters={datepicker.billingFilters}
          />
        ) : (
          ''
        )}
        {filters
          ? filters.map((filter, i) => {
            const value = filter.normalizeValue && filter.value
              ? filter.normalizeValue(filter.value)
              : filter.value || filter.name;

            if (filter.isAdmin && !filter.values.length) return;

            return (
              <FilterButton
                id={filter.id}
                key={filter.name}
                ref={filter.ref}
                value={`${dropdownSelectHelper(value)}`}
                isApplied={filter.isApplied}
                isDropdownVisible={filter.isDropdownVisible}
                onClick={filter.toggleIsVisible}
              >
                {filter.isDropdownVisible && filter.values.length ? (
                  <List
                    isLast={i + 1 === filters.length}
                    containLargeValues={filter.containLargeValues}
                  >
                    {filter.isUseSearch && (
                    <DropdownSearch>
                      <DropdownInput
                        type="text"
                        value={searchVal}
                        id="dropdownInput"
                        name="dropdownInput"
                        placeholder="Search value"
                        onChange={(event) => setSearchVal(event.currentTarget.value)}
                      />
                    </DropdownSearch>
                    )}
                    <ScrollWrapper>
                      {filter.values.sort((a, b) => {
                        if (filter.isSortValeus) {
                          return a.name.localeCompare(b.name);
                        }
                        return true;
                      }).filter((el) => {
                        if (!searchVal) return true;

                        return el.name.toString().toLocaleLowerCase().includes(searchVal.toLocaleLowerCase());
                      }).map((item, i) => {
                        const itemValue = filter.keyForValue
                          ? item[filter.keyForValue]
                          : item;

                        return (
                          <ListItem
                            key={itemValue + i}
                            isSelected={itemValue === filter.value}
                            sentenceCase={filter.sentenceCase}
                            isLastItem={
                                  filter.isBilling
                                  && i === filter.values.length - 1
                                }
                            onClick={() => filter.setValue(
                              itemValue === filter.value ? null : item,
                            )}
                          >
                            {toSentenceCase(
                              dropdownSelectHelper(
                                filter.normalizeValue
                                  ? filter.normalizeValue(itemValue)
                                  : `${itemValue}`,
                              ),
                            )}
                          </ListItem>
                        );
                      })}
                    </ScrollWrapper>
                    <Clear
                      isApplied={filter.isApplied}
                      onClick={
                            filter.isApplied
                              ? () => filter.setValue(null)
                              : undefined
                          }
                    >
                      Clear
                    </Clear>
                  </List>
                ) : (
                  ''
                )}
              </FilterButton>
            );
          })
          : ''}
      </Buttons>
      )}
    </StyledFilters>
  );
};

const StyledFilters = styled.div<{ isMarginBottom: boolean }>`
  display: flex;
  grid-gap: 16px;
  align-items: center;

  ${({ isMarginBottom }) => isMarginBottom && css`
    margin-bottom: 1rem;
  `}
`;

const Buttons = styled.div<{ withOrder: boolean }>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  grid-gap: 8px;

  ${({ withOrder }) => (withOrder
    ? css`
          flex-direction: row-reverse;

          div:first-child > div {
            right: 0;
            transform: unset;
          }
        `
    : '')}
`;

export const List = styled.ul<{
  isLast: boolean;
  containLargeValues?: boolean;
}>`
  position: absolute;
  top: calc(100% + 24px);
  left: 50%;
  min-width: 100%;
  padding: 0.5rem 0;
  border-radius: 6px;
  background-color: #fff;
  transform: translateX(-50%);
  box-shadow: 4px 4px 250px rgba(68, 68, 79, 0.12);
  z-index: 5;

  ${({ isLast, containLargeValues }) => {
    if (isLast) {
      return containLargeValues
        ? css`
            right: 0;
            left: unset;
            transform: unset;
            max-width: 300%;

            li {
              white-space: unset;
              word-break: unset;
            }
          `
        : 'max-width: 100%';
    }
    return containLargeValues ? 'width: max-content' : 'width: 100%';
  }};
`;

const ScrollWrapper = styled.div`
  max-height: 320px;
  overflow-y: auto;
  scrollbar-color: rgba(0, 0, 0, 0.2);

  &::-webkit-scrollbar-thumb {
    outline: 2px solid transparent;
    height: 20%;
    width: 20%;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar {
    transition: all 0.3s ease-in;
    width: 5px;
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    box-shadow: inset 0 0 0 transparent;
    -webkit-box-shadow: inset 0 0 0 transparent;
    margin: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }
`;

export const ListItem = styled.li<{
  isSelected: boolean;
  isLastItem?: boolean;
  sentenceCase?: boolean;
}>`
  padding: 8px 1rem;
  text-align: left;
  word-break: break-all;
  color: ${({ isSelected }) => (isSelected ? 'var(--primary-green-color)' : 'inherit')};
  text-transform: ${({ sentenceCase }) => (sentenceCase ? 'none' : 'capitalize')};
  cursor: pointer;
  max-width: 200px;
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  :hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  ${({ isLastItem }) => isLastItem
    && css`
      border-top: 1px solid rgba(35, 35, 35, 0.16);
      padding-top: 10px;
      margin-top: 5px;
    `}
`;

export const Clear = styled.li<{ isApplied: boolean }>`
  padding: 0.5rem 1rem 0.25rem;
  border-top: 1px solid rgba(35, 35, 35, 0.16);
  color: rgba(35, 35, 35, 0.16);
  font-size: 14px;
  font-weight: 600;
  text-align: right;
  word-break: break-all;
  max-width: 200px;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: default;

  ${({ isApplied }) => (isApplied
    ? css`
          color: var(--primary-green-color);
          cursor: pointer;

          :hover {
            color: var(--primary-green-hover-color);
          }
        `
    : '')}
`;

const DropdownSearch = styled.div`
  padding: 4px 12px;
`;

const DropdownInput = styled.input`
  width: 100%;
  padding: 4px;
  border-radius: 3px;
  border: 1px solid rgba(156, 163, 175, 0.6);
`;

export default Filters;
