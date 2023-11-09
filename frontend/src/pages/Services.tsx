import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import AddIcon from '@/assets/icons/AddIcon';
import CloseIcon from '@/assets/icons/CloseIcon';
import EditIcon from '@/assets/icons/EditIcon';
import ExportIcon from '@/assets/icons/ExportIcon';
import OrdersIcon from '@/assets/icons/OrdersIcon';

import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import Loader from '@/components/Loader';
import LoadingContainer from '@/components/LoadingContainer';
import DeactivateModal from '@/components/Modal/DeactivateModal';
import Modal from '@/components/Modal/Modal';
import NoFound from '@/components/NoFound';
import { ServiceStatus } from '@/components/OrganisationSettings/OrganisationServices';
import PageContainer from '@/components/PageContainer';
import PageTitle from '@/components/PageTitle';
import Pagination from '@/components/Pagination';
import ServiceModalWindow from '@/components/Service/ServiceModalWindow';
import Filters from '@/components/Table/Filters';
import TableThCell from '@/components/Table/TableTHCell';

import {
  changeStatusServicesAction,
  getUserServices,
} from '@/store/actions/servicesActions';

import { IService } from '@/store/reducers/services';
import { UserStatus } from '@/store/reducers/users';

import {
  selectIsUserServicesLoading,
  selectUserServices,
} from '@/store/selectors/servicesSelector';

import useInput from '@/hooks/useInput';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import useToggle from '@/hooks/useToggle';

import convertTimestamp from '@/utils/convertTimestamp';
import getCsvFile from '@/utils/getCsvFile';
import getNounByForm from '@/utils/getNounByForm';
import { sort } from '@/utils/sort';

const limits = [20, 50, 100];

