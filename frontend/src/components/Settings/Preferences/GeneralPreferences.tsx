import React from 'react';
import styled from 'styled-components';

import SettingsOption from '@/components/Settings/Preferences/SettingsOption';

import { GeneralPreference } from '@/store/reducers/user';

interface Props {
  generalSettings: { [key in GeneralPreference]: boolean };
  setChanges: (key: GeneralPreference, status: boolean) => void
}

const GeneralSettingsText: { [key in GeneralPreference]: string } = {
  [GeneralPreference.ShowOwnOrders]:
    'Home Screen - Only display my Orders',
};

const GeneralPreferences: React.FC<Props> = ({
  generalSettings,
  setChanges,
}) => {
  const handleSetIsActive = (key: GeneralPreference) => (status: boolean) => {
    setChanges(key, status);
  };

  return (
    <GeneralPreferencesStyled>
      {Object.values(GeneralPreference).map((key: GeneralPreference) => (
        <SettingsOption
          key={key}
          isActive={(generalSettings || {})[key] || false}
          setIsActive={handleSetIsActive(key as GeneralPreference)}
        >
          {GeneralSettingsText[key]}
        </SettingsOption>
      ))}
    </GeneralPreferencesStyled>
  );
};

const GeneralPreferencesStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

export default GeneralPreferences;
