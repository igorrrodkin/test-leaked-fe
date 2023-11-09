import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import DeactivateModal from '@/components/Modal/DeactivateModal';
import Modal from '@/components/Modal/Modal';

import { changeRegionAction, orderActions } from '@/store/actions/orderActions';

import { selectResetOrder } from '@/store/selectors/orderSelectors';

import getRegionsData from '@/utils/getRegionsData';

import { AppDispatch } from '@/store';

const ResetOrderModal = () => {
  const resetOrder = useSelector(selectResetOrder);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const regionsData = useMemo(() => getRegionsData(), []);

  return resetOrder ? (
    <Modal
      overflow="auto"
      closeModal={() => dispatch(orderActions.setResetOrder(null))}
    >
      <DeactivateModal
        title="Reset current order?"
        subTitle="Are you sure you want to reset this order?"
        cancelButton={{
          onCancel: () => dispatch(orderActions.setResetOrder(null)),
          name: 'Cancel',
          isLoading: false,
          style: { isCancel: true, style: { height: '48px', fontSize: '16px' } },
        }}
        confirmButton={{
          onConfirm: () => {
            dispatch(changeRegionAction(resetOrder!.regionToChange));

            if (resetOrder!.serviceToChange) {
              dispatch(orderActions.setSelectedService(resetOrder!.serviceToChange));
            }

            if (resetOrder.isGlobalSearch && resetOrder.initialOrderData) {
              dispatch(
                orderActions.setInitialOrderData(resetOrder.initialOrderData),
              );
            }

            if (resetOrder.isGlobalSearch && resetOrder.productToScroll) {
              dispatch(orderActions.setProductToScroll(resetOrder.productToScroll));
            }

            if (resetOrder.isGlobalSearch && resetOrder.initialStandardSearcheData) {
              dispatch(
                orderActions.setInitialStandardSearcheData(resetOrder.initialStandardSearcheData),
              );
            }

            dispatch(orderActions.setResetOrder(null));

            const regionName = regionsData[resetOrder.regionToChange].region;

            navigate(`/${regionName.toLowerCase()}`);
          },
          name: 'Reset',
          isLoading: false,
          style: { isRedButton: false, style: { width: '160px', height: '48px', fontSize: '16px' } },
        }}
      />
    </Modal>
  ) : <></>;
};

export default ResetOrderModal;
