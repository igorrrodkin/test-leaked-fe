import React, { FC, PropsWithChildren } from 'react';
import styled from 'styled-components';

interface Props extends PropsWithChildren {
  isOpenToTop: boolean,
}

const CellPopup: FC<Props> = ({ isOpenToTop, children }) => (
  <PopUpWrap
    isOpenToTop={isOpenToTop}
    onClick={(evt) => evt.stopPropagation()}
  >
    <div>
      {children}
    </div>
  </PopUpWrap>
);

const PopUpWrap = styled.div<{ isOpenToTop: boolean }>`
  position: absolute;
  ${({ isOpenToTop }) => (isOpenToTop ? 'bottom: 100%;' : 'top: 100%;')}
  left: 0;
  padding: 6px 0 6px 12px;
  border-radius: 8px;
  width: 300px;
  background-color: #f0f0f2;
  z-index: 2;
  cursor: default;
  
  & > div {
    padding-right: 4px;
    width: calc(100% - 4px);
    max-height: 170px;
    overflow: auto;
    white-space: break-spaces;
    scrollbar-color: rgba(163, 163, 163, 0.7);
    background-color: #f0f0f2;

    &::-webkit-scrollbar-thumb {
      outline: 2px solid transparent;
      height: 20%;
      width: 20%;
      background-color: rgba(163, 163, 163, 0.7);
      border-radius: 4px;
    }

    &::-webkit-scrollbar {
      transition: all 0.3s ease-in;
      width: 5px;
      height: 5px;
    }

    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 0 transparent;
      -webkit-box-shadow: inset 0 0 0 transparent;
      background: transparent;
      margin: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: rgba(163, 163, 163, 0.7);
    }
  }
`;

export default CellPopup;
