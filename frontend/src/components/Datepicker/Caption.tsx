import React from 'react';
import { CaptionProps, useNavigation } from 'react-day-picker';
import { format } from 'date-fns';
import styled from 'styled-components';

import RightArrowIcon from '@/assets/icons/RightArrowIcon';

const Caption: React.FC<CaptionProps> = ({ displayMonth }) => {
  const { goToMonth, nextMonth, previousMonth } = useNavigation();

  return (
    <H2>
      <NavButton
        disabled={!previousMonth}
        onClick={() => previousMonth && goToMonth(previousMonth)}
      >
        <RightArrowIcon style={{ transform: 'rotate(180deg)' }} />
        Previous
      </NavButton>
      {format(displayMonth, 'MMM yyy')}
      <NavButton
        disabled={!nextMonth}
        onClick={() => nextMonth && goToMonth(nextMonth)}
      >
        <RightArrowIcon />
        Next
      </NavButton>
    </H2>
  );
};

const H2 = styled.h2`
  display: flex;
  align-items: center;
  justify-content: space-between;
  grid-gap: 4px;
  margin-bottom: 24px;
  font-size: 14px;
  font-weight: 500;
`;

const NavButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  border: none;
  width: 16px;
  height: 16px;
  font-size: 0;
  background-color: transparent;
  
  svg {
    width: 100%;
    height: 100%;
    
    :hover * {
      stroke: var(--primary-green-color);
    }
  }
`;

export default Caption;
