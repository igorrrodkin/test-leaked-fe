import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import base64 from 'base-64';
import styled from 'styled-components';
import usePlacesAutocomplete, { getDetails } from 'use-places-autocomplete';

import { Result } from '@/api/mainGoogleApi';

import SearchIcon from '@/assets/icons/SearchIcon';

import Background from '@/components/GlobalSearch/Background';
import GlobalSearchInput from '@/components/GlobalSearch/GlobalSearchInput';
import GoogleAddress from '@/components/GlobalSearch/GoogleAddress';
import RecentSearches from '@/components/GlobalSearch/RecentSearches';
import RecentServices from '@/components/GlobalSearch/RecentServices';
import SearchesByOwner from '@/components/GlobalSearch/SearchesByOwner';
import Loader from '@/components/Loader';

import { orderActions } from '@/store/actions/orderActions';

import { FullfilmentType, IOrganisationService } from '@/store/reducers/services';

import {
  selectIsOrderStarted, selectMatter, selectProducts, selectSelectedRegion,
} from '@/store/selectors/orderSelectors';
import { selectOrganisationServices } from '@/store/selectors/servicesSelector';

import useClickOutside from '@/hooks/useClickOutside';
import useInput from '@/hooks/useInput';
import useToggle from '@/hooks/useToggle';

import getRegionsData, { ExistingRegions } from '@/utils/getRegionsData';
import LocalStorage from '@/utils/localStorage';
import search from '@/utils/search';

export interface IAddress {
  address: string;
  placeId: string;
}

export interface Props {}

function findSuffix(region: ExistingRegions, streetName: string | undefined) {
  if (region === ExistingRegions.QLD
    || region === ExistingRegions.ACT
    || region === ExistingRegions.TAS
    || region === ExistingRegions.NT) {
    return { name: streetName };
  }

  const suffixes = ['Alley', 'Ally', 'Arcade', 'Arc', 'Avenue', 'Ave', 'Boulevard', 'Bvd', 'Bypass', 'Bypa', 'Circuit', 'Cct', 'Close', 'Cl', 'Corner', 'Crn', 'Court', 'Ct', 'Crescent', 'Cres', 'Cul-de-sac', 'Cds', 'Drive', 'Dr', 'Esplanade', 'Esp', 'Green', 'Grn', 'Grove', 'Gr', 'Highway', 'Hwy', 'Junction', 'Jnc', 'Lane', 'Lane', 'Link', 'Link', 'Mews', 'Mews', 'Parade', 'Pde', 'Place', 'Pl', 'Ridge', 'Rdge', 'Road', 'Rd', 'Square', 'Sq', 'Street', 'St', 'Terrace', 'Tce', 'Alley Service Road', 'Ally Service Road', 'Arcade Service Road', 'Arc Service Road', 'Avenue Service Road', 'Ave Service Road', 'Boulevard Service Road', 'Bvd Service Road', 'Bypass Service Road', 'Bypa Service Road', 'Circuit Service Road', 'Cct Service Road', 'Close Service Road', 'Cl Service Road', 'Corner Service Road', 'Crn Service Road', 'Court Service Road', 'Ct Service Road', 'Crescent Service Road', 'Cres Service Road', 'Cul-de-sac Service Road', 'Cds Service Road', 'Drive Service Road', 'Dr Service Road', 'Esplanade Service Road', 'Esp Service Road', 'Green Service Road', 'Grn Service Road', 'Grove Service Road', 'Gr Service Road', 'Highway Service Road', 'Hwy Service Road', 'Junction Service Road', 'Jnc Service Road', 'Lane Service Road', 'Lane Service Road', 'Link Service Road', 'Link Service Road', 'Mews Service Road', 'Mews Service Road', 'Parade Service Road', 'Pde Service Road', 'Place Service Road', 'Pl Service Road', 'Ridge Service Road', 'Rdge Service Road', 'Road Service Road', 'Rd Service Road', 'Square Service Road', 'Sq Service Road', 'Street Service Road', 'St Service Road', 'Terrace Service Road', 'Tce Service Road'];

  // Sort suffixes by length in descending order
  suffixes.sort((a, b) => b.length - a.length);

  let name = '';
  let foundSuffix = '';

  for (let i = 0; i < suffixes.length; i += 1) {
    if (streetName && streetName.endsWith(suffixes[i])) {
      name = streetName.substring(0, streetName.length - suffixes[i].length).trim();
      foundSuffix = suffixes[i];
      break;
    }
  }

  return {
    name,
    foundSuffix,
  };
}

