import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import styled, { css } from 'styled-components';

import AddIcon from '@/assets/icons/AddIcon';
import CloseIcon from '@/assets/icons/CloseIcon';
import UsersIcon from '@/assets/icons/UsersIcon';

import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import Loader from '@/components/Loader';
import NoFound from '@/components/NoFound';
import AssignPriceList from '@/components/Organisations/AssignPriceList';
import CreateOrganisation from '@/components/Organisations/CreateOrganisation';
import PageContainer from '@/components/PageContainer';
import PageTitle from '@/components/PageTitle';
import Pagination from '@/components/Pagination';
import Filters from '@/components/Table/Filters';

import { editOrganisationsAction, getOrganisationsAction } from '@/store/actions/organisationsActions';
import { userActions } from '@/store/actions/userActions';

import { EOrganisationStatus, IOrganisation } from '@/store/reducers/organisations';
import { PopupTypes } from '@/store/reducers/user';

import { selectOrganisations } from '@/store/selectors/organisationsSelector';

import useInput from '@/hooks/useInput';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import useToggle from '@/hooks/useToggle';

import convertTimestamp from '@/utils/convertTimestamp';
import { ID_FOR_DROPDOWN_SELECT } from '@/utils/dropdownSelectHelper';
import getNounByForm from '@/utils/getNounByForm';

const limits = [20, 50, 100];

