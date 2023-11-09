import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import CloseIcon from '@/assets/icons/CloseIcon';
import ServicesIcon from '@/assets/icons/ServicesIcon';

import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import Loader from '@/components/Loader';
import LoadingContainer from '@/components/LoadingContainer';
import DeactivateModal from '@/components/Modal/DeactivateModal';
import Modal from '@/components/Modal/Modal';
import NoFound from '@/components/NoFound';
import Pagination from '@/components/Pagination';
import Filters from '@/components/Table/Filters';

import { getOrganisationServices } from '@/store/actions/organisationsActions';
import {
  changeServiceStatusInOrganisation,
} from '@/store/actions/servicesActions';
import { userActions } from '@/store/actions/userActions';

import { IOrganisationService } from '@/store/reducers/services';
import { PopupTypes } from '@/store/reducers/user';

import { selectOrganisationServices } from '@/store/selectors/organisationsSelector';

import useInput from '@/hooks/useInput';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import useToggle from '@/hooks/useToggle';

import getNounByForm from '@/utils/getNounByForm';
import { sort } from '@/utils/sort';

import { AppDispatch } from '@/store';

const limits = [20, 50, 100];

export enum ServiceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

interface Props {
  organisationId: number;
  organisationName: string;
}

const OrganisationServices: React.FC<Props> = ({
  organisationId,
  organisationName,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [search, setSearch] = useInput();
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(0);
  const [supplier, setSupplier] = useState<string | null>(null);
  const [supplierRef, isSupplierVisible, toggleIsSupplierVisible] = useOnClickOutside<HTMLDivElement>();
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [statusRef, isStatusesVisible, toggleIsStatusesVisible] = useOnClickOutside<HTMLDivElement>();
  const [selectedServices, setSelectedServices] = useState<
  IOrganisationService[]
  >([]);
  const [isLoading, setIsLoading] = useToggle(true);
  const [isStatusLoading, setIsStatusLoading] = useToggle(false);
  const services = [...useSelector(selectOrganisationServices)].sort((a, b) => a?.supplier.localeCompare(b?.supplier));
  const [isModal, setIsModal] = useToggle(false);

  useEffect(() => {
    getServices();
  }, []);

  useEffect(() => {
    setOffset(0);
  }, [status, search, limit, supplier]);

  const getServices = async () => {
    setIsLoading(true);
    await dispatch(getOrganisationServices(organisationId));
    setIsLoading(false);
  };

  const activeServices = useMemo(
    () => services.filter((service) => service.status).length,
    [services],
  );

  const suppliers = useMemo(
    () => [...new Set(services.map((service) => service.supplier))],
    [services],
  );

  const filteredServices = useMemo(() => {
    const servicesFilteredByStatus = status
      ? services.filter(
        (service) => service.status === (status === ServiceStatus.ACTIVE),
      )
      : services;

    const servicesFilteredBySupplier = supplier
      ? servicesFilteredByStatus.filter(
        (service) => service.supplier === supplier,
      )
      : servicesFilteredByStatus;

    const servicesSearch = search
      ? servicesFilteredBySupplier.filter(
        (service) => service.productId.toLowerCase().includes(search.toLowerCase())
            || service.searchType.toLowerCase().includes(search.toLowerCase()),
      )
      : servicesFilteredBySupplier;

    return sort(servicesSearch, (service) => !service.status);
  }, [services, status, search, supplier]);

  const servicesPagination = useMemo(() => filteredServices.slice(
    limits[limit] * offset,
    limits[limit] * offset + limits[limit],
  ), [filteredServices, limit, offset]);

  const maxPages = Math.ceil(filteredServices.length / limits[limit]);

  const calculatedOffset = maxPages > 1 ? offset : 0;

  const onCheckboxClick = (
    isChecked: boolean,
    selectedService: IOrganisationService,
  ) => {
    setSelectedServices((prevState) => {
      if (!isChecked) {
        return prevState.filter(
          ({ productId }) => !(productId === selectedService.productId),
        );
      }
      return [...prevState, selectedService];
    });
  };

  const handleChangeStatus = async () => {
    try {
      setIsStatusLoading(true);
      const requests = selectedServices.map((service) => ({
        productId: service.productId,
        isActive: !service.status,
        organisationId,
      }));

      await dispatch(changeServiceStatusInOrganisation(requests));
      await dispatch(getOrganisationServices(organisationId));

      dispatch(userActions.setPopup({
        type: PopupTypes.SUCCESS,
        mainText: 'Status changed',
        additionalText: 'Status have been updated',
      }));

      clearAllSelectedService();
      setIsStatusLoading(false);
      handleCloseModal();
    } catch (e) {
      setIsStatusLoading(false);
    }
  };

  const handleStatus = () => {
    if (!selectedServices[0].status) {
      handleChangeStatus();
      return;
    }

    handleOpenModal();
  };

  const handleCloseModal = () => {
    setIsModal(false);
  };

  const handleOpenModal = () => {
    setIsModal(true);
  };

  const deactivateUserText = useMemo(() => {
    if (!selectedServices.length) {
      return '';
    }

    if (selectedServices.length > 1) {
      return `Are you sure you want to deactivate the selected ${selectedServices.length} services for ${organisationName}?`;
    }

    return `Are you sure you want to deactivate the selected service(${selectedServices[0].searchType}) for ${organisationName}?`;
  }, [selectedServices]);

  const filteredServicesByPage: IOrganisationService[] = useMemo(
    () => filteredServices.slice(
      offset * limits[limit],
      (offset + 1) * limits[limit],
    ),
    [offset, limit, filteredServices],
  );

  const allPossibleServiceChoose = useMemo(
    () => filteredServicesByPage.filter((service) => {
      if (selectedServices[0]?.status !== undefined) {
        return service.status === selectedServices[0]?.status;
      }
      if (filteredServicesByPage.find(({ status: s }) => !s)) {
        return !service.status;
      }
      return service.status;
    }),
    [filteredServicesByPage, selectedServices],
  );

  const isAllChecked = useMemo(
    () => allPossibleServiceChoose.every((service) => selectedServices.some(
      (selectedOrg) => service.productId === selectedOrg.productId,
    )),
    [allPossibleServiceChoose, selectedServices],
  );

  const selectAllCheckboxes = () => {
    if (isAllChecked) {
      const removedSelectedServices = selectedServices.filter(
        ({ productId }) => !allPossibleServiceChoose.some(
          (service) => productId === service.productId,
        ),
      );
      setSelectedServices(removedSelectedServices);
      return;
    }

    const allSelectedOrg = allPossibleServiceChoose.reduce((acc, service) => {
      if (acc.some(({ productId }) => service.productId === productId)) {
        return acc;
      }

      return [...acc, service];
    }, selectedServices);

    setSelectedServices(allSelectedOrg);
  };

  const clearAllSelectedService = () => {
    setSelectedServices([]);
  };

  return (
    <LoadingContainer isLoading={isLoading}>
      <OrganisationServicesStyled>
        <Title>Services</Title>
        <ActiveServicesWrap>
          <ActiveTitle>{`${activeServices} Active Services`}</ActiveTitle>
          <ActiveSubTitle>{`${activeServices} / ${services.length} services activated`}</ActiveSubTitle>
        </ActiveServicesWrap>
        <ContentWrapper>
          <TableTitle>
            <Name>Price List</Name>
            {services && services.length && (
              <PriceListName to={`/price-lists/${services[0].priceListId}`}>
                {services[0].priceListName}
              </PriceListName>
            )}
          </TableTitle>
          <TableWrap>
            <Filters
              search={{
                searchValue: search,
                placeholder: 'Search services',
                setSearchValue: (evt) => {
                  setSearch(evt.target.value);
                  setOffset(0);
                },
                clear: () => setSearch(''),
              }}
              filters={[
                {
                  name: 'Supplier',
                  value: supplier,
                  setValue: setSupplier,
                  values: suppliers,
                  isApplied: !!supplier,
                  ref: supplierRef,
                  isDropdownVisible: isSupplierVisible,
                  toggleIsVisible: toggleIsSupplierVisible,
                  containLargeValues: true,
                },
                {
                  name: 'Status',
                  value: status,
                  setValue: setStatus,
                  values: Object.values(ServiceStatus),
                  isApplied: status !== null,
                  ref: statusRef,
                  isDropdownVisible: isStatusesVisible,
                  normalizeValue: (v: string) => v.toLowerCase(),
                  toggleIsVisible: toggleIsStatusesVisible,
                  containLargeValues: true,
                },
              ]}
            />
            {filteredServices.length ? (
              <TableWrapper>
                <Table>
                  <THead>
                    <tr>
                      <th>
                        <Checkbox
                          type="checkbox"
                          checked={isAllChecked}
                          onChange={selectAllCheckboxes}
                          disabled={!allPossibleServiceChoose.length}
                        />
                      </th>
                      <th>PRODUCT CODE</th>
                      <th>SERVICE</th>
                      <th>SUPPLIER</th>
                      <th>TOTAL (inc. GST)</th>
                      <th>STATUS</th>
                    </tr>
                  </THead>
                  <TBody>
                    {servicesPagination.map((service, i) => (
                      <TRow
                        key={i}
                        isChecked={
                          !!selectedServices.find(
                            ({ productId }) => productId === service.productId,
                          )
                        }
                      >
                        <th>
                          <Checkbox
                            type="checkbox"
                            disabled={
                              selectedServices.length
                                ? selectedServices[0].status !== service.status
                                : false
                            }
                            checked={
                              !!selectedServices.find(
                                ({ productId }) => productId === service.productId,
                              )
                            }
                            onChange={({ target }) => onCheckboxClick(target.checked, service)}
                          />
                        </th>
                        <th>{service.productId}</th>
                        <th>{service.searchType || '-'}</th>
                        <th>{service.supplier || '-'}</th>
                        <th>{`$${(+service.total / 100).toFixed(2)}` || '-'}</th>
                        <th>
                          <StatusCell isActive={service.status}>
                            {service.status
                              ? ServiceStatus.ACTIVE
                              : ServiceStatus.INACTIVE}
                          </StatusCell>
                        </th>
                      </TRow>
                    ))}
                  </TBody>
                </Table>
              </TableWrapper>
            ) : (
              <NoFound />
            )}
            {!!filteredServices.length && (
              <Pagination
                changePage={setOffset}
                currentPage={calculatedOffset}
                maxPages={maxPages}
                maxElements={filteredServices.length}
                limits={limits}
                limit={limit}
                setLimit={setLimit}
              />
            )}
          </TableWrap>
        </ContentWrapper>
        {selectedServices.length ? (
          <PopUp>
            <OrganisationsCount>
              <ServicesIcon />
              {`${getNounByForm(selectedServices.length, 'Service')} selected`}
            </OrganisationsCount>
            <ButtonWrap>
              <Button
                onClick={handleStatus}
                isRedButton={selectedServices[0].status}
                style={{ width: '140px' }}
              >
                {isStatusLoading ? (
                  <Loader size={24} thickness={2} color="#fff" />
                ) : selectedServices[0].status ? (
                  'Deactivate'
                ) : (
                  'Activate'
                )}
              </Button>
            </ButtonWrap>
            <Actions>
              <StyledCloseIcon handler={clearAllSelectedService} />
            </Actions>
          </PopUp>
        ) : (
          ''
        )}
        {isModal && (
          <Modal closeModal={handleCloseModal}>
            <DeactivateModal
              title="Deactivate Service?"
              subTitle={deactivateUserText}
              cancelButton={{
                onCancel: handleCloseModal,
                name: 'Cancel',
                isLoading: false,
                style: {
                  isCancel: true,
                  style: { height: '48px', fontSize: '16px' },
                },
              }}
              confirmButton={{
                onConfirm: handleChangeStatus,
                name: 'Yes',
                isLoading: isStatusLoading,
                style: {
                  isRedButton: true,
                  style: { width: '90px', height: '48px', fontSize: '16px' },
                },
              }}
            />
          </Modal>
        )}
      </OrganisationServicesStyled>
    </LoadingContainer>
  );
};

const OrganisationsCount = styled.p`
  display: flex;
  align-items: center;
  grid-gap: 13px;
`;

const Actions = styled.ul`
  display: flex;
  align-items: center;
  grid-gap: 16px;
`;

const StyledCloseIcon = styled(CloseIcon)`
  position: absolute;
  top: 50%;
  right: 32px;
  transform: translateY(-50%);
  cursor: pointer;
`;

const ButtonWrap = styled.div`
  margin-left: auto;
`;

const PopUp = styled.div`
  position: fixed;
  bottom: 150px;
  left: calc(50% + 256px / 2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 38px 86px 38px 32px;
  max-width: 822px;
  width: 100%;
  transform: translateX(-50%);
  background-color: #fff;
  box-shadow: 0 12px 80px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const StatusCell = styled.span<{ isActive: boolean }>`
  display: block;
  padding: 4px 6px;
  width: fit-content;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  background-color: ${({ isActive }) => (isActive
    ? 'var(--primary-green-background-color)'
    : 'var(--primary-red-background-color)')};
  color: ${({ isActive }) => (isActive ? 'var(--primary-green-color)' : 'var(--primary-red-color)')};
`;

const TableWrapper = styled.div`
  margin-bottom: 1rem;
  overflow-x: auto;
`;

const Table = styled.table`
  display: table;
  width: 100%;
  border-spacing: 0;
  -webkit-border-horizontal-spacing: 0;
  -webkit-border-vertical-spacing: 0;

  * {
    white-space: nowrap;
  }
`;

const THead = styled.thead`
  background-color: #f9f9f9;

  th {
    padding: 12px 35px 12px 0;
    font-size: 12px;
    font-weight: 400;
    color: rgba(17, 24, 39, 0.5);
    text-transform: uppercase;
    text-align: left;

    :first-child {
      padding: 12px;
      border-top-left-radius: 4px;
    }

    :last-child {
      border-top-right-radius: 4px;
    }
  }
`;

const TBody = styled.tbody`
  th {
    padding: 14px 35px 14px 0;
    max-width: 200px;
    height: 64px;
    background-color: #fff;
    font-size: 14px;
    font-weight: 500;
    text-align: left;
    white-space: normal;

    :first-child {
      padding-left: 12px;
    }
  }
`;

const TRow = styled.tr<{ isChecked: boolean }>`
  cursor: pointer;

  th {
    background-color: ${({ isChecked }) => (isChecked ? '#E8F6FA' : '#fff')};
  }

  :hover th {
    background-color: ${({ isChecked }) => (isChecked ? '#E8F6FA' : '#F9F9F9')};
  }

  :last-child {
    th:first-child {
      border-bottom-left-radius: 4px;
    }

    th:last-child {
      border-bottom-right-radius: 4px;
    }
  }
`;

const TableWrap = styled.div``;

const PriceListName = styled(Link)`
  font-weight: 500;
  font-size: 18px;
  letter-spacing: -0.03em;
  color: #27a376;
  padding-left: 10px;
  border-left: 1px solid #dce4e8;
`;

const Name = styled.span`
  font-weight: 500;
  font-size: 18px;
  letter-spacing: -0.03em;
  color: #1a1c1e;
  padding-right: 10px;
`;

const TableTitle = styled.span``;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
`;

const ActiveTitle = styled.div`
  font-weight: 600;
  font-size: 20px;
  letter-spacing: -0.03em;
  color: #111827;
`;

const ActiveSubTitle = styled.div`
  font-weight: 500;
  font-size: 16px;
  letter-spacing: -0.03em;
  color: #6c7278;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 18px;
  letter-spacing: -0.02em;
  color: #111827;
`;

const ActiveServicesWrap = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  border: 1px solid #dce4e8;
  border-radius: 9px;
`;

const OrganisationServicesStyled = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 32px;
`;

export default OrganisationServices;
