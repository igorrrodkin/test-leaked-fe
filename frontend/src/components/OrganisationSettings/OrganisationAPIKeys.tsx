import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment/moment';
import styled, { css } from 'styled-components';

import DeleteIcon from '@/assets/icons/DeleteIcon';

import LoadingContainer from '@/components/LoadingContainer';
import DeactivateModal from '@/components/Modal/DeactivateModal';
import Modal from '@/components/Modal/Modal';
import NoFound from '@/components/NoFound';
import Pagination from '@/components/Pagination';
import GenerateAPIKey from '@/components/Settings/APIKeys/GenerateAPIKey';
import FramedBlock from '@/components/Settings/Users/FramedBlock';

import {
  Table,
  TableWrapper,
  TBody,
  THead,
  TRow,
} from '@/pages/Notices';

import { apiKeyActions, getApiKeysAction, revokeApiKeyAction } from '@/store/actions/apiKeyActions';
import { userActions } from '@/store/actions/userActions';

import { IApiKey } from '@/store/reducers/apiKey';
import { PopupTypes, Roles } from '@/store/reducers/user';

import { selectApiKeys } from '@/store/selectors/apiKeySelectors';
import { selectUser } from '@/store/selectors/userSelectors';

import useToggle from '@/hooks/useToggle';

import getNounByForm from '@/utils/getNounByForm';
import isNumber from '@/utils/isNumber';

import { AppDispatch } from '@/store';

interface Props {
  organisationId: number,
}

const limits = [20, 50, 100];

const OrganisationApiKeys: React.FC<Props> = ({
  organisationId,
}) => {
  const [isLoading, toggleIsLoading] = useToggle(true);
  const [isGenerate, toggleIsGenerate] = useToggle();
  const [revokeItem, setRevokeItem] = useState<IApiKey>();
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(0);

  const apiKeys = useSelector(selectApiKeys);
  const user = useSelector(selectUser);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    getApiKeys();

    return () => {
      dispatch(apiKeyActions.setApiKeys([]));
    };
  }, []);

  const getApiKeys = async () => {
    try {
      await dispatch(getApiKeysAction({
        orgId: organisationId,
      }));
      toggleIsLoading(false);
    } catch (e) {
      toggleIsLoading(false);
    }
  };

  const revokeApiKey = async (id: number) => {
    try {
      toggleIsLoading(true);

      await dispatch(revokeApiKeyAction(id));
      await getApiKeys();

      dispatch(userActions.setPopup({
        type: PopupTypes.SUCCESS,
        mainText: 'API Key revoked',
        additionalText: 'API Key have been revoked',
      }));

      toggleIsLoading(false);
      setRevokeItem(undefined);
    } catch (e) {
      toggleIsLoading(false);
    }
  };

  const maxPages = Math.ceil(apiKeys.length / limits[limit]);
  const calculatedOffset = maxPages > 1 ? offset : 0;
  const filteredKeys: IApiKey[] = [];

  if (maxPages >= 1) {
    for (
      let i = calculatedOffset * limits[limit];
      i < calculatedOffset * limits[limit] + limits[limit];
      i += 1
    ) {
      if (apiKeys[i]) {
        filteredKeys.push(apiKeys[i]);
      }
    }
  }

  return (
    <LoadingContainer isLoading={isLoading}>
      <Wrap>
        <div>
          <Title>
            API Keys
          </Title>
          <FramedBlock
            title={`Total ${getNounByForm(apiKeys.length, 'API Key')}`}
            subtitle={user?.role === Roles.SYSTEM_ADMIN
              ? `Active ${apiKeys.filter((el) => !el.isRevoked).length}`
              : ''}
            btnText="Generate API Key"
            handleBtnClick={() => toggleIsGenerate(true)}
            isBtnVisible={(user?.role === Roles.SYSTEM_ADMIN)}
          />
        </div>
        {filteredKeys.length ? (
          <TableAndPagination>
            <TableWrapper>
              <Table>
                <THead>
                  <tr>
                    <th>API KEY</th>
                    <th>CREATED AT</th>
                    <th>LAST USED</th>
                    <th>STATUS</th>
                    <th>USAGE</th>
                    <th>LIMIT</th>
                    {user?.role === Roles.SYSTEM_ADMIN && (
                      <th>ACTIONS</th>
                    )}
                  </tr>
                </THead>
                <TBody>
                  {filteredKeys.map((el) => (
                    <TRow key={el.apiKey}>
                      <th>{el.apiKey}</th>
                      <th>{`${moment(el.createdAt).format('YYYY/MM/DD hh:mm A')}`}</th>
                      <th>
                        {el.lastUsedAt ? `${moment(el.lastUsedAt).format('YYYY/MM/DD hh:mm A')}` : '-'}
                      </th>
                      <Status
                        isActive={!el.isRevoked}
                      >
                        {el.isRevoked ? 'Revoked' : 'Active'}
                      </Status>
                      <th>{!el.isRevoked && isNumber(el.usage) ? el.usage : '-'}</th>
                      <th>{!el.isRevoked && el.limit ? el.limit : '-'}</th>
                      {user?.role === Roles.SYSTEM_ADMIN && (
                        <th>
                          <ActionWrapper
                            isActive={!el.isRevoked}
                            onClick={!el.isRevoked ? () => setRevokeItem(el) : undefined}
                          >
                            <DeleteIcon />
                          </ActionWrapper>
                        </th>
                      )}
                    </TRow>
                  ))}
                </TBody>
              </Table>
            </TableWrapper>
            {!!filteredKeys.length && (
              <Pagination
                changePage={setOffset}
                currentPage={calculatedOffset}
                maxPages={maxPages}
                maxElements={apiKeys.length}
                limits={limits}
                limit={limit}
                setLimit={setLimit}
              />
            )}
          </TableAndPagination>
        ) : <NoFound />}
      </Wrap>
      {isGenerate && (
        <GenerateAPIKey
          organisationId={organisationId}
          close={() => toggleIsGenerate(false)}
        />
      )}
      {revokeItem && (
        <Modal closeModal={() => setRevokeItem(undefined)}>
          <DeactivateModal
            title="Revoke API Key?"
            subTitle={`Are you sure you want to revoke "<b>${revokeItem.apiKey}</b>" API Key?`}
            cancelButton={{
              onCancel: () => setRevokeItem(undefined),
              name: 'Cancel',
              isLoading: false,
              style: {
                isCancel: true,
                style: { height: '48px', fontSize: '16px' },
              },
            }}
            confirmButton={{
              onConfirm: () => revokeApiKey(revokeItem.id),
              name: 'Yes',
              isLoading,
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

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  row-gap: 32px;
  min-height: 729px;
  height: 100%;
  /* min-width: 680px; */
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 18px;
  letter-spacing: -0.02em;
  color: #111827;
  margin-bottom: 12px;
`;

const TableAndPagination = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
`;

const Status = styled.th<{ isActive: boolean }>`
  color: var(--primary-green-color);
  
  ${({ isActive }) => !isActive && css`
    color: var(--primary-red-color);
  `}
`;

const ActionWrapper = styled.div<{ isActive: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  background-color: #f1efe9;
  cursor: pointer;

  :hover {
    background-color: #e1dfd9;
  }
  
  ${({ isActive }) => !isActive && css`
    cursor: default;
    
    opacity: .3;
    
    :hover {
      background-color: #f1efe9;
    }
  `}
`;

export default OrganisationApiKeys;
