import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import AddIcon from '@/assets/icons/AddIcon';

import Button from '@/components/Button';
import Loader from '@/components/Loader';
import DeactivateModal from '@/components/Modal/DeactivateModal';
import Modal from '@/components/Modal/Modal';
import NoFound from '@/components/NoFound';
import PageTitle from '@/components/PageTitle';
import Pagination from '@/components/Pagination';
import AddPriceList from '@/components/PriceList/AddPriceList';
import Toggle from '@/components/PriceList/Toggle';
import Filters from '@/components/Table/Filters';

import { getBaseOrganisationsInfoAction } from '@/store/actions/organisationsActions';
import {
  getAllPriceListsAction,
  setDefaultPriceListAction,
} from '@/store/actions/priceListActions';

import { IOrganisation } from '@/store/reducers/organisations';
import { IPriceList } from '@/store/reducers/priceList';

import { selectBaseOrganisationsInfo } from '@/store/selectors/organisationsSelector';
import { selectPriceLists } from '@/store/selectors/priceListSelector';

import useInput from '@/hooks/useInput';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import useToggle from '@/hooks/useToggle';

import convertTimestamp from '@/utils/convertTimestamp';
import dropdownSelectHelper, {
  ID_FOR_DROPDOWN_SELECT,
} from '@/utils/dropdownSelectHelper';

import { AppDispatch } from '@/store';

const limits = [20, 50, 100];

