import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import Button from '@/components/Button';
import LoadingContainer from '@/components/LoadingContainer';
import DeactivateModal from '@/components/Modal/DeactivateModal';
import Modal from '@/components/Modal/Modal';
import Select from '@/components/Select';
import EmailPreferences from '@/components/Settings/Preferences/EmailPreferences';
import GeneralPreferences from '@/components/Settings/Preferences/GeneralPreferences';
import Tab from '@/components/Settings/Preferences/Tab';

import { getOrganisationDefaultSettingsAction, getUserSettings, userActions } from '@/store/actions/userActions';
import { getUsersAction, setUsersAction, usersActions } from '@/store/actions/usersActions';

import {
  EmailPreference,
  GeneralPreference,
  ISettings,
  Roles,
} from '@/store/reducers/user';
import { IOrganisationUser } from '@/store/reducers/users';

import { selectPinedService, selectSettings, selectUser } from '@/store/selectors/userSelectors';
import { selectUsers } from '@/store/selectors/usersSelector';

import useToggle from '@/hooks/useToggle';

import { AppDispatch } from '@/store';

export enum PreferenceTabs {
  General = 'general',
  Email = 'email',
}

type TUsers = (IOrganisationUser | {
  id: number,
  firstName: string
  lastName: string,
  isDefault: boolean,
})[];

interface Props {
  organisationId?: number;
}