const Organisations = () => {
  const [search, setSearch] = useInput();
  const [priceList, setPriceList] = useState<string | null>(null);
  const [priceListRef, isPriceListsVisible, toggleIsPriceListsVisible] = useOnClickOutside<HTMLDivElement>();
  const [status, setStatus] = useState<EOrganisationStatus | null>(null);
  const [statusRef, isStatusesVisible, toggleIsStatusesVisible] = useOnClickOutside<HTMLDivElement>();
  const [orgItem, setOrgItem] = useState<IOrganisation | null>(null);
  const [orgRef, isOrgsVisible, toggleIsOrgsVisible] = useOnClickOutside<HTMLDivElement>();
  const [selectedOrganisations, setSelectedOrganisations] = useState<
  IOrganisation[]
  >([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(0);
  const [isNewOrgVisible, toggleIsNewOrgVisible] = useToggle();
  const [isAssignPriceListVisible, toggleIsAssignPriceListVisible] = useToggle();
  const [isChangingStatus, toggleIsChangingStatus] = useToggle();

  const organisations = useSelector(selectOrganisations);

  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  useEffect(() => {
    if (!organisations || !organisations.length) {
      dispatch(getOrganisationsAction());
    }
  }, []);

  useEffect(() => {
    setOffset(0);
  }, [search, priceList, status, orgItem?.id, limit]);

  const onCheckboxClick = (isChecked: boolean, org: IOrganisation) => {
    setSelectedOrganisations((prevState) => {
      if (!isChecked) return prevState.filter((el) => el.id !== org.id);
      return [...prevState, org];
    });
  };

  const changeStatus = async () => {
    try {
      toggleIsChangingStatus(true);

      const orgIds = selectedOrganisations.map(({ id }) => id);
      const { orgStatus } = selectedOrganisations[0];
      const newStatus = orgStatus === EOrganisationStatus.INACTIVE || orgStatus === EOrganisationStatus.PENDING_REVIEW
        ? EOrganisationStatus.ACTIVE
        : EOrganisationStatus.INACTIVE;

      await dispatch(editOrganisationsAction({
        status: newStatus,
        orgIds,
      }));

      dispatch(userActions.setPopup({
        type: PopupTypes.SUCCESS,
        mainText: 'Status changed',
        additionalText: 'Status have been updated',
      }));

      clearAllSelectedOrganisation();
      toggleIsChangingStatus(false);
    } catch (e: any) {
      const errorMessage = e.isAxiosError ? e.message : 'Something went wrong';

      dispatch(userActions.setPopup({
        mainText: 'Error',
        additionalText: errorMessage,
        type: PopupTypes.ERROR,
      }));
      toggleIsChangingStatus(false);
    }
  };

  const priceLists: string[] = [];

  organisations?.forEach((org) => {
    const isPriceListAdded = priceLists.find(
      (el) => el === org.currentPriceList.name,
    );
    if (!isPriceListAdded) priceLists.push(org.currentPriceList.name);
    const isFuturePriceListAdded = priceLists.find(
      (el) => el === org.futurePriceList?.name,
    );
    if (org.futurePriceList && !isFuturePriceListAdded) priceLists.push(org.futurePriceList.name);
  });

  const organisationsNames = useMemo(() => {
    if (organisations) {
      return organisations.map((org) => ({
        ...org,
        name: `${org.name}${ID_FOR_DROPDOWN_SELECT}${org.id}`,
      }));
    }
    return [];
  }, [organisations]);

  const organisationsWithAppliedFilters = useMemo(() => {
    if (organisations) {
      return organisations
        .filter((org) => {
          if (!search) return true;

          const regexp = new RegExp(`.*${search.toLowerCase()}.*`);
          return regexp.test(org.name.toLowerCase());
        })
        .filter((org) => {
          if (!priceList) return true;

          return (
            org.currentPriceList.name === priceList
            || org.futurePriceList?.name === priceList
          );
        })
        .filter((org) => {
          if (status === null) return true;
          return status.toLowerCase() === org.orgStatus.toLowerCase();
        })
        .filter((org) => {
          if (!orgItem) return true;
          return org.id === orgItem.id;
        });
    }

    return [];
  }, [organisations, search, priceList, status, orgItem?.id]);

  const maxPages = useMemo(
    () => Math.ceil(organisationsWithAppliedFilters.length / limits[limit]),
    [organisationsWithAppliedFilters, limit],
  );

  const calculatedOffset = useMemo(
    () => (maxPages > 1 ? offset : 0),
    [maxPages, offset],
  );

  const filteredOrganisations: IOrganisation[] = useMemo(
    () => organisationsWithAppliedFilters.slice(
      offset * limits[limit],
      (offset + 1) * limits[limit],
    ),
    [offset, limit, organisationsWithAppliedFilters],
  );

  const allPossibleOrganisationChoose = useMemo(
    () => filteredOrganisations.filter((organisation) => {
      const atLeastOneActive = filteredOrganisations
        .find((el) => el.orgStatus === EOrganisationStatus.ACTIVE);

      if (atLeastOneActive && organisation.orgStatus === EOrganisationStatus.ACTIVE) return true;

      return organisation.orgStatus === EOrganisationStatus.PENDING_REVIEW
        || organisation.orgStatus === EOrganisationStatus.INACTIVE;
    }),
    [filteredOrganisations, selectedOrganisations],
  );

  const isActiveMod = useMemo(
    () => selectedOrganisations[0]?.orgStatus
      && selectedOrganisations[0]?.orgStatus === EOrganisationStatus.ACTIVE,
    [selectedOrganisations],
  );

  const isAllChecked = useMemo(
    () => allPossibleOrganisationChoose.every((org) => (
      selectedOrganisations.some((selectedOrg) => org.id === selectedOrg.id)
    )),
    [allPossibleOrganisationChoose, selectedOrganisations],
  );

  const selectAllCheckboxes = () => {
    if (isAllChecked) {
      const removedSelectedOrganisations = selectedOrganisations.filter(
        ({ id }) => !allPossibleOrganisationChoose.some((org) => id === org.id),
      );
      setSelectedOrganisations(removedSelectedOrganisations);
      return;
    }

    const allSelectedOrg = allPossibleOrganisationChoose.reduce((acc, org) => {
      if (acc.some(({ id }) => org.id === id)) {
        return acc;
      }

      return [...acc, org];
    }, selectedOrganisations);

    setSelectedOrganisations(allSelectedOrg);
  };

  const clearAllSelectedOrganisation = () => {
    setSelectedOrganisations([]);
  };

  const closePriceListModal = () => {
    clearAllSelectedOrganisation();
    toggleIsAssignPriceListVisible(false);
  };

  return (
    <PageContainer contentPadding="32px 0">
      <PageHeader>
        <div>
          <PageTitle marginBottom="16px">Organisations</PageTitle>
          <p>Manage Organisations in this page</p>
        </div>
        <NewOrganisation onClick={toggleIsNewOrgVisible}>
          <AddIcon />
          New Organisation
        </NewOrganisation>
      </PageHeader>
      <Content>
        <div>
          <Filters
            search={{
              searchValue: search,
              setSearchValue: setSearch,
              placeholder: 'Search organisations',
              clear: () => setSearch(''),
            }}
            filters={[
              {
                name: 'Price List',
                value: priceList,
                setValue: setPriceList,
                values: priceLists,
                isApplied: !!priceList,
                ref: priceListRef,
                isDropdownVisible: isPriceListsVisible,
                toggleIsVisible: toggleIsPriceListsVisible,
                containLargeValues: true,
              },
              {
                name: 'Status',
                value: status,
                setValue: setStatus,
                values: ['ACTIVE', 'INACTIVE', 'PENDING REVIEW'],
                isApplied: status !== null,
                ref: statusRef,
                isDropdownVisible: isStatusesVisible,
                toggleIsVisible: toggleIsStatusesVisible,
                containLargeValues: true,
              },
              {
                name: 'Organisation',
                value: orgItem?.name || '',
                setValue: setOrgItem,
                values: organisationsNames,
                keyForValue: 'name',
                isApplied: !!orgItem,
                ref: orgRef,
                isDropdownVisible: isOrgsVisible,
                toggleIsVisible: toggleIsOrgsVisible,
                containLargeValues: true,
                isUseSearch: true,
                isSortValeus: true,
              },
            ]}
          />
          {!!organisations?.length && filteredOrganisations ? (
            filteredOrganisations.length ? (
              <TableWrapper>
                <Table>
                  <THead>
                    <tr>
                      <th>
                        <Checkbox
                          type="checkbox"
                          checked={isAllChecked}
                          onChange={selectAllCheckboxes}
                          disabled={!allPossibleOrganisationChoose.length}
                        />
                      </th>
                      <th>ORGANISATION</th>
                      <th>LAST ORDER</th>
                      <th>STATUS</th>
                      <th>PRICE LIST</th>
                      <th>NEW PRICE LIST</th>
                      <th>EFFECTIVE FROM DATE</th>
                      <th>PAYMENT TYPE</th>
                    </tr>
                  </THead>
                  <TBody>
                    {filteredOrganisations.map((org, i) => (
                      <TRow
                        key={org.name + i}
                        isChecked={
                          !!selectedOrganisations.find((el) => el.id === org.id)
                        }
                        onClick={() => navigate(
                          `/organisations/${org.id}/settings/organisation-details`,
                        )}
                      >
                        <th>
                          <Checkbox
                            type="checkbox"
                            disabled={
                              isActiveMod !== undefined
                                ? (isActiveMod && org.orgStatus !== EOrganisationStatus.ACTIVE)
                                  || (!isActiveMod && org.orgStatus === EOrganisationStatus.ACTIVE)
                                : false
                            }
                            checked={
                              !!selectedOrganisations.find(
                                (el) => el.id === org.id,
                              )
                            }
                            onChange={({ target }) => onCheckboxClick(target.checked, org)}
                          />
                        </th>
                        <th>{org.name}</th>
                        <th>
                          {org.lastOrderDate
                            ? convertTimestamp(+org.lastOrderDate)
                            : '-'}
                        </th>
                        <th>
                          <StatusCell status={org.orgStatus}>
                            {org.orgStatus.toUpperCase()}
                          </StatusCell>
                        </th>
                        <th>{org.currentPriceList.name}</th>
                        <th>{org.futurePriceList?.name}</th>
                        <th>
                          {org.futurePriceList
                            ? moment(+org.futurePriceList.effectiveFromDate).utcOffset(10).format('DD/MM/YYYY')
                            : '-'}
                        </th>
                        <th>{org.paymentType}</th>
                      </TRow>
                    ))}
                  </TBody>
                </Table>
              </TableWrapper>
            ) : (
              <NoFound />
            )
          ) : (
            <NotFound>
              <Loader />
            </NotFound>
          )}
        </div>
        {!!filteredOrganisations.length && (
          <Pagination
            changePage={setOffset}
            currentPage={calculatedOffset}
            maxPages={maxPages}
            maxElements={organisationsWithAppliedFilters.length}
            limits={limits}
            limit={limit}
            setLimit={setLimit}
          />
        )}
      </Content>
      {!!selectedOrganisations.length && (
        <PopUp>
          <OrganisationsCount>
            <UsersIcon />
            {`${getNounByForm(
              selectedOrganisations.length,
              'Organisation',
            )} selected`}
          </OrganisationsCount>
          <Actions>
            <li>
              <Button onClick={changeStatus} isRedButton={isActiveMod}>
                {!isChangingStatus ? (
                  isActiveMod ? (
                    'Deactivate'
                  ) : (
                    'Activate'
                  )
                ) : (
                  <Loader size={24} thickness={2} color="#fff" />
                )}
              </Button>
            </li>
            <li>
              <Button onClick={toggleIsAssignPriceListVisible}>
                Assign Price List
              </Button>
            </li>
            <StyledCloseIcon handler={clearAllSelectedOrganisation} />
          </Actions>
        </PopUp>
      )}
      {isNewOrgVisible && <CreateOrganisation close={toggleIsNewOrgVisible} />}
      {isAssignPriceListVisible && (
        <AssignPriceList
          orgIds={selectedOrganisations.map(({ id }) => id)}
          close={closePriceListModal}
        />
      )}
    </PageContainer>
  );
};

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

const NewOrganisation = styled(Button)`
  grid-gap: 8px;
  height: 50px;
`;

const Content = styled.div`
  display: flex;
  flex-flow: column;
  flex: 1;
  justify-content: space-between;
  padding: 0 32px;
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

const StatusCell = styled.span<{ status: EOrganisationStatus }>`
  display: block;
  padding: 4px 6px;
  width: fit-content;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  
  ${({ status }) => {
    if (status === EOrganisationStatus.ACTIVE) {
      return css`
        background-color: var(--primary-green-background-color);
        color: var(--primary-green-color);
      `;
    }

    if (status === EOrganisationStatus.INACTIVE) {
      return css`
        background-color: var(--primary-red-background-color);
        color: var(--primary-red-color);
      `;
    }

    if (status === EOrganisationStatus.PENDING_REVIEW) {
      return css`
        background-color: var(--primary-warning-background-color);
        color: var(--primary-warning-color);
      `;
    }
  }}
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

const NotFound = styled.div`
  text-align: center;
  padding-top: 206px;
  font-size: 18px;
  font-weight: 500;
`;

export default Organisations;
