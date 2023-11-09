import React, { InputHTMLAttributes } from 'react';
import { IoCloseOutline } from 'react-icons/all';
import styled from 'styled-components';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  clearField: () => void;
  isDisabled?: boolean;
}

const Search: React.FC<Props> = ({ clearField, ...props }) => (
  <StyledSearch>
    <SearchIcon
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.70829 12.6875C3.41246 12.6875 0.729126 10.0042 0.729126 6.70835C0.729126 3.41252 3.41246 0.729187 6.70829 0.729187C10.0041 0.729187 12.6875 3.41252 12.6875 6.70835C12.6875 10.0042 10.0041 12.6875 6.70829 12.6875ZM6.70829 1.60419C3.89079 1.60419 1.60413 3.89669 1.60413 6.70835C1.60413 9.52002 3.89079 11.8125 6.70829 11.8125C9.52579 11.8125 11.8125 9.52002 11.8125 6.70835C11.8125 3.89669 9.52579 1.60419 6.70829 1.60419Z"
        fill="#292D32"
      />
      <path
        d="M12.8333 13.2709C12.7225 13.2709 12.6116 13.23 12.5241 13.1425L11.3575 11.9759C11.1883 11.8067 11.1883 11.5267 11.3575 11.3575C11.5266 11.1884 11.8066 11.1884 11.9758 11.3575L13.1425 12.5242C13.3116 12.6934 13.3116 12.9734 13.1425 13.1425C13.055 13.23 12.9441 13.2709 12.8333 13.2709Z"
        fill="#292D32"
      />
    </SearchIcon>
    <input {...props} />
    {props.value ? <ClearIcon onClick={clearField} /> : ''}
  </StyledSearch>
);

const StyledSearch = styled.div`
  position: relative;
  width: 100%;
  height: 38px;

  input {
    padding: 13px 16px 13px 42px;
    width: 100%;
    height: 38px;
    border: 1px solid rgba(156, 163, 175, 0.6);
    border-radius: 5px;
    font-size: 12px;
    background-color: #fff;
    color: var(--primary-dark-color);

    ::placeholder {
      color: rgba(17, 24, 39, 0.35);
    }

    :focus {
      outline: 2px solid var(--primary-blue-color);
    }
  }
`;

const SearchIcon = styled.svg`
  position: absolute;
  top: 50%;
  left: 16px;
  width: 14px;
  height: 14px;
  transform: translateY(-50%);
`;

const ClearIcon = styled(IoCloseOutline)`
  position: absolute;
  top: 50%;
  right: 0.5rem;
  width: 1.25rem;
  height: 1.25rem;
  transform: translateY(-50%);
  cursor: pointer;

  :hover * {
    stroke: var(--primary-blue-color);
  }
`;

export default Search;