const Preferences: React.FC<Props> = ({ organisationId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const usersFromApi = useSelector(selectUsers);
  const user = useSelector(selectUser);
  const [selectedUser, setSelectedUser] = useState<number>();
  const [users, setUsers] = useState<TUsers>([]);
  const [selectedTab, setSelectedTab] = useState<PreferenceTabs>(
    PreferenceTabs.General,
  );
  const [isUserLoading, setIsUserLoading] = useToggle(true);
  const [isSettingsLoading, setIsSettingsLoading] = useToggle(true);
  const [isRestore, toggleIsRestore] = useToggle();
  const [isRestoreLoading, toggleIsRestoreLoading] = useToggle();

  const settings = useSelector(selectSettings);
  const pinnedServices = useSelector(selectPinedService);

  useEffect(() => {
    getData();

    return () => {
      dispatch(usersActions.setUsers([]));
    };
  }, []);

  useEffect(() => {
    if (!usersFromApi.length || isUserLoading) {
      return;
    }

    const tempUsers: TUsers = [
      ...usersFromApi,
    ];

    if (user?.role === Roles.SYSTEM_ADMIN || user?.role === Roles.CUSTOMER_ADMIN) {
      tempUsers.unshift({
        id: user!.organisations[0].id,
        firstName: 'Default Client Settings for',
        lastName: user!.organisations[0].name,
        isDefault: true,
      });
    }

    const me = tempUsers.findIndex(({ id }) => id === user!.id);

    setSelectedUser(me === -1 ? 0 : me);
    setUsers(tempUsers);
  }, [usersFromApi, isUserLoading]);

  useEffect(() => {
    if (!users.length || selectedUser === undefined) {
      return;
    }

    // @ts-ignore
    if (users[selectedUser].isDefault) {
      getOrganisationSettings();

      return;
    }

    getUser(users[selectedUser].id);
  }, [selectedUser]);

  const getUser = async (userId: number) => {
    setIsSettingsLoading(true);

    await dispatch(getUserSettings(userId));

    setIsSettingsLoading(false);
  };

  const getOrganisationSettings = async () => {
    setIsSettingsLoading(true);

    await dispatch(getOrganisationDefaultSettingsAction());

    setIsSettingsLoading(false);
  };

  const getData = async () => {
    setIsUserLoading(true);

    await dispatch(getUsersAction(organisationId || user!.organisations[0].id));

    setIsUserLoading(false);
  };

  const usersName = useMemo(
    () => users.map((u) => `${u.firstName} ${u.lastName}`),
    [users],
  );

  const handleTabClick = (tab: PreferenceTabs) => {
    setSelectedTab(tab);
  };

  const handleSetEmailChanges = (key: EmailPreference, status: boolean) => {
    const changedSetting = {
      ...settings!,
      [PreferenceTabs.Email]: {
        ...settings![PreferenceTabs.Email],
        [key]: status,
      },
    };

    changeSettings(changedSetting);
  };

  const handleSetGeneralChanges = (key: GeneralPreference, status: boolean) => {
    const changedSetting = {
      ...settings!,
      [PreferenceTabs.General]: {
        ...settings![PreferenceTabs.General],
        [key]: status,
      },
    };

    changeSettings(changedSetting);
  };

  const changeSettings = (changedSetting: ISettings) => {
    // @ts-ignore
    const isOrganisationSettings = !!users[selectedUser!].isDefault;

    dispatch(
      setUsersAction(users[selectedUser!].id, {
        ...changedSetting,
        pinnedServices,
        isOrganisationSettings,
      }),
    );
    dispatch(userActions.setSettings(changedSetting));

    if (users[selectedUser!].id === user!.id) {
      dispatch(userActions.setUser({ ...user!, userSettings: changedSetting }));
    }
  };

  const handleDefaultChangesChanges = async () => {
    toggleIsRestoreLoading(true);

    const changedSetting = {
      ...settings,
      [selectedTab]: Object.fromEntries(
        Object.entries(settings![selectedTab]).map(([key]) => [key, false]),
      ),
    } as ISettings;

    await dispatch(
      setUsersAction(users[selectedUser!].id, {
        ...changedSetting,
        pinnedServices,
      }),
    );

    dispatch(userActions.setSettings(changedSetting));
    toggleIsRestoreLoading(false);
    toggleIsRestore(false);
  };

  const content = useMemo(() => {
    if (!settings || isSettingsLoading) {
      return (
        <LoadingContainer isLoading>
          <></>
        </LoadingContainer>
      );
    }

    switch (selectedTab) {
      case PreferenceTabs.Email:
        const emailSetting = settings[PreferenceTabs.Email];
        return (
          <EmailPreferences
            setChanges={handleSetEmailChanges}
            emailSettings={emailSetting}
          />
        );
      case PreferenceTabs.General:
        const generalSetting = settings[PreferenceTabs.General];
        return (
          <GeneralPreferences
            setChanges={handleSetGeneralChanges}
            generalSettings={generalSetting}
          />
        );
      default:
        return (
          <LoadingContainer isLoading>
            <></>
          </LoadingContainer>
        );
    }
  }, [settings, selectedTab, isSettingsLoading]);

  return (
    <LoadingContainer isLoading={isUserLoading}>
      <PreferencesStyled>
        <Title>Preferences</Title>
        <Label>
          <Select
            selectedItem={selectedUser}
            setSelectedItem={setSelectedUser}
            items={usersName}
            padding="16px 24px"
            height="48px"
            fontSize="16px"
          />
        </Label>
        {selectedUser !== undefined && (
          <>
            <Tabs>
              {Object.values(PreferenceTabs).map((tab) => (
                <Tab
                  value={tab}
                  key={tab}
                  onClick={handleTabClick}
                  isActive={selectedTab === tab}
                />
              ))}
            </Tabs>
            <Options>{content}</Options>
            {!isSettingsLoading && (
              <Button
                isRedButton
                style={{ width: '230px', margin: 'auto 0 0 auto' }}
                onClick={toggleIsRestore}
              >
                Restore section to defaults
              </Button>
            )}
          </>
        )}
      </PreferencesStyled>
      {isRestore && (
        <Modal closeModal={() => toggleIsRestore(false)}>
          <DeactivateModal
            title="Restore to default?"
            subTitle="Are you sure you want to restore all setting to default?"
            cancelButton={{
              onCancel: () => toggleIsRestore(false),
              name: 'Cancel',
              isLoading: false,
              style: { isCancel: true, style: { height: '48px', fontSize: '16px' } },
            }}
            confirmButton={{
              onConfirm: handleDefaultChangesChanges,
              name: 'Restore',
              isLoading: isRestoreLoading,
              style: {
                isRedButton: true,
                style: { width: '90px', height: '48px', fontSize: '16px' },
              },
            }}
          />
        </Modal>
      )}
    </LoadingContainer>
  );
};

const Options = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Tabs = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(35, 35, 35, 0.16);
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  grid-gap: 2px;

  span {
    color: #6b7280;
    white-space: nowrap;
  }
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 18px;
  letter-spacing: -0.02em;
  color: #111827;
`;

const PreferencesStyled = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 32px;
  height: 100%;
`;

export default Preferences;