const Services = () => {
  const [isNewServiceVisible, toggleIsNewServiceVisible] = useToggle();
  const [editableService, setEditableService] = useState<IService>();

  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(0);
  const [status, setStatus] = useState<UserStatus | null>(null);
  const [search, setSearch] = useInput();
  const [statusRef, isStatusesVisible, toggleIsStatusesVisible] = useOnClickOutside<HTMLDivElement>();

  const [selectedServices, setSelectedServices] = useState<IService[]>([]);
  const [isLoading, setIsLoading] = useToggle(false);
  const [isModal, setIsModal] = useToggle(false);

  const services = [...(useSelector(selectUserServices) || [])].sort((a, b) => a?.supplier.localeCompare(b?.supplier));

  const setIsUserServicesLoading = useSelector(selectIsUserServicesLoading);

  const dispatch = useDispatch<any>();

  useEffect(() => {
    if (services.length > 0) return;

    dispatch(getUserServices());
  }, []);

  useEffect(() => {
    setOffset(0);
  }, [status, search, limit]);

  const filteredServices = useMemo(() => {
    const servicesFilteredByStatus = status
      ? services.filter(
        (service) => service.status === (status.toUpperCase() === ServiceStatus.ACTIVE),
      )
      : services;

    const servicesSearch = search
      ? servicesFilteredByStatus.filter((service) => service.productId.toLowerCase().includes(search.toLowerCase()))
      : servicesFilteredByStatus;

    return sort(servicesSearch, (service) => !service.status);
  }, [services, status, search]);

  const servicesPagination = useMemo(() => filteredServices.slice(
    limits[limit] * offset,
    limits[limit] * offset + limits[limit],
  ), [filteredServices, limit, offset]);

  const maxPages = Math.ceil(filteredServices.length / limits[limit]);

  const calculatedOffset = maxPages > 1 ? offset : 0;

  const onCheckboxClick = (isChecked: boolean, selectedService: IService) => {
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
    setIsLoading(true);
    await dispatch(changeStatusServicesAction({
      status: !selectedServices[0].status,
      productIds: selectedServices.map((el) => el.productId),
    }));
    setIsLoading(false);
    clearAllSelectedService();
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModal(false);
  };

  const deactivateUserText = useMemo(() => {
    if (!selectedServices.length) {
      return '';
    }

    if (selectedServices.length > 1) {
      return `Are you sure you want to deactivate the selected ${selectedServices.length} services ?`;
    }

    return `Are you sure you want to deactivate ${selectedServices[0].searchType} ?`;
  }, [selectedServices]);

  const filteredServicesByPage: IService[] = useMemo(
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

  const isActiveMod = useMemo(
    () => selectedServices[0]?.status,
    [selectedServices],
  );

  const isAllChecked = useMemo(
    () => allPossibleServiceChoose.every((service) => (
      selectedServices.some((selectedOrg) => service.id === selectedOrg.id)
    )),
    [allPossibleServiceChoose, selectedServices],
  );

  const selectAllCheckboxes = () => {
    if (isAllChecked) {
      const removedSelectedServices = selectedServices.filter(
        ({ id }) => !allPossibleServiceChoose.some((service) => id === service.id),
      );
      setSelectedServices(removedSelectedServices);
      return;
    }

    const allSelectedOrg = allPossibleServiceChoose.reduce((acc, service) => {
      if (acc.some(({ id }) => service.id === id)) {
        return acc;
      }

      return [...acc, service];
    }, selectedServices);

    setSelectedServices(allSelectedOrg);
  };

  const exportServicesAsCsv = async () => {
    if (!services.length) return;

    const data = [
      ...services.map((item) => ({
        Collection: item.region,
        Supplier: item.supplier.replaceAll(',', ''),
        'Search Type': item.searchType.replaceAll(',', ''),
        Description: item.description.replaceAll(',', '').replaceAll('\n', '\\n'),
        'Product Code': item.productId,
        Group: item.group,
        Subgroup: item.subgroup,
        'Service Disclaimer': (item.serviceDisclaimer || '').replaceAll(',', '').replaceAll('\n', '\\n'),
        'Search Result Disclaimer': (item.searchResultDisclaimer || '').replaceAll(',', '').replaceAll('\n', '\\n'),
        Fulfillment: item.fulfilmentType,
        Status: item.status ? ServiceStatus.ACTIVE : ServiceStatus.INACTIVE,
      })),
    ];

    const fileName = `Services_${convertTimestamp(new Date().getTime()).toString()}`;

    getCsvFile(data, fileName);
  };

  const clearAllSelectedService = () => {
    setSelectedServices([]);
  };

  return (
    <PageContainer contentPadding="32px 0">
      <LoadingContainer
        isLoading={setIsUserServicesLoading && services.length === 0}
      >
        <PageHeader>
          <div>
            <PageTitle marginBottom="16px">Services</PageTitle>
            <p>Manage Services in this page</p>
          </div>
          <TopButtons>
            <NewService onClick={exportServicesAsCsv}>
              <ExportIcon />
              Export CSV
            </NewService>
            <NewService onClick={toggleIsNewServiceVisible}>
              <AddIcon />
              Add Service
            </NewService>
          </TopButtons>
        </PageHeader>
        <Content>
          <Filters
            search={{
              searchValue: search,
              placeholder: 'Search Products',
              setSearchValue: (evt) => {
                setSearch(evt.target.value);
                setOffset(0);
              },
              clear: () => setSearch(''),
            }}
            filters={[
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
              },
            ]}
          />
          {filteredServices.length ? (
            <TableWrapper>
              <Table>
                <THead>
                  <tr>
                    <CheckboxCell>
                      <Checkbox
                        type="checkbox"
                        checked={isAllChecked}
                        onChange={selectAllCheckboxes}
                        disabled={!allPossibleServiceChoose.length}
                      />
                    </CheckboxCell>
                    <th>PRODUCT CODE</th>
                    <th>SUPPLIER</th>
                    <th>PRODUCT</th>
                    <th>GROUP</th>
                    <th>SUBGROUP</th>
                    <th>DESCRIPTION</th>
                    <th>SERVICE DISCLAIMER</th>
                    <th>SEARCH RESULT DISCLAIMER</th>
                    <th>FULFILLMENT</th>
                    <th>STATUS</th>
                    <ActionsCell>ACTION</ActionsCell>
                  </tr>
                </THead>
                <TBody>
                  {servicesPagination.map((service, i) => {
                    const isOpenToTop = servicesPagination.length > 3 && servicesPagination.length - i < 4;

                    return (
                      <TRow
                        key={i}
                        isChecked={
                          !!selectedServices.find(
                            ({ productId }) => service.productId === productId,
                          )
                        }
                      >
                        <CheckboxCell>
                          <Checkbox
                            type="checkbox"
                            disabled={
                              isActiveMod !== undefined
                                ? isActiveMod !== service.status
                                : false
                            }
                            checked={
                              !!selectedServices.find(
                                ({ productId }) => service.productId === productId,
                              )
                            }
                            onChange={({ target }) => onCheckboxClick(target.checked, service)}
                          />
                        </CheckboxCell>
                        <th>{service.productId}</th>
                        <th>{service.supplier || '-'}</th>
                        <th>{service.searchType || '-'}</th>
                        <th>{service.group || '-'}</th>
                        <th>{service.subgroup || '-'}</th>
                        <TableThCell isOpenToTop={isOpenToTop}>
                          {service.description || '-'}
                        </TableThCell>
                        <TableThCell isOpenToTop={isOpenToTop}>
                          {service.serviceDisclaimer || '-'}
                        </TableThCell>
                        <TableThCell isOpenToTop={isOpenToTop}>
                          {service.searchResultDisclaimer || '-'}
                        </TableThCell>
                        <th>
                          <div>
                            {service.fulfilmentType || '-'}
                          </div>
                        </th>
                        <th>
                          <StatusCell isActive={service.status}>
                            {service.status
                              ? ServiceStatus.ACTIVE
                              : ServiceStatus.INACTIVE}
                          </StatusCell>
                        </th>
                        <ActionsCell onClick={(evt) => evt.stopPropagation()}>
                          <ActionWrapper
                            onClick={() => {
                              toggleIsNewServiceVisible(true);
                              setEditableService(service);
                            }}
                          >
                            <EditIcon />
                          </ActionWrapper>
                        </ActionsCell>
                      </TRow>
                    );
                  })}
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
        </Content>
        {selectedServices.length ? (
          <PopUp>
            <OrganisationsCount>
              <OrdersIcon color="#292D32" />
              {`${getNounByForm(selectedServices.length, 'Service')} selected`}
            </OrganisationsCount>
            <ButtonWrap>
              <Button
                onClick={handleChangeStatus}
                isRedButton={selectedServices[0].status}
                style={{ width: '140px' }}
              >
                {isLoading ? (
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
                isLoading,
                style: {
                  isRedButton: true,
                  style: { width: '90px', height: '48px', fontSize: '16px' },
                },
              }}
            />
          </Modal>
        )}
        {isNewServiceVisible && (
          <ServiceModalWindow
            close={() => {
              toggleIsNewServiceVisible(false);
              setEditableService(undefined);
            }}
            service={editableService}
          />
        )}
      </LoadingContainer>
    </PageContainer>
  );
};

const ButtonWrap = styled.div`
  margin-left: auto;
`;

const PopUp = styled.div`
  position: fixed;
  bottom: 100px;
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

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 0 32px 32px;
  border-bottom: 1px solid rgba(26, 28, 30, 0.16);

  p {
    color: rgba(17, 24, 39, 0.7);
  }
`;

const TopButtons = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 16px;
`;

const Content = styled.div`
  display: flex;
  flex-flow: column;
  flex: 1;
  justify-content: space-between;
  padding: 0 32px;
`;

const TableWrapper = styled.div`
  margin-bottom: 16px;
  flex: 1;
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
    min-height: 64px;
    height: 100%;
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

const CheckboxCell = styled.th`
  width: 18px;
`;

const ActionsCell = styled.th`
  width: 80px;
`;

const ActionWrapper = styled.div`
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
`;

const NewService = styled(Button)`
  grid-gap: 8px;
  height: 50px;
`;
export default Services;
