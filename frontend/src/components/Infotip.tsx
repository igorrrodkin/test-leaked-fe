import React, { FC } from 'react';
import styled from 'styled-components';

import InfotipIcon from '@/assets/icons/InfotipIcon';

interface Props {
  infotip: string,
}

const Infotip: FC<Props> = ({ infotip }) => (
  <InfoBlock>
    <InfotipIcon />
    <span>{infotip}</span>
  </InfoBlock>
);

const InfoBlock = styled.span`
  margin-bottom: 0 !important;
  width: 14px;
  height: 14px;
  position: relative;
  
  & > svg {
    width: 14px;
    height: 14px;
  }

  & > span {
    position: absolute;
    top: 0;
    left: 24px;
    min-width: 250px;
    max-width: 300px;
    transform: translate(-0%, -50%);
    opacity: 0;
    visibility: hidden;
    z-index: -1;
    transition: opacity 0.3s ease;
    white-space: pre;
    font-size: 14px;
    font-weight: 500;
    color: #6c7278;
  }

  @media (hover: hover) {
    &:hover {
      & > svg {
        cursor: pointer;
      }

      & > span {
        display: block;
        white-space: break-spaces;
        opacity: 1;
        visibility: visible;
        z-index: 1;
        padding: 8px 12px;
        background: #ffffff;
        border-radius: 2px;
        box-shadow: 4px 4px 12px rgba(68, 68, 79, 0.2);
      }
    }
  }
`;

export default Infotip;
