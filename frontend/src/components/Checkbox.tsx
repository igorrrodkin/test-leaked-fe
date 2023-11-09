import React, { InputHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

import EmptyCheckbox from '@/assets/icons/EmptyCheckbox';
import SelectedCheckbox from '@/assets/icons/SelectedCheckbox';

interface Props extends InputHTMLAttributes<HTMLInputElement> {

}

const Checkbox: React.FC<Props> = ({ ...props }) => (
  <Label
    isChecked={!!props.checked}
    isDisabled={!!props.disabled}
    onClick={(evt) => evt.stopPropagation()}
  >
    {!!props.checked && !props.disabled ? (
      <SelectedCheckbox />
    ) : (
      <EmptyCheckbox />
    )}
    <StyledCheckbox {...props} />
  </Label>
);

const Label = styled.label<{ isChecked: boolean, isDisabled: boolean }>`
  display: block;
  width: 18px;
  height: 18px;
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
  
  ${({ isDisabled }) => (isDisabled ? css`
    svg {
      fill: rgba(0, 0, 0, .2);
    }
  ` : '')}
`;

const StyledCheckbox = styled.input`
  display: none;
`;

export default Checkbox;
