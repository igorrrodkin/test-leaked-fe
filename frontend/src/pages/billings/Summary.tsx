import {
  FC, useEffect, useMemo, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '@/components/Loader';
import NoFound from '@/components/NoFound';
import Pagination from '@/components/Pagination';
import Filters from '@/components/Table/Filters';

import SummaryTable from '@/pages/billings/SummaryTable';
import { Content } from '@/pages/Notices';

import { userActions } from '@/store/actions/userActions';

import { IAllSummary } from '@/store/reducers/billing';
import { IOrganisation } from '@/store/reducers/organisations';
import { PopupTypes } from '@/store/reducers/user';

import { selectBaseOrganisationsInfo } from '@/store/selectors/organisationsSelector';
import { selectUser } from '@/store/selectors/userSelectors';

import useInput from '@/hooks/useInput';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import useToggle from '@/hooks/useToggle';

import { ID_FOR_DROPDOWN_SELECT } from '@/utils/dropdownSelectHelper';

import { api, AppDispatch } from '@/store';

const limits = [20, 50, 100];

const Summary: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector(selectUser);
  const organisations = useSelector(selectBaseOrganisationsInfo);

  const [search, setSearch] = useInput();

  const [limit, setLimit] = useState(0);
  const [type, setType] = useState(null);
  const [offset, setOffset] = useState(0);
  const [arrears, setArrears] = useState(null);
  const [suspended, setSuspended] = useState(null);
  const [summary, setSummary] = useState<IAllSummary[] | null>(null);
  const [orgItem, setOrgItem] = useState<IOrganisation | null>(null);
  const [currentBalance, setCurrentBalance] = useState<'Highest to lowest' | 'Lowest to highest' | null>(null);

  const [isDataLoading, toggleIsDataLoading] = useToggle(true);

  const [
    currentBalanceRef,
    isCurrentBalanceVisible,
    toggleIsCurrentBalanceVisible,
  ] = useOnClickOutside<HTMLDivElement>();
  const [orgRef, isOrgsVisible, toggleIsOrgsVisible] = useOnClickOutside<HTMLDivElement>();
  const [typeRef, isTypeVisible, toggleIsTypeVisible] = useOnClickOutside<HTMLDivElement>();
  const [arrearsRef, isArrearsVisible, toggleIsArrearsVisible] = useOnClickOutside<HTMLDivElement>();
  const [suspendedRef, isSuspendedVisible, toggleIsSuspendedVisible] = useOnClickOutside<HTMLDivElement>();

  const organisationsNames = useMemo(() => {
    if (organisations) {
      return organisations.map((org) => ({
        ...org,
        name: `${org.name}${ID_FOR_DROPDOWN_SELECT}${org.id}`,
      }));
    }
    return [];
  }, [organisations]);

  const summaryWithAppliedFilters = useMemo(
    () => summary
      ?.filter((item) => {
        if (!search) return true;

        const regexp = new RegExp(`.*${search.toLowerCase()}.*`);
        return regexp.test(item.name.toLowerCase());
      }).filter((item) => {
        if (!type) return true;

        return item.paymentType === type;
      }).filter((item) => {
        if (!suspended) return true;

        return String(item.osSuspended) === suspended;
      }).filter((item) => {
        if (!arrears) return true;

        return String(item.inArrears) === arrears;
      })
      .filter((org) => {
        if (!orgItem) return true;

        return org.id === orgItem.id;
      })
      .sort((a, b) => {
        if (currentBalance === 'Highest to lowest') {
          return b.currentBalance - a.currentBalance;
        }

        if (currentBalance === 'Lowest to highest') {
          return a.currentBalance - b.currentBalance;
        }

        return 0;
      }) || [],
    [search, summary, type, suspended, arrears, orgItem, currentBalance],
  );

  const maxPages = Math.ceil(summaryWithAppliedFilters.length / limits[limit]);
  const calculatedOffset = maxPages > 1 ? offset : 0;
  const filteredSummary: IAllSummary[] = [];

  if (maxPages >= 1) {
    for (
      let i = calculatedOffset * limits[limit];
      i < calculatedOffset * limits[limit] + limits[limit];
      i += 1
    ) {
      if (summaryWithAppliedFilters[i]) {
        filteredSummary.push(summaryWithAppliedFilters[i]);
      }
    }
  }

  useEffect(() => {
    const getData = async () => {
      if (user) {
        try {
          toggleIsDataLoading(true);
          const allSummary = await api.mainApiProtected.getAllSummary();
          setSummary(allSummary);
          toggleIsDataLoading(false);
        } catch (error: any) {
          console.error(error);
          const errorMessage = error.isAxiosError ? error.message : 'Something went wrong';
          dispatch(userActions.setPopup({
            mainText: 'Error',
            additionalText: errorMessage,
            type: PopupTypes.ERROR,
          }));

          toggleIsDataLoading(false);
        }
      }
    };

    getData();

    return () => {
      setSummary(null);
    };
  }, []);

  const isFiltered = !!type || !!suspended || !!arrears || !!orgItem || !!currentBalance;

  return (
    <>
      {!isDataLoading ? (
        <Content>
          <div style={{ marginBottom: '32px' }}>
            <Filters
              search={{
                searchValue: search,
                setSearchValue: setSearch,
                placeholder: 'Search Organisations',
                clear: () => setSearch(''),
              }}
              filters={[
                {
                  name: 'Current Balance',
                  value: currentBalance,
                  setValue: setCurrentBalance,
                  values: ['Highest to lowest', 'Lowest to highest'],
                  isApplied: !!currentBalance,
                  ref: currentBalanceRef,
                  isDropdownVisible: isCurrentBalanceVisible,
                  toggleIsVisible: toggleIsCurrentBalanceVisible,
                  containLargeValues: true,
                },
                {
                  name: 'Payment Type',
                  value: type,
                  setValue: setType,
                  values: ['Manual Payments', 'Automatic Payments'],
                  isApplied: !!type,
                  ref: typeRef,
                  isDropdownVisible: isTypeVisible,
                  toggleIsVisible: toggleIsTypeVisible,
                  containLargeValues: true,
                },
                {
                  name: 'Suspended',
                  value: suspended,
                  setValue: setSuspended,
                  values: ['true', 'false'],
                  isApplied: !!suspended,
                  ref: suspendedRef,
                  isDropdownVisible: isSuspendedVisible,
                  toggleIsVisible: toggleIsSuspendedVisible,
                },
                {
                  name: 'In Arrears',
                  value: arrears,
                  setValue: setArrears,
                  values: ['true', 'false'],
                  isApplied: !!arrears,
                  ref: arrearsRef,
                  isDropdownVisible: isArrearsVisible,
                  toggleIsVisible: toggleIsArrearsVisible,
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
            {filteredSummary.length ? (
              <SummaryTable summary={filteredSummary} />
            ) : (
              <NoFound />
            )}
          </div>
          {!!(summary && summary.length) && filteredSummary.length ? (
            <Pagination
              changePage={setOffset}
              currentPage={calculatedOffset}
              maxPages={maxPages}
              maxElements={
              search || isFiltered
                ? summaryWithAppliedFilters.length
                : summary.length
            }
              limits={limits}
              limit={limit}
              setLimit={setLimit}
            />
          ) : null}
        </Content>
      ) : <Loader />}
    </>
  );
};

export default Summary;
