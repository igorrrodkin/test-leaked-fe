import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@/components/Button';
import LoadingContainer from '@/components/LoadingContainer';
import DeactivateModal from '@/components/Modal/DeactivateModal';
import Modal from '@/components/Modal/Modal';
import NoFound from '@/components/NoFound';
import Card from '@/components/Settings/Billing/Card';

import {
  removeCardAction,
  setAsPrimaryCardAction, userActions,
} from '@/store/actions/userActions';

import { IFullOrganisation } from '@/store/reducers/organisations';
import { PopupTypes } from '@/store/reducers/user';

import useToggle from '@/hooks/useToggle';

import { AppDispatch } from '@/store';

interface IRemoveCard {
  cardId: string,
  last4: string,
}

interface ISetPrimary {
  customerId: string,
  cardId: string,
  last4: string,
}

interface Props {
  organisation: IFullOrganisation
}

const SettingsBilling: React.FC<Props> = ({ organisation }) => {
  const [isDataLoading, toggleIsDataLoading] = useToggle(false);
  const [primaryCardData, setPrimaryCardData] = useState<ISetPrimary | undefined>();
  const [removeCardData, setRemoveCardData] = useState<IRemoveCard | undefined>();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const setAsPrimaryCard = async (customerId: string, cardId: string, shouldRefreshUser = true) => {
    try {
      toggleIsDataLoading(true);

      await dispatch(setAsPrimaryCardAction(customerId, cardId, shouldRefreshUser));

      if (shouldRefreshUser) {
        dispatch(userActions.setPopup({
          type: PopupTypes.SUCCESS,
          mainText: 'Success',
          additionalText: 'New payment method have been set as primary',
        }));
        setPrimaryCardData(undefined);
        toggleIsDataLoading(false);
      }
    } catch (e) {
      toggleIsDataLoading(false);
    }
  };

  const removeCard = async (cardId: string, organisationId: number) => {
    try {
      toggleIsDataLoading(true);

      if (cardId === organisation.stripePrimaryPaymentMethod) {
        const newPrimaryMethod = organisation.stripePaymentMethods.find((el) => el.id !== cardId);

        if (newPrimaryMethod) {
          const { customer, id } = newPrimaryMethod;
          const customerId = typeof customer === 'string' ? customer : customer!.id;

          await setAsPrimaryCard(customerId, id, false);
        }
      }

      await dispatch(removeCardAction(cardId, organisationId));

      dispatch(userActions.setPopup({
        type: PopupTypes.SUCCESS,
        mainText: 'Success',
        additionalText: 'Payment method have been removed',
      }));

      setRemoveCardData(undefined);
      toggleIsDataLoading(false);
    } catch (e: any) {
      setRemoveCardData(undefined);
      dispatch(userActions.setPopup({
        type: PopupTypes.ERROR,
        mainText: 'Error',
        additionalText: e?.message,
      }));
      toggleIsDataLoading(false);
    }
  };

  return (
    <Page>
      <LoadingContainer isLoading={isDataLoading}>
        <div>
          <H3>Billing Settings</H3>
          <CardsTitle>My Card</CardsTitle>
        </div>
        <Wrap>
          {organisation.stripePaymentMethods.length
            ? (
              <div>
                {organisation.stripePaymentMethods.map((method) => (
                  <Card
                    key={method.id}
                    isPrime={organisation.stripePrimaryPaymentMethod === method.id}
                    card={method.card!}
                    setPrimary={() => {
                      const customer = typeof method.customer === 'string'
                        ? method.customer
                        : method.customer!.id;

                      setPrimaryCardData({
                        customerId: customer,
                        cardId: method.id,
                        last4: method.card!.last4,
                      });
                    }}
                    remove={() => {
                      setRemoveCardData({
                        cardId: method.id,
                        last4: method.card!.last4,
                      });
                    }}
                  />
                ))}
              </div>
            ) : <NoFound isTextVisible={false} />}
          <Buttons>
            <Button
              isTransparent
              width="143px"
              onClick={() => navigate('/settings/billing/add-card')}
            >
              Add New Card
            </Button>
          </Buttons>
        </Wrap>
      </LoadingContainer>
      {primaryCardData && (
        <Modal closeModal={() => setPrimaryCardData(undefined)}>
          <DeactivateModal
            title="Set new primary method"
            subTitle={`Are you sure you want to set <b>**** **** **** ${primaryCardData.last4}</b> as primary payment method?`}
            cancelButton={{
              onCancel: () => setPrimaryCardData(undefined),
              name: 'Cancel',
              isLoading: false,
              style: {
                isCancel: true,
                style: { height: '48px', fontSize: '16px' },
              },
            }}
            confirmButton={{
              onConfirm: () => setAsPrimaryCard(primaryCardData!.customerId, primaryCardData!.cardId),
              name: 'Yes',
              isLoading: isDataLoading,
              style: {
                isRedButton: true,
                style: { width: '90px', height: '48px', fontSize: '16px' },
              },
            }}
          />
        </Modal>
      )}
      {removeCardData && (
        <Modal closeModal={() => setRemoveCardData(undefined)}>
          <DeactivateModal
            title="Remove payment method"
            subTitle={`Are you sure you want to remove <b>**** **** **** ${removeCardData.last4}</b> payment method?`}
            cancelButton={{
              onCancel: () => setRemoveCardData(undefined),
              name: 'Cancel',
              isLoading: false,
              style: {
                isCancel: true,
                style: { height: '48px', fontSize: '16px' },
              },
            }}
            confirmButton={{
              onConfirm: () => removeCard(removeCardData.cardId, organisation.id),
              name: 'Yes',
              isLoading: isDataLoading,
              style: {
                isRedButton: true,
                style: { width: '90px', height: '48px', fontSize: '16px' },
              },
            }}
          />
        </Modal>
      )}
    </Page>
  );
};

const Page = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  grid-gap: 24px;
  height: 100%;
`;

const H3 = styled.h3`
  margin-bottom: 40px;
  font-size: 18px;
  font-weight: 600;
`;

const CardsTitle = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: -0.02em;
  color: #6c7278;
  margin-top: 40px;
  margin-bottom: 12px;
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  grid-gap: 40px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default SettingsBilling;
