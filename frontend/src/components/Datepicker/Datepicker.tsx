import React, { useEffect, useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import InputMask from 'react-input-mask';
import moment from 'moment';
import styled, { css } from 'styled-components';

import Button from '@/components/Button';
import Caption from '@/components/Datepicker/Caption';
import FilterButton from '@/components/Table/FilterButton';
import {
  Clear,
  IFilter,
  List,
  ListItem,
} from '@/components/Table/Filters';

import { BillingOptions } from '@/pages/Reporting';

import useInput, { OnChange } from '@/hooks/useInput';
import useOnClickOutside from '@/hooks/useOnClickOutside';

import addZero from '@/utils/addZero';
import checkDate from '@/utils/checkDate';

import 'react-day-picker/dist/style.css';

export type setDates = (start?: Date, end?: Date) => void;

interface IOption {
  option: string;
  value: number;
  period: 'd' | 'y';
}

interface Props {
  title?: string;
  isApplied: boolean;
  isForMatters?: boolean;
  setDates: setDates;
  billingFilters?: IFilter[];
  initialStartDate?: Date
  initialEndDate?: Date
}

const Datepicker: React.FC<Props> = ({
  title = 'Date',
  isApplied,
  isForMatters = false,
  setDates,
  billingFilters,
  initialStartDate,
  initialEndDate,
}) => {
  const [startDate, setStartDate] = useState<Date | undefined>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | undefined>(initialEndDate);
  const [startDateInput, setStartDateInput] = useInput();
  const [endDateInput, setEndDateInput] = useInput();
  const [startDateTitle, setStartDateTitle] = useState<string>('');
  const [endDateTitle, setEndDateTitle] = useState<string>('');
  const [ref, isVisible, toggleIsVisible] = useOnClickOutside<HTMLDivElement>();

  useEffect(() => {
    onStartDayPick(initialStartDate);
  }, [initialStartDate]);

  useEffect(() => {
    onEndDayPick(initialEndDate);
  }, [initialEndDate]);

  const setOptionDate = (
    opt: IOption,
  ): {
    startDate: Date | undefined;
    endDate: Date | undefined;
    startInputDate: string;
    endInputDate: string;
    starTitleDate: string;
    endTitleDate: string;
  } => {
    // for custom period choice to open datepicker
    if (opt.value < 0) {
      const todayStart = moment().startOf('d');
      const todayEnd = moment().endOf('d');
      return {
        startDate: todayStart.toDate(),
        endDate: todayEnd.toDate(),
        startInputDate: todayStart.format('DD/MM/YYYY'),
        endInputDate: todayEnd.format('DD/MM/YYYY'),
        starTitleDate: todayStart.format('MMM D, YYYY'),
        endTitleDate: todayEnd.format('MMM D, YYYY'),
      };
    }

    let date = new Date();
    let newStartDate;
    let newEndDate;

    if (opt.period === 'y' && opt.value === 1) {
      newStartDate = moment().subtract(opt.value, opt.period).startOf('year');
      newEndDate = moment().subtract(opt.value, opt.period).endOf('year');

      return {
        startDate: newStartDate.toDate(),
        endDate: newEndDate.toDate(),
        startInputDate: newStartDate.format('DD/MM/YYYY'),
        endInputDate: newEndDate.format('DD/MM/YYYY'),
        starTitleDate: newStartDate.format('MMM D, YYYY'),
        endTitleDate: newEndDate.format('MMM D, YYYY'),
      };
    }

    newEndDate = moment(date);

    if (opt.period === 'y' && opt.value === 0) {
      newStartDate = moment().startOf('year');

      return {
        startDate: newStartDate.toDate(),
        endDate: newEndDate.toDate(),
        startInputDate: newStartDate.format('DD/MM/YYYY'),
        endInputDate: newEndDate.format('DD/MM/YYYY'),
        starTitleDate: newStartDate.format('MMM D, YYYY'),
        endTitleDate: newEndDate.format('MMM D, YYYY'),
      };
    }

    // decrease date by 1 day for 'Last ...'
    if (opt.value > 1) {
      date = moment(date).subtract(1, 'd').toDate();
      newEndDate = moment(date);
    }

    if (opt.option === BillingOptions.Yesterday) {
      newEndDate = moment(date).subtract(1, 'days');
    }

    newStartDate = moment(date, 'DD-MM-YYYY').subtract(opt.value, opt.period);

    return {
      startDate: newStartDate.toDate(),
      endDate: newEndDate.toDate(),
      startInputDate: newStartDate.format('DD/MM/YYYY'),
      endInputDate: newEndDate.format('DD/MM/YYYY'),
      starTitleDate: newStartDate.format('MMM D, YYYY'),
      endTitleDate: newEndDate.format('MMM D, YYYY'),
    };
  };

  const handleOptionClick = (
    filter: IFilter,
    itemValue: string,
    item: IOption,
  ) => {
    filter.setValue(itemValue === filter.value ? null : item);

    // to open datepicker

    const opt = filter.values.find((el) => el.option === itemValue);
    const optDates = setOptionDate(opt);

    setStartDate(optDates?.startDate);
    setEndDate(optDates?.endDate);
    setStartDateInput(optDates?.startInputDate);
    setEndDateInput(optDates?.endInputDate);
    setStartDateTitle(optDates?.starTitleDate);
    setEndDateTitle(optDates?.endTitleDate);

    if (item.value < 0) {
      setTimeout(() => {
        toggleIsVisible(true);
      }, 0);
    }
  };

  const onStartDateInputChange: OnChange = (data) => {
    const valueInput = typeof data === 'string' ? data : data.target.value;
    const date = checkDate(valueInput);

    setStartDateInput(valueInput);

    if (date) setStartDate(date as Date);
    else setStartDate(undefined);
  };

  const onEndDateInputChange: OnChange = (data) => {
    const valueInput = typeof data === 'string' ? data : data.target.value;
    const date = checkDate(valueInput);

    setEndDateInput(valueInput);

    if (date) setEndDate(date as Date);
    else setEndDate(undefined);
  };

  const onStartDayPick = (date: Date | undefined) => {
    if (date) {
      const day = addZero(date.getDate());
      const month = addZero(date.getMonth() + 1);
      const year = addZero(date.getFullYear());

      setStartDateInput(`${day}/${month}/${year}`);
    } else setStartDateInput('');

    setStartDate(date);
  };

  const onEndDayPick = (date: Date | undefined) => {
    if (date) {
      const day = addZero(date.getDate());
      const month = addZero(date.getMonth() + 1);
      const year = addZero(date.getFullYear());

      setEndDateInput(`${day}/${month}/${year}`);
    } else setEndDateInput('');

    setEndDate(date);
  };

  const submit = () => {
    if (startDate && endDate) {
      let start = startDate;
      let end = endDate;

      if (startDate > endDate) {
        const temp = end;
        end = start;
        start = temp;
      }

      setDates(start, new Date(end.setHours(23, 59, 59, 99)));

      const dayStart = addZero(start.getDate());
      const monthStart = addZero(start.getMonth() + 1);
      const yearStart = addZero(start.getFullYear());

      const dayEnd = addZero(end.getDate());
      const monthEnd = addZero(end.getMonth() + 1);
      const yearEnd = addZero(end.getFullYear());

      setStartDate(start);
      setEndDate(end);
      setStartDateInput(`${dayStart}/${monthStart}/${yearStart}`);
      setEndDateInput(`${dayEnd}/${monthEnd}/${yearEnd}`);

      toggleIsVisible(false);

      if (billingFilters) {
        billingFilters[0].setValue({
          option: BillingOptions.CustomPeriod,
          value: moment(end).diff(moment(start), 'days'),
          period: 'd',
        });

        setStartDate(start);
        setEndDate(end);
        setStartDateInput(moment(start).format('DD/MM/YYYY'));
        setEndDateInput(moment(end).format('DD/MM/YYYY'));
        setStartDateTitle(moment(start).format('MMM D, YYYY'));
        setEndDateTitle(moment(end).format('MMM D, YYYY'));
      }
    }
  };

  const clear = () => {
    if (billingFilters) {
      billingFilters[0].setValue({
        option: null,
        value: null,
        period: 'd',
      });
    }

    setStartDate(undefined);
    setEndDate(undefined);
    setStartDateInput('');
    setEndDateInput('');
    setDates(undefined, undefined);
  };

  const start = useMemo(
    () => (
      <DayPicker
        key={String(`${startDate}1`)}
        mode="single"
        defaultMonth={startDate}
        selected={startDate}
        onSelect={onStartDayPick}
        components={{
          Caption,
        }}
        showOutsideDays
      />
    ),
    [startDateInput],
  );

  const end = useMemo(
    () => (
      <DayPicker
        key={String(`${endDate}2`)}
        mode="single"
        defaultMonth={endDate}
        selected={endDate}
        onSelect={onEndDayPick}
        components={{
          Caption,
        }}
        showOutsideDays
      />
    ),
    [endDateInput],
  );

  return (
    <>
      {billingFilters
        ? billingFilters.map((filter, i) => {
          const value = filter.normalizeValue && filter.value
            ? filter.normalizeValue(filter.value)
            : filter.value || filter.name;

          if (filter.isAdmin && !filter.values.length) return;

          return (
            <FilterButton
              id={filter.id}
              key={filter.name}
              ref={filter.ref}
              value={value}
              isApplied={filter.isApplied}
              isDropdownVisible={filter.isDropdownVisible}
              onClick={filter.toggleIsVisible}
            >
              {filter.isDropdownVisible && filter.values.length && (
              <List
                isLast={i + 1 === billingFilters.length}
                containLargeValues={filter.containLargeValues}
              >
                {filter.value && (
                <DropdownHeader>
                  <Period>{filter.value}</Period>
                  <Item>
                    {startDateTitle}
                    {' '}
                    -
                    {' '}
                    {endDateTitle}
                  </Item>
                </DropdownHeader>
                )}
                {!filter.value && !!startDateInput && !!endDateInput && (
                <DropdownHeader>
                  <Period>{BillingOptions.CustomPeriod}</Period>
                  <Item>
                    {startDateTitle}
                    {' '}
                    -
                    {' '}
                    {endDateTitle}
                  </Item>
                </DropdownHeader>
                )}
                {filter.values.map((item, i) => {
                  const itemValue = filter.keyForValue
                    ? item[filter.keyForValue]
                    : item;

                  return (
                    <ListItem
                      key={itemValue + i}
                      isSelected={
                            filter.value
                              ? itemValue === filter.value
                              : startDate && endDate
                                ? itemValue === BillingOptions.CustomPeriod
                                : false
                          }
                      onClick={() => handleOptionClick(filter, itemValue, item)}
                    >
                      {filter.normalizeValue
                        ? filter.normalizeValue(itemValue)
                        : itemValue}
                    </ListItem>
                  );
                })}
                <Clear
                  isApplied={isApplied}
                  onClick={clear}
                >
                  Clear
                </Clear>
              </List>
              )}
            </FilterButton>
          );
        })
        : ''}
      <StyledFilterButton
        ref={ref}
        value={title}
        onClick={() => toggleIsVisible(!isVisible)}
        isApplied={isApplied}
        isDropdownVisible={isVisible}
        isVisible={isVisible}
      >
        {isVisible ? (
          <StyledDatepicker
            isForMatters={isForMatters}
            onClick={(evt) => evt.stopPropagation()}
          >
            <DatepickerTitle>
              {title}
              <svg
                onClick={toggleIsVisible}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.16748 4.16675L15.8334 15.8326"
                  stroke="#ACB5BB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.16664 15.8326L15.8325 4.16675"
                  stroke="#ACB5BB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </DatepickerTitle>
            <Inputs>
              <Label>
                <span>Start Date</span>
                <StyledMaskInput
                  mask="99/99/9999"
                  maskPlaceholder="DD/MM/YYYY"
                  alwaysShowMask
                  value={startDateInput}
                  onChange={onStartDateInputChange}
                />
              </Label>
              <Label>
                <span>End Date</span>
                <StyledMaskInput
                  mask="99/99/9999"
                  maskPlaceholder="DD/MM/YYYY"
                  alwaysShowMask
                  value={endDateInput}
                  onChange={onEndDateInputChange}
                />
              </Label>
            </Inputs>
            <Pickers>
              {start}
              {end}
            </Pickers>
            <Footer>
              <DatepickerClear
                isApplied={
                  isApplied
                  || !!(startDate || startDateInput || endDate || endDateInput)
                }
                onClick={clear}
              >
                Clear
              </DatepickerClear>
              <Buttons>
                <Button isCancel onClick={toggleIsVisible}>
                  Cancel
                </Button>
                <Button disabled={!startDate || !endDate} onClick={submit}>
                  Select
                </Button>
              </Buttons>
            </Footer>
          </StyledDatepicker>
        ) : (
          ''
        )}
      </StyledFilterButton>
    </>
  );
};

const StyledFilterButton = styled(FilterButton)<{ isVisible: boolean }>`
  ${({ isVisible }) => (isVisible
    ? css`
          ::after {
            content: "";
            position: absolute;
            top: calc(100% + 7px);
            left: 50%;
            display: block;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 0 16px 32px 16px;
            border-color: transparent transparent #fff transparent;
            transform: translateX(-50%);
            z-index: 5;
          }
        `
    : '')}
`;

const StyledDatepicker = styled.div<{ isForMatters: boolean }>`
  position: absolute;
  top: calc(100% + 24px);
  right: 0;
  padding: 24px;
  border-radius: 10px;
  background-color: #fff;
  z-index: 5;
  box-shadow: 4px 4px 250px rgba(68, 68, 79, 0.12);
  cursor: default;

  .rdp {
    --rdp-cell-size: 32px;
    --rdp-accent-color: var(--primary-green-color);
    --rdp-background-color: var(--primary-green-background-color);

    margin: 0;
  }

  .rdp-head_cell span {
    font-size: 12px;
    color: #b9b9b9;
    font-weight: 500;
  }

  ${({ isForMatters }) => (!isForMatters
    ? css`
          right: 50%;
          transform: translateX(calc(50% - 30px));
        `
    : '')}
`;

const DatepickerTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(172, 181, 187, 0.16);
  font-size: 16px;
  font-weight: 600;

  svg {
    cursor: pointer;

    :hover * {
      stroke: var(--primary-dark-color);
    }
  }
`;

const Inputs = styled.div`
  display: flex;
  justify-content: space-between;
  grid-gap: 20px;
  margin-bottom: 20px;

  label {
    width: 100%;
  }

  div {
    margin: 0;
  }

  input {
    height: 34px;
  }
`;

const Label = styled.label`
  span {
    display: block;
    margin-bottom: 10px;
    font-size: 12px;
    font-weight: 400;
    color: var(--primary-dark-color);
  }
`;

const StyledMaskInput = styled(InputMask)`
  padding: 13px 16px;
  width: 100%;
  height: 38px;
  border: 1px solid rgba(35, 35, 35, 0.16);
  border-radius: 4px;
  font-size: 12px;
  background-color: #fff;

  :focus {
    outline: 2px solid var(--primary-blue-color);
  }
`;

const Pickers = styled.div`
  display: flex;
  grid-gap: 20px;
  margin-bottom: 16px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-gap: 16px;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 16px;
`;

const DatepickerClear = styled.span<{ isApplied: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: rgba(35, 35, 35, 0.16);

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

const Item = styled.div`
  padding: 0.25rem 1rem;
  text-align: left;
  word-break: break-all;
  text-transform: capitalize;
  max-width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  cursor: auto;
`;

const Period = styled(Item)`
  text-transform: uppercase;
  font-size: 9px;

  :hover {
    background-color: #ffffff;
  }
`;

const DropdownHeader = styled.div`
  border-bottom: 1px solid rgba(35, 35, 35, 0.16);
  padding-bottom: 5px;
  margin-bottom: 5px;
`;

export default Datepicker;
