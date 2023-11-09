import React, { InputHTMLAttributes } from 'react';
import styled from 'styled-components';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string
}

const Input: React.FC<Props> = ({ name, ...props }) => (
  <Label>
    <span>{name}</span>
    <input
      {...props}
    />
  </Label>
);

const Label = styled.label`
  display: flex;
  flex-direction: column;
  grid-gap: 2px;
  
  span {
    color: #6B7280;
    white-space: nowrap;
  }
  
  input {
    padding: .5rem .75rem;
    width: 100%;
    height: 42px;
    border: 1px solid rgba(156, 163, 175, .6);
    border-radius: 5px;
    line-height: 1.5rem;
    background-color: rgba(17, 24, 39, .05);
    color: rgba(17, 24, 39, .6);
    
    ::placeholder {
      color: rgba(17, 24, 39, .35);
    }

    :focus {
      outline: 2px solid var(--primary-blue-color);
    }
  }
`;

export default Input;
