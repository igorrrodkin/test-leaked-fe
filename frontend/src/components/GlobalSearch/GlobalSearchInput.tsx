import React from 'react';
import styled from 'styled-components';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onKeyPress: (value: string) => void;
  onClick: () => void;
  inputRef: React.RefObject<HTMLInputElement> | null
}

const GlobalSearchInput: React.FC<Props> = ({
  onChange,
  onKeyPress,
  value,
  onClick,
  inputRef,
}) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onKeyPress(value);
    }
  };

  return (
    <GlobalSearchInputStyled>
      <Input
        ref={inputRef}
        value={value}
        onChange={(evt) => {
          // @ts-ignore
          if (!evt.nativeEvent.inputType) {
            evt.preventDefault();
            return;
          }
          handleOnChange(evt);
        }}
        placeholder="Search something here"
        onKeyPress={handleKeyPress}
        onClick={onClick}
        type="text"
        autoComplete="off"
      />
    </GlobalSearchInputStyled>
  );
};

const Input = styled.input`
  width: 100%;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: -0.03em;
  color: #000000;
  border: none;
  outline: none;

  :-webkit-autofill,
  :-webkit-autofill:hover,
  :-webkit-autofill:focus {
    border: none;
    -webkit-text-fill-color: rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: none;
  }

  ::placeholder {
    color: rgba(0, 0, 0, 0.5);
  }
`;

const GlobalSearchInputStyled = styled.label`
  width: 100%;
`;

export default GlobalSearchInput;