const PriceLists = () => {
  const [isCreationModalVisible, toggleIsCreationModalVisible] = useToggle();
  const [priceListAsDefault, setPriceListAsDefault] = useState<IPriceList>();
  const [isLoading, toggleIsLoading] = useToggle();
  const [search, setSearch] = useInput();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [organisation, setOrganisation] = useState<IOrganisation | null>(null);
  const [
    organisationsRef,
    isOrganisationsVisible,
    toggleIsOrganisationsVisible,
  ] = useOnClickOutside<HTMLDivElement>();
  const [limit, setLimit] = useState(0);
  const [offset, setOffset] = useState(0);

  const priceLists = useSelector(selectPriceLists);
  const organisations = useSelector(selectBaseOrganisationsInfo);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllPriceListsAction());
    dispatch(getBaseOrganisationsInfoAction());
  }, []);

  const submitDates = (start?: Date, end?: Date) => {
    setStartDate(start);
    setEndDate(end);
    setOffset(0);
  };

  const setDefault = async (id: number) => {
    try {
      toggleIsLoading(true);
      await dispatch(setDefaultPriceListAction(id));
      toggleIsLoading(false);
      setPriceListAsDefault(undefined);
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } catch (e) {
      toggleIsLoading(false);
    }
  };

  const priceListsWithAppliedFilters = useMemo(
    () => priceLists
      ?.filter((item) => {
        if (!search) return true;

        const regexp = new RegExp(`.*${search.toLowerCase()}.*`);
        return regexp.test(item.priceListName.toLowerCase());
      })
      .filter((item) => (organisation
        ? (item.organisationsNames || []).includes(
          dropdownSelectHelper(organisation?.name || ''),
        )
        : true))
      .filter((item) => {
        if (!startDate || !endDate) return true;

        const effectiveFromDate = new Date(
          +item.effectiveFromDate.split('-')[0],
        );
        return effectiveFromDate >= startDate && effectiveFromDate <= endDate;
      }) || [],
    [search, startDate, endDate, organisation?.id, priceLists],
  );

  const maxPages = Math.ceil(
    priceListsWithAppliedFilters.length / limits[limit],
  );
  const calculatedOffset = maxPages > 1 ? offset : 0;
  const filteredPriceLists: IPriceList[] = [];

  if (maxPages >= 1) {
    for (
      let i = calculatedOffset * limits[limit];
      i < calculatedOffset * limits[limit] + limits[limit];
      i += 1
    ) {
      if (priceListsWithAppliedFilters[i]) {
        filteredPriceLists.push(priceListsWithAppliedFilters[i]);
      }
    }
  }

  const isFiltered = (startDate && endDate) || organisation?.id;

  const organisationsNames = useMemo(() => {
    if (organisations) {
      return organisations.map((org) => ({
        ...org,
        name: `${org.name}${ID_FOR_DROPDOWN_SELECT}${org.id}`,
      }));
    }
    return [];
  }, [organisations]);

  return (
    <>
      <PageHeader>
        <div>
          <PageTitle marginBottom="16px">Price Lists</PageTitle>
          <p>Manage Pricing in this page</p>
        </div>
        <NewPriceList onClick={toggleIsCreationModalVisible}>
          <AddIcon />
          Upload Price List
        </NewPriceList>
      </PageHeader>
      {priceLists ? (
        priceLists.length ? (
          <Content>
            <Filters
              search={{
                searchValue: search,
                setSearchValue: setSearch,
                placeholder: 'Enter Price List ID here',
                clear: () => setSearch(''),
              }}
              datepicker={{
                title: 'Effective From Date',
                startDate,
                endDate,
                setDates: submitDates,
              }}
              filters={[
                {
                  name: 'Organisations',
                  value: organisation?.name || '',
                  setValue: setOrganisation,
                  values: organisationsNames,
                  keyForValue: 'name',
                  isApplied: !!organisation,
                  ref: organisationsRef,
                  isUseSearch: true,
                  isSortValeus: true,
                  isDropdownVisible: isOrganisationsVisible,
                  toggleIsVisible: toggleIsOrganisationsVisible,
                },
              ]}
            />
            {filteredPriceLists.length ? (
              <TableWrapper>
                <Table>
                  <THead>
                    <tr>
                      <th>PRICE LIST ID</th>
                      <th>DESCRIPTION</th>
                      <th>ORGANISATIONS</th>
                      <th>EFFECTIVE FROM DATE</th>
                      <th>DEFAULT</th>
                    </tr>
                  </THead>
                  <TBody>
                    {filteredPriceLists.map((item) => {
                      const splitDate = item.effectiveFromDate.split('-');
                      const firstDate = +splitDate[0]
                        ? convertTimestamp(+splitDate[0])
                        : '-';
                      let secondDate = '';

                      if (splitDate[1]) {
                        secondDate = ` - ${convertTimestamp(+splitDate[1])}`;
                      }

                      return (
                        <TRow
                          key={item.id + item.priceListName}
                          onClick={() => navigate(`/price-lists/${item.id}`)}
                        >
                          <th>{item.priceListName}</th>
                          <th>{item.description}</th>
                          <TH>
                            {item.organisations}
                            {!!(item.organisationsNames || []).length && (
                              <PopUpWrap onClick={(e) => e.stopPropagation()}>
                                {item.organisationsNames.map((el) => (
                                  <Organisation key={el}>{el}</Organisation>
                                ))}
                              </PopUpWrap>
                            )}
                          </TH>
                          <th>{`${firstDate}${secondDate}`}</th>
                          <th>
                            <Toggle
                              isActive={item.isDefault}
                              click={(evt) => {
                                evt.stopPropagation();
                                setPriceListAsDefault(item);
                              }}
                            />
                          </th>
                        </TRow>
                      );
                    })}
                  </TBody>
                </Table>
              </TableWrapper>
            ) : (
              <NoFound />
            )}
            {!!filteredPriceLists.length && (
              <Pagination
                changePage={setOffset}
                currentPage={calculatedOffset}
                maxPages={maxPages}
                maxElements={
                  search || isFiltered
                    ? priceListsWithAppliedFilters.length
                    : priceLists.length
                }
                limits={limits}
                limit={limit}
                setLimit={setLimit}
              />
            )}
          </Content>
        ) : (
          'Not found'
        )
      ) : (
        <Loader />
      )}
      {isCreationModalVisible ? (
        <AddPriceList close={toggleIsCreationModalVisible} />
      ) : (
        ''
      )}
      {priceListAsDefault && (
        <Modal closeModal={() => setPriceListAsDefault(undefined)}>
          <DeactivateModal
            title={`Set "${priceListAsDefault.priceListName}" as the Default Price List?`}
            subTitle={`Are you sure you want to set "${priceListAsDefault.priceListName}" as the Default Price List?`}
            cancelButton={{
              onCancel: () => setPriceListAsDefault(undefined),
              name: 'Cancel',
              isLoading: false,
              style: {
                isCancel: true,
                style: { height: '48px', fontSize: '16px' },
              },
            }}
            confirmButton={{
              onConfirm: () => setDefault(priceListAsDefault!.id),
              name: 'Set as Default',
              isLoading,
              style: {
                isRedButton: false,
                style: { width: '160px', height: '48px', fontSize: '16px' },
              },
            }}
          />
        </Modal>
      )}
    </>
  );
};

const Organisation = styled.div`
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  min-height: 32px;
  line-height: 32px;
`;

const PopUpWrap = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  padding: 4px 12px;
  border-radius: 12px;
  display: none;
  flex-direction: column;
  width: 300px;
  max-height: 200px;
  overflow: auto;
  background-color: #f0f0f2;
  z-index: 2;
  cursor: initial;
`;

const TH = styled.th`
  position: relative;

  :hover {
    ${PopUpWrap} {
      display: flex;
    }
  }
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

const NewPriceList = styled(Button)`
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
      padding-left: 18px;
      border-top-left-radius: 4px;
    }

    :last-child {
      border-top-right-radius: 4px;
    }
  }
`;

const TBody = styled.tbody`
  th {
    height: 64px;
    background-color: #fff;
    font-size: 14px;
    font-weight: 500;
    text-align: left;
  }
`;

const TRow = styled.tr`
  cursor: pointer;

  th {
    padding-right: 25px;
    max-width: 300px;
    background-color: #fff;
    white-space: normal;

    :first-child {
      padding-left: 18px;
    }
  }

  :hover th {
    background-color: #f9f9f9;
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

export default PriceLists;
