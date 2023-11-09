import React, { useEffect, useState } from 'react';
import { DayPicker, SelectSingleEventHandler } from 'react-day-picker';
import moment from 'moment';
import styled from 'styled-components';

import CloseIcon from '@/assets/icons/CloseIcon';

import Caption from '@/components/Datepicker/Caption';
import { ErrorMessage } from '@/components/Input';
import Select from '@/components/Select';
import FilterButton from '@/components/Table/FilterButton';

import useClickOutside from '@/hooks/useClickOutside';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import useToggle from '@/hooks/useToggle';

import addZero from '@/utils/addZero';
import isNumber from '@/utils/isNumber';
import {
  getCurrentTime,
  hoursList,
  minutesList,
  tod,
} from '@/utils/times';

interface Props {
  label: any;
  setFunc: Function;
  modalRef: HTMLDivElement;
  initialTime?: string;
  setFrom?: Date;
  isEnd?: boolean;
}

const DatepickerWithTime: React.FC<Props> = ({
  label,
  setFunc,
  modalRef,
  initialTime,
  setFrom,
  isEnd = false,
}) => {
  const initialDate = initialTime ? getCurrentTime(initialTime, isEnd) : undefined;
  const h = initialDate ? +initialDate.hours : undefined;
  const m = initialDate ? +initialDate.minutes : undefined;
  const initialTod = initialDate ? initialDate.timesOfDay : undefined;
  const [hour, setHour] = useState(
    typeof h === 'number'
      ? isEnd ? h : h - 1
      : undefined,
  );

  const [minute, setMinute] = useState(m);
  const [timesOfDay, setTimesOfDay] = useState(initialTod);
  const [date, setDate] = useState<Date | undefined>(initialTime ? moment(+initialTime).toDate() : undefined);
  const [ref, isVisible, toggleIsVisible] = useOnClickOutside<HTMLDivElement>(
    false,
    modalRef,
  );
  const [pickerModalRef, setPickerModalRef] = useState<HTMLDivElement | null>(
    null,
  );
  const [isClicked, toggleIsClicked] = useToggle();
  const containerRef = useClickOutside(() => toggleIsClicked(false));

  useEffect(() => {
    if (initialTime) {
      const currentDate = getCurrentTime(initialTime, isEnd);
      const currentHour = +currentDate.hours;
      const currentMinutes = +currentDate.minutes;
      const currentTod = currentDate.timesOfDay;

      setHour(isEnd ? currentHour : currentHour - 1);
      setMinute(currentMinutes);
      setTimesOfDay(currentTod);
      setDate(new Date(+initialTime));
    }
  }, [initialTime]);

  useEffect(() => {
    if (date && isNumber(hour) && isNumber(minute) && isNumber(timesOfDay)) {
      const currH = hoursList[hour!];
      const currM = minute!;
      const t = tod[timesOfDay!];

      let newDate = new Date(`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${currH}:${currM}:00 ${t}`);

      if (setFrom && newDate.getTime() <= setFrom.getTime()) {
        newDate = moment(setFrom).add(1, 'm').toDate();
        setHour(+moment(newDate).format('h') - 1);
        setMinute(+moment(newDate).format('m'));
        setTimesOfDay(moment(newDate).format('A') === 'AM' ? 0 : 1);
      }

      setFunc(newDate.getTime());
    }
  }, [hour, minute, timesOfDay]);

  let day: any = date ? date.getDate() : undefined;
  let month: any = date ? date.getMonth() + 1 : undefined;
  let dateValue = '';

  if (isNumber(day) && isNumber(month) && isNumber(hour) && isNumber(minute) && isNumber(timesOfDay)) {
    day = addZero(day);
    month = addZero(month);
    dateValue = `${hoursList[hour!]}:${minutesList[minute!]} ${
      tod[timesOfDay!]
    } - 
    ${day}/${month}/${date!.getFullYear()}`;
  }

  const setDateWithTime: SelectSingleEventHandler = (d) => {
    if (d) {
      let newDate;

      if (isNumber(hour) && isNumber(minute) && isNumber(timesOfDay)) {
        const currH = hoursList[hour!];
        const currM = minute!;
        const t = tod[timesOfDay!];

        newDate = new Date(`${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} ${currH}:${currM}:00 ${t}`);

        if (setFrom && newDate.getTime() <= setFrom.getTime()) {
          newDate = moment(setFrom).add(1, 'm').toDate();
          setHour(+moment(newDate).format('h') - 1);
          setMinute(+moment(newDate).format('m'));
          setTimesOfDay(moment(newDate).format('A') === 'AM' ? 0 : 1);
        }

        setFunc(newDate.getTime());
      }

      setDate(newDate || d);
    }
  };

  const isDisabled = isEnd && !setFrom;

  return (
    <Wrapper
      ref={containerRef}
      isError={isDisabled && isClicked}
    >
      <span style={{ marginBottom: '12px' }}>{label}</span>
      <StyledFilterButton
        ref={ref}
        value={dateValue || 'HH:MM AA - DD/MM/YYYY'}
        onClick={() => {
          if (isDisabled) toggleIsClicked(true);
          if (!isDisabled) toggleIsVisible(!isVisible);
        }}
        isError={isDisabled && isClicked}
        isDropdownVisible={isVisible}
        isCalendar
        isPlaceholder={!dateValue}
      >
        {isVisible && (
          <StyledDatepicker
            ref={(elRef) => setPickerModalRef(elRef)}
            onClick={(evt) => evt.stopPropagation()}
          >
            <StyledCloseIcon handler={toggleIsVisible} />
            {!!pickerModalRef && (
              <TimeSelector>
                <label>
                  <Select
                    selectedItem={hour}
                    setSelectedItem={setHour}
                    items={hoursList}
                    modalRef={pickerModalRef}
                    placeholder="00"
                  />
                </label>
                <label>
                  <Select
                    selectedItem={minute}
                    setSelectedItem={setMinute}
                    items={minutesList}
                    modalRef={pickerModalRef}
                    placeholder="00"
                  />
                </label>
                <label>
                  <Select
                    selectedItem={timesOfDay}
                    setSelectedItem={setTimesOfDay}
                    items={tod}
                    modalRef={pickerModalRef}
                    placeholder="AM"
                  />
                </label>
              </TimeSelector>
            )}
            <DayPicker
              mode="single"
              selected={date}
              onSelect={setDateWithTime}
              fromDate={setFrom || new Date('01/01/2000')}
              disabled={isDisabled}
              components={{
                Caption,
              }}
              showOutsideDays
            />
          </StyledDatepicker>
        )}
      </StyledFilterButton>
      {isDisabled && isClicked && (
        <ErrorMessage>
          You must select start time first
        </ErrorMessage>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div<{ isError?: boolean }>`
  span {
    display: flex;
    align-items: center;
    grid-gap: 4px;
    font-size: 16px;
    color: ${({ isError }) => (isError ? 'var(--primary-red-color)' : '#6c7278')};
    font-weight: 500;
  }
`;

const StyledFilterButton = styled(FilterButton)<{ isPlaceholder: boolean }>`
  & > div:first-child {
    color: ${({ isPlaceholder }) => (isPlaceholder ? '#6C7278' : 'var(--primary-dark-color)')};
  }
`;

const StyledDatepicker = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  padding: 32px 48px 12px;
  border-radius: 10px;
  background-color: #fff;
  z-index: 5;
  box-shadow: 4px 4px 250px rgba(68, 68, 79, 0.4);
  transform: translateX(-50%);
  cursor: default;

  .rdp {
    --rdp-cell-size: 28px;
    --rdp-accent-color: var(--primary-green-color);
    --rdp-background-color: var(--primary-green-background-color);

    margin: 0;
  }

  .rdp-months {
    justify-content: center;
  }

  .rdp-head_cell span {
    font-size: 12px;
    color: #b9b9b9;
    font-weight: 500;
  }

  h2 {
    margin-bottom: 12px;
  }
`;

const StyledCloseIcon = styled(CloseIcon)`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const TimeSelector = styled.div`
  display: flex;
  grid-gap: 10px;
  margin-bottom: 12px;

  button {
    padding: 0 10px;
    height: 24px;
    font-weight: 500;
  }
`;

export default DatepickerWithTime;