const GlobalSearch: React.FC<Props> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [globalSearch, setGlobalSearch] = useInput();
  const [recentSearches, setRecentSearches] = useState<string[]>(
    LocalStorage.getRecentSearches(),
  );
  const [recentServices, setRecentServices] = useState<IOrganisationService[]>(
    LocalStorage.getRecentServices(),
  );
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [isOpen, setIsOpen] = useToggle(false);
  const [isLoading, setIsLoading] = useToggle(false);

  const matter = useSelector(selectMatter);
  const products = useSelector(selectProducts);
  const regionData = useSelector(selectSelectedRegion);
  const isOrderStarted = useSelector(selectIsOrderStarted);
  const services = useSelector(selectOrganisationServices);

  const isOrderProceeding = useMemo(() => !!(matter && isOrderStarted), [isOrderStarted]);

  const { suggestions, setValue } = usePlacesAutocomplete({
    requestOptions: {
      region: '3166-2:au',
      language: 'en',
      types: ['address'],
      componentRestrictions: {
        country: 'au',
      },
    },
    debounce: 500,
  });

  useEffect(() => {
    try {
      const results: IAddress[] = suggestions.data.map(
        ({ description, place_id }) => ({
          address: description,
          placeId: place_id,
        }),
      );
      setAddresses(results);
      if (globalSearch) {
        setIsLoading(false);
      }
    } catch {
      setIsLoading(false);
    }
  }, [suggestions.data]);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const ref = useClickOutside(handleCloseModal);

  const regionsData = useMemo(() => getRegionsData(), []);

  const foundServices = useMemo(
    () => (globalSearch.length > 2
      ? search(services, globalSearch, ({ searchType }) => searchType).slice(
        0,
        5,
      )
      : []),
    [globalSearch],
  );

  const updateRecentSearches = (recentSearch: string) => {
    const isFoundSearch = recentSearches.some(
      (s) => s === recentSearch,
    );

    if (isFoundSearch) {
      const sortedRecentSearches = [...recentSearches].sort((a) => (a === recentSearch ? -1 : 1));

      setRecentSearches(sortedRecentSearches);
      LocalStorage.setRecentSearches(sortedRecentSearches);
      return;
    }

    const updatedSearches = [globalSearch, ...recentSearches].slice(0, 5);

    setRecentSearches(updatedSearches);
    LocalStorage.setRecentSearches(updatedSearches);
  };

  const updateRecentServices = (recentService: IOrganisationService) => {
    const isFoundService = recentServices.some(
      ({ productId }) => productId === recentService.productId,
    );

    if (isFoundService) {
      const sortedRecentServices = [...recentServices].sort((a) => (a.productId === recentService.productId ? -1 : 1));

      setRecentServices(sortedRecentServices);
      LocalStorage.setRecentServices(sortedRecentServices);
      return;
    }

    const updatedServices = [recentService, ...recentServices].slice(0, 5);

    setRecentServices(updatedServices);
    LocalStorage.setRecentServices(updatedServices);
  };

  const handleOnKeyPress = (searchStr: string) => {
    updateRecentSearches(searchStr);
    navigate(`/global-search?${base64.encode(`s=${searchStr}`)}`);
    setGlobalSearch('');
    setIsOpen(false);
  };

  const handleRecentSearchClick = (recentSearch: string) => {
    updateRecentSearches(recentSearch);
    setGlobalSearch('');
    navigate(`/global-search?${base64.encode(`s=${recentSearch}`)}`);
    setIsOpen(false);
  };

  const handleRecentServiceClick = (recentService: IOrganisationService) => {
    updateRecentServices(recentService);
    setGlobalSearch('');

    const selectedRegion = regionsData.findIndex(
      ({ region }) => region === recentService.region,
    );
    const regionName = regionsData[selectedRegion].region;

    const selectedService = regionsData[selectedRegion].services.findIndex(
      ({ productId }) => recentService.productId === productId,
    );

    if (isOrderProceeding && regionData !== selectedRegion) {
      if (selectedService !== -1) {
        dispatch(orderActions.setResetOrder({
          isModalVisible: true,
          regionToChange: selectedRegion,
          serviceToChange: selectedService === -1 ? 0 : selectedService,
          isGlobalSearch: true,
          productToScroll: recentService.productId,
        }));
      } else {
        dispatch(orderActions.setResetOrder({
          isModalVisible: true,
          regionToChange: selectedRegion,
          serviceToChange: selectedService === -1 ? 0 : selectedService,
          isGlobalSearch: true,
        }));
      }
    } else {
      dispatch(orderActions.setSelectedRegion(selectedRegion));

      dispatch(
        orderActions.setSelectedService(
          selectedService === -1 ? 0 : selectedService,
        ),
      );

      if (selectedService === -1) {
        dispatch(orderActions.setProductToScroll(recentService.productId));
      }

      navigate(`/${regionName.toLocaleLowerCase()}`);
      setIsOpen(false);
    }
  };

  const handleSearchesByOwnerClick = (
    owner: string,
    currentRegion: ExistingRegions,
  ) => {
    setGlobalSearch('');

    const selectedRegion = regionsData.findIndex(
      ({ region }) => region === currentRegion,
    );

    const regionName = regionsData[selectedRegion].region;

    const standardSearche = products?.filter((el) => el.region === regionsData[selectedRegion].region)
      .filter(
        (el) => el.label === 'National Property Ownership Report'
        || el.label === 'Owner/Lessee Name Search'
        || el.label === 'Owner Name Search'
        || el.label === 'Name Search',
      );

    const selectedService = regionsData[selectedRegion].services.findIndex(
      ({ name }) => name === 'Owner (Individual)',
    );

    const searchName = owner.trim().split(' ').filter((item) => item.length);
    const firstName = searchName.length > 1 ? searchName.slice(0, searchName.length - 1).join(' ') : '';
    const surname = searchName.at(-1) || '';

    if (isOrderProceeding && regionData !== selectedRegion) {
      if (selectedService !== -1) {
        dispatch(orderActions.setResetOrder({
          isModalVisible: true,
          regionToChange: selectedRegion,
          serviceToChange: selectedService === -1 ? 0 : selectedService,
          isGlobalSearch: true,
          initialOrderData: {
            region: currentRegion,
            firstName,
            surname,
          },
        }));
      } else {
        dispatch(orderActions.setResetOrder({
          isModalVisible: true,
          regionToChange: selectedRegion,
          serviceToChange: selectedService === -1 ? 0 : selectedService,
          isGlobalSearch: true,
          ...((standardSearche
            && standardSearche.length
            && standardSearche[0].fulfilmentType === FullfilmentType.MANUAL) ? {
              productToScroll: standardSearche[0].productId,
              initialStandardSearcheData: {
                firstName,
                surname,
              },
            } : {}),
        }));
      }
    } else {
      dispatch(orderActions.setSelectedRegion(selectedRegion));

      dispatch(
        orderActions.setSelectedService(
          selectedService === -1 ? 0 : selectedService,
        ),
      );

      if (selectedService !== -1) {
        dispatch(
          orderActions.setInitialOrderData({
            region: currentRegion,
            firstName,
            surname,
          }),
        );
      }

      if (
        standardSearche
        && standardSearche.length
        && standardSearche[0].fulfilmentType === FullfilmentType.MANUAL
      ) {
        dispatch(orderActions.setProductToScroll(standardSearche[0].productId));
        dispatch(
          orderActions.setInitialStandardSearcheData({
            firstName,
            surname,
          }),
        );
      }

      navigate(`/${regionName.toLocaleLowerCase()}`);
      setIsOpen(false);
    }
  };

  const handleAddressClick = async (selectedAddress: IAddress) => {
    try {
      setGlobalSearch('');

      const {
        address_components:
        addressComponents,
      } = await getDetails({ placeId: selectedAddress.placeId }) as Result;

      const placeStreet = addressComponents.find(({ types }) => types.includes('route'))?.long_name;

      const placeSuburb = addressComponents.find(({ types }) => types.includes('locality'))?.long_name;

      const placeRegion = addressComponents.find(({ types }) => types.includes('administrative_area_level_1'))?.short_name;

      const placeStreetNumber = addressComponents.find(({ types }) => types.includes('street_number'))?.long_name;

      const placeUnitNumber = addressComponents.find(({ types }) => types.includes('subpremise'))?.long_name;

      const selectedRegion = regionsData.findIndex(
        ({ region }) => region === placeRegion,
      );

      const regionName = regionsData[selectedRegion].region;

      const selectedService = regionsData[selectedRegion].services.findIndex(
        ({ name }) => name === 'Address' || name === 'Property Address',
      );

      const { name } = findSuffix(regionName, placeStreet);

      if (isOrderProceeding && regionData !== selectedRegion) {
        if (selectedService !== -1 && !!placeRegion) {
          dispatch(orderActions.setResetOrder({
            isModalVisible: true,
            regionToChange: selectedRegion,
            serviceToChange: selectedService === -1 ? 0 : selectedService,
            isGlobalSearch: true,
            initialOrderData: {
              region: placeRegion,
              ...(name ? { street: name } : {}),
              ...(placeSuburb ? { suburb: placeSuburb } : {}),
              ...(placeUnitNumber ? { unitNumber: placeUnitNumber } : {}),
              ...(placeStreetNumber ? { streetNumber: placeStreetNumber } : {}),
            },
          }));
        } else {
          dispatch(orderActions.setResetOrder({
            isModalVisible: true,
            regionToChange: selectedRegion,
            serviceToChange: selectedService === -1 ? 0 : selectedService,
            isGlobalSearch: true,
          }));
        }
      } else {
        dispatch(orderActions.setSelectedRegion(selectedRegion));

        dispatch(
          orderActions.setSelectedService(
            selectedService === -1 ? 0 : selectedService,
          ),
        );

        if (selectedService !== -1 && !!placeRegion) {
          dispatch(
            orderActions.setInitialOrderData({
              region: placeRegion,
              ...(name ? { street: name } : {}),
              ...(placeSuburb ? { suburb: placeSuburb } : {}),
              ...(placeUnitNumber ? { unitNumber: placeUnitNumber } : {}),
              ...(placeStreetNumber ? { streetNumber: placeStreetNumber } : {}),
            }),
          );
        }

        navigate(`/${regionName.toLocaleLowerCase()}`);
        setIsOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (searchValue: string) => {
    if (!searchValue) {
      setAddresses([]);
    }

    setValue(searchValue);
    setGlobalSearch(searchValue);
  };

  return (
    <GlobalSearchStyled ref={ref}>
      <SearchIcon />
      <GlobalSearchInput
        inputRef={null}
        value={globalSearch}
        onChange={handleSearch}
        onKeyPress={handleOnKeyPress}
        onClick={handleOpenModal}
      />
      {!!globalSearch && isOpen && (
        <>
          <Background onClick={handleCloseModal} />
          <Results>
            {isLoading && (
              <LoaderWrap>
                <Loader />
              </LoaderWrap>
            )}
            {!isLoading && !!addresses.length && (
              <RecentBlock>
                {addresses.map((result) => (
                  <GoogleAddress
                    key={result.address}
                    result={result}
                    onClick={handleAddressClick}
                  />
                ))}
              </RecentBlock>
            )}
            {!isLoading && !addresses.length && (
              <RecentBlock>
                {Object.values(ExistingRegions).map((region) => (
                  <SearchesByOwner
                    key={region}
                    owner={globalSearch}
                    region={region}
                    onClick={handleSearchesByOwnerClick}
                  />
                ))}
              </RecentBlock>
            )}
            {!!recentSearches.length && <Line />}
            {!!recentSearches.length && (
              <RecentBlock>
                <Title>RECENT SEARCHES</Title>
                {recentSearches.map((s) => (
                  <RecentSearches
                    key={s}
                    search={s}
                    onClick={handleRecentSearchClick}
                  />
                ))}
              </RecentBlock>
            )}
            {(!!recentServices.length || !!foundServices.length) && <Line />}
            {!!recentServices.length && !foundServices.length && (
              <RecentBlock>
                <Title>RECENT SERVICES</Title>
                {recentServices.map((service) => (
                  <RecentServices
                    key={service.productId}
                    service={service}
                    onClick={handleRecentServiceClick}
                  />
                ))}
              </RecentBlock>
            )}
            {!!foundServices.length && (
              <RecentBlock>
                <ActiveTitle>FIND SERVICES</ActiveTitle>
                {foundServices.map((service) => (
                  <RecentServices
                    key={service.productId}
                    service={service}
                    onClick={handleRecentServiceClick}
                  />
                ))}
              </RecentBlock>
            )}
          </Results>
        </>
      )}
    </GlobalSearchStyled>
  );
};

const LoaderWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Line = styled.div`
  background-color: #dce4e8;
  height: 1px;
  width: 100%;
`;

const Title = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: -0.03em;
  color: #6c7278;
`;

const ActiveTitle = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: -0.03em;
  color: #ffa500;
`;

const RecentBlock = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
`;

const Results = styled.div`
  position: absolute;
  top: calc(100% + 16px);
  display: flex;
  flex-direction: column;
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  width: 606px;
  row-gap: 24px;
  z-index: 1001;
`;

const GlobalSearchStyled = styled.div`
  display: flex;
  align-items: center;
  column-gap: 16px;
  flex: 1;
  position: relative;
`;

export default GlobalSearch;
