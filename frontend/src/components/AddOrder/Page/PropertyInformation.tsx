import React, {
  useEffect, useMemo, useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import ResetOrderModal from '@/components/AddOrder/Page/ResetOrderModal';
import Input from '@/components/Input';
import PageTitle from '@/components/PageTitle';

import { SubTitle, Tip, Tips } from '@/pages/AddOrder';

import { changeRegionAction, orderActions } from '@/store/actions/orderActions';

import {
  selectIsMatterError,
  selectIsOrderStarted,
  selectMatter,
  selectSelectedRegion,
  selectShouldScrollToMatter, selectShouldShowMatterError,
} from '@/store/selectors/orderSelectors';

import getRegionsData from '@/utils/getRegionsData';
import { validateMatter } from '@/utils/servicesValidation';

import { AppDispatch } from '@/store';

const mockedData = getRegionsData();

const PropertyInformation = () => {
  const navigate = useNavigate();

  const matterInputRef = useRef<HTMLDivElement>(null);

  const selectedRegion = useSelector(selectSelectedRegion);
  const matter = useSelector(selectMatter);
  const isMatterError = useSelector(selectIsMatterError);
  const shouldShowMatterError = useSelector(selectShouldShowMatterError);
  const shouldScrollToMatter = useSelector(selectShouldScrollToMatter);
  const isOrderStarted = useSelector(selectIsOrderStarted);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (shouldScrollToMatter && matterInputRef.current) {
      matterInputRef.current.scrollIntoView({
        behavior: 'smooth',
      });
      dispatch(orderActions.setShouldScrollToMatter(false));
    }
  }, [shouldScrollToMatter]);

  const isOrderProceeding = useMemo(() => !!(matter && isOrderStarted), [isOrderStarted]);

  return (
    <PageHeader ref={matterInputRef}>
      <StyledLink to="/dashboard/matters">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.7">
            <path
              d="M9.57 5.92999L3.5 12L9.57 18.07"
              stroke="#111827"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.5 12H3.67"
              stroke="#111827"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
        <PageTitle>Property Information</PageTitle>
      </StyledLink>
      <Matter>
        <MatterInputs>
          <Input
            label="Matter / File Reference"
            labelColor="#1A1C1E"
            placeholder="Enter matter here"
            inputMarginBottom="0"
            value={matter}
            isError={!!(shouldShowMatterError && isMatterError)}
            errorMessage={shouldShowMatterError ? isMatterError : ''}
            shouldBeFocused={shouldScrollToMatter}
            clearField={isOrderProceeding ? () => {
              dispatch(orderActions.setResetOrder({
                isModalVisible: true,
                regionToChange: 0,
              }));
            } : undefined}
            disabled={isOrderProceeding}
            onChange={!isOrderProceeding ? (evt) => {
              dispatch(orderActions.setMatter(evt.target.value));

              if (shouldShowMatterError) {
                dispatch(orderActions.setIsMatterError(validateMatter(evt.target.value)));
              }
            } : undefined}
            onBlur={() => dispatch(orderActions.setShouldShowMatterError(false))}
          />
        </MatterInputs>
        <div>
          <SubTitle>Regions</SubTitle>
          <Tips>
            {mockedData.map((el, i) => (
              <Tip
                key={el.region}
                isSelected={selectedRegion === i}
                onClick={() => {
                  if (isOrderProceeding) {
                    dispatch(orderActions.setResetOrder({
                      isModalVisible: true,
                      regionToChange: i,
                    }));
                  } else {
                    dispatch(changeRegionAction(i));
                    navigate(`/${el.region.toLowerCase()}`);
                  }
                }}
              >
                {el.region}
              </Tip>
            ))}
          </Tips>
        </div>
      </Matter>
      <ResetOrderModal />
    </PageHeader>
  );
};

const PageHeader = styled.div`
  margin-bottom: 32px;
  padding: 32px 0;
  border-radius: 12px;
  background-color: #fff;

  h1 {
    margin-bottom: 0;
  }
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  grid-gap: 24px;
  padding: 0 32px 32px;
  border-bottom: 1px solid rgba(35, 35, 35, 0.16);
`;

const Matter = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 32px;
  padding: 32px 120px 32px 32px;

  input {
    margin: 0;
  }
`;

const MatterInputs = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 16px;
`;

export default PropertyInformation;
