import React from 'react';
import styled from 'styled-components';

import Toggle from '@/components/Toggle';

interface Props {
  children: React.ReactNode;
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
  justifyContent?: 'flex-start' | 'space-between';
}

const SettingsOption: React.FC<Props> = ({
  children,
  isActive,
  setIsActive,
  justifyContent = 'space-between',
}) => {
  const handleSetIsActive = (value: boolean) => {
    setIsActive(value);
  };

  return (
    <SettingsOptionStyled
      justifyContent={justifyContent}
    >
      <Text>
        {children}
      </Text>
      <Toggle setIsActive={handleSetIsActive} isActive={isActive} />
    </SettingsOptionStyled>
  );
};

const SettingsOptionStyled = styled.div<{ justifyContent: string }>`
  display: flex;
  column-gap: 32px;
  justify-content: ${({ justifyContent }) => justifyContent};
  align-items: center;
  padding: 18px 0;
`;

const Text = styled.div`
  font-weight: 500;
  font-size: 16px;
  letter-spacing: -0.03em;
  color: #6C7278;
`;

export default SettingsOption;
