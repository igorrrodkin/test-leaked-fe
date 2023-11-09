import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ResultTable from '@/components/AddOrder/Page/ResultTable';
import ResultTableWithPagination from '@/components/AddOrder/Page/ResultTableWithPagination';
import VerifiedTable from '@/components/AddOrder/Page/VerifiedTable';
import VerifiedTableWithPagination from '@/components/AddOrder/Page/VerifiedTableWithPagination';
import SearchInputs from '@/components/AddOrder/RegionsServices';
import Workspace from '@/components/AddOrder/Workspace/Workspace';
import Infotip from '@/components/Infotip';

import {
  Content, SubTitle, Tip, Tips,
} from '@/pages/AddOrder';

import { orderActions } from '@/store/actions/orderActions';

import {
  selectCurrentService,
  selectIsResultsVisible,
  selectOrderProducts, selectPagination,
  selectSelectedRegion,
  selectSelectedService,
  selectServices,
  selectVerifiedItems, selectVerifyTempData,
} from '@/store/selectors/orderSelectors';

import getRegionsData from '@/utils/getRegionsData';

import { AppDispatch } from '@/store';

const mockedData = getRegionsData();

const TitleSearch = () => {
  const selectedRegion = useSelector(selectSelectedRegion);
  const selectedService = useSelector(selectSelectedService);
  const services = useSelector(selectServices);
  const currentService = useSelector(selectCurrentService);
  const orderProducts = useSelector(selectOrderProducts);
  const verifiedItems = useSelector(selectVerifiedItems);
  const isResultsVisible = useSelector(selectIsResultsVisible);
  const verifiedTempData = useSelector(selectVerifyTempData);
  const pagination = useSelector(selectPagination);

  const dispatch = useDispatch<AppDispatch>();

  const atLeastOneServiceIsAble = useMemo(() => mockedData[selectedRegion].services.some((el) => (
    services?.some((service) => service.productId === el.productId)
  )), [services, selectedRegion, currentService]);

  useEffect(() => {
    dispatch(orderActions.setSelectedServiceName(mockedData[selectedRegion].services[0].name));
  }, []);

  return (
    <Content style={{ marginBottom: '32px' }}>
      <div>
        <SubTitle marginBottom={32} fontSize={18} fontWeight={600}>
          Title Search
        </SubTitle>
        {atLeastOneServiceIsAble && (
          <>
            <SubTitle style={{ color: 'rgba(26, 28, 30, 0.5)' }}>
              Search by
              {currentService?.infotip && (
                <Infotip infotip={currentService.infotip} />
              )}
            </SubTitle>
            <Tips style={{ marginBottom: '32px' }}>
              {mockedData[selectedRegion].services.map((el, i) => {
                const isServiceAvailable = services!.find(
                  (service) => service.productId === el.productId,
                );
                return (
                  !!isServiceAvailable && (
                    <Tip
                      key={el.name}
                      isSelected={selectedService === i}
                      onClick={() => {
                        dispatch(orderActions.setSelectedService(i));
                        dispatch(orderActions.setSelectedServiceName(el.name));
                      }}
                    >
                      {el.name}
                    </Tip>
                  )
                );
              })}
            </Tips>
          </>
        )}
        <SearchInputs
          regionName={mockedData[selectedRegion].region}
          selectedService={selectedService}
        />
        {orderProducts && currentService && (
          <Workspace />
        )}
      </div>
      {isResultsVisible && (
        currentService && pagination[currentService.identifier!] ? (
          <ResultTableWithPagination />
        ) : (
          <ResultTable />
        )
      )}
      {verifiedItems && (
        verifiedTempData && pagination[verifiedTempData.identifier] ? (
          <VerifiedTableWithPagination />
        ) : (
          <VerifiedTable />
        )
      )}
    </Content>
  );
};

export default TitleSearch;
