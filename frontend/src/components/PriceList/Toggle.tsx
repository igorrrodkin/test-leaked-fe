import React from 'react';
import styled, { css } from 'styled-components';

interface Props {
  isActive: boolean
  click?: React.MouseEventHandler<HTMLDivElement>
}

const Toggle: React.FC<Props> = ({ click, isActive }) => (
  <ToggleStyled onClick={click} isActive={isActive}>
    <Knob />
  </ToggleStyled>
);

const Knob = styled.div`
  border-radius: 50%;
  background: #FFFFFF;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  width: 20px;
  height: 20px;
  position: absolute;
  left: 5px;
  transition: 0.5s ease;
`;

const ToggleStyled = styled.div<{ isActive: boolean }>`
  width: 50px;
  min-width: 50px;
  height: 30px;
  display: flex;
  align-items: center;
  border-radius: 100px;
  position: relative;
  cursor: pointer;
  background: #F0F0F2;
  transition: 0.5s ease;

  ${({ isActive }) => isActive && css`
    background: #27A376;

    ${Knob} {
      left: calc(100% - 25px);
    }
  `}
`;

export default Toggle;
