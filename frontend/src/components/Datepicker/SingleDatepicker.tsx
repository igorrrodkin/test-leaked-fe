import React, { useEffect, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import styled from 'styled-components';

import CloseIcon from '@/assets/icons/CloseIcon';

import Caption from '@/components/Datepicker/Caption';
import FilterButton from '@/components/Table/FilterButton';

import useOnClickOutside from '@/hooks/useOnClickOutside';
import useToggle from '@/hooks/useToggle';

import convertTimestamp from '@/utils/convertTimestamp';

interface Props {
  label: string;
  setFunc: (date: Date) => void;
  modalRef: HTMLDivElement;
}

const SingleDatepicker: React.FC<Props> = ({ label, setFunc, modalRef }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isInitialValue, toggleIsInitialValue] = useToggle(true);
  const [ref, isVisible, toggleIsVisible] = useOnClickOutside<HTMLDivElement>(
    false,
    modalRef,
  );

  useEffect(() => {
    setFunc(date || new Date());
  }, [date]);

  const dateValue = date
    ? convertTimestamp(date!.getTime())
    : convertTimestamp(new Date()!.getTime());

  return (
    <Wrapper>
      <span style={{ marginBottom: '12px' }}>{label}</span>
      <FilterButton
        ref={ref}
        value={dateValue}
        onClick={() => toggleIsVisible(!isVisible)}
        isDropdownVisible={isVisible}
        isCalendar
      >
        {isVisible ? (
          <StyledDatepicker onClick={(e) => e.stopPropagation()}>
            <StyledCloseIcon handler={toggleIsVisible} />
            <DayPicker
              mode="single"
              selected={date}
              onSelect={(day) => {
                toggleIsInitialValue(false);
                toggleIsVisible(false);
                setDate(day);
              }}
              disabled={{
                before: new Date(),
              }}
              components={{
                Caption,
              }}
              showOutsideDays
            />
          </StyledDatepicker>
        ) : (
          ''
        )}
      </FilterButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  span {
    display: flex;
    align-items: center;
    grid-gap: 4px;
    font-size: 16px;
    color: #6c7278;
    font-weight: 500;
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

export default SingleDatepicker;
