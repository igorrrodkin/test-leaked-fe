import React from 'react';
import styled from 'styled-components';

import Button from '@/components/Button';

interface IFramedBlock {
  title: string;
  subtitle?: string;
  btnText: string;
  handleBtnClick: () => void;
  isBtnVisible?: boolean;
}

const FramedBlock: React.FC<IFramedBlock> = ({
  title,
  subtitle,
  btnText,
  handleBtnClick,
  isBtnVisible = true,
}) => (
  <Row>
    <Column>
      <BoldText>{title}</BoldText>
      {!!subtitle && (
        <Text>{subtitle}</Text>
      )}
    </Column>
    {isBtnVisible && (
      <Column>
        <BtnWrap onClick={handleBtnClick} disabled={false}>
          {btnText}
        </BtnWrap>
      </Column>
    )}
  </Row>
);

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border: 1px solid #dce4e8;
  border-radius: 9px;
  padding: 24px;
  margin: 32px 0 12px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 10px;
`;

const BoldText = styled.p`
  font-weight: 600;
  font-size: 20px;
  line-height: 150%;
  letter-spacing: -0.03em;
  color: #111827;
  margin-right: 15px;
`;

const Text = styled.p`
  font-weight: 500;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: -0.03em;
  color: #6c7278;
  margin-right: 15px;
`;

const BtnWrap = styled(Button)`
  grid-gap: 8px;
  height: 50px;

  &:disabled {
    background: #acb5bb;
  }
`;

export default FramedBlock;
