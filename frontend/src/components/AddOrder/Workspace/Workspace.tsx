import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';

import AddIcon from '@/assets/icons/AddIcon';

import WorkspaceMixTable from '@/components/AddOrder/Workspace/WorkspaceMixTable';
import WorkspaceTable from '@/components/AddOrder/Workspace/WorkspaceTable';
import WorkspaceVerificationTable from '@/components/AddOrder/Workspace/WorkspaceVerificationTable';

import { orderActions } from '@/store/actions/orderActions';

import { FinalProduct } from '@/store/reducers/order';

import {
  selectCurrentService,
  selectFoundedItems,
  selectOrderProducts,
  selectSelectedRegion,
} from '@/store/selectors/orderSelectors';
import { selectPriceList } from '@/store/selectors/userSelectors';

import getRegionsData, { ExistingRegions } from '@/utils/getRegionsData';

import { AppDispatch } from '@/store';

const getWorkspaceByRegion = (region: ExistingRegions) => {
  switch (region) {
    case ExistingRegions.NSW:
    case ExistingRegions.WA: return <WorkspaceVerificationTable currentRegion={region} />;
    case ExistingRegions.VIC:
    case ExistingRegions.QLD: return <WorkspaceMixTable currentRegion={region} />;
    default: return <WorkspaceTable currentRegion={region} />;
  }
};

const Workspace = () => {
  const { priceList } = useSelector(selectPriceList)!;
  const currentRegion = getRegionsData()[useSelector(selectSelectedRegion)!].region;
  const orderProducts = useSelector(selectOrderProducts);
  const { identifier } = useSelector(selectCurrentService)!;
  const foundedItems = useSelector(selectFoundedItems);

  const dispatch = useDispatch<AppDispatch>();

  const addAnother = () => {
    if (foundedItems && foundedItems[identifier!]) {
      dispatch(orderActions.setIsResultsVisible(true));
    }
  };

  const selectedItemsCount = orderProducts?.filter((el) => el.isChosen).length || 0;
  let priceForTitle = priceList
    .find((el) => el.productCode === FinalProduct[currentRegion])
    ?.priceInclGST;

  if (!priceForTitle && orderProducts) priceForTitle = orderProducts[0]?.price;

  const price = selectedItemsCount * (Number(priceForTitle) || 0);

  return orderProducts && identifier ? (
    <StyledWorkspace>
      {!!orderProducts.length && getWorkspaceByRegion(currentRegion)}
      <Bottom
        isManual={!(foundedItems && foundedItems[identifier]?.length)}
      >
        {!!(foundedItems && foundedItems[identifier]?.length) && (
          <AddAnother onClick={addAnother}>
            <AddIcon />
            Add Another
          </AddAnother>
        )}
        <Total>
          {selectedItemsCount ? (
            <TotalCount>
              x
              {selectedItemsCount}
            </TotalCount>
          ) : ''}
          <TotalPrice>
            {price === 0 ? '--' : `$${(price / 100).toFixed(2)}`}
          </TotalPrice>
        </Total>
      </Bottom>
    </StyledWorkspace>
  ) : <></>;
};

const StyledWorkspace = styled.div`
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid rgba(26, 28, 30, 0.16);
`;

const AddAnother = styled.button`
  display: flex;
  align-items: center;
  grid-gap: 12px;
  padding: 0;
  border: none;
  font-size: 14px;
  font-weight: 500;
  line-height: 14px;
  color: var(--primary-green-color);
  cursor: pointer;
  background-color: transparent;
  
  svg * {
    stroke: var(--primary-green-color);
  }
`;

const Bottom = styled.div<{ isManual: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-gap: 32px;
  height: 26px;
  
  ${({ isManual }) => isManual && css`
    justify-content: flex-end;
  `}
`;

const Total = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 16px;
`;

const TotalCount = styled.span`
  display: block;
  padding: 2px 10px;
  border: 1px solid rgba(35, 35, 35, 0.16);
  border-radius: 100px;
  font-size: 16px;
  font-weight: 500;
`;

const TotalPrice = styled.span`
  font-size: 16px;
  color: #232323;
  font-weight: 500;
`;

export default Workspace;
