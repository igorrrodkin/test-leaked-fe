import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import NoFound from '@/components/NoFound';
import Pagination from '@/components/Pagination';
import Filters from '@/components/Table/Filters';

import { Product } from '@/store/reducers/user';

import useInput from '@/hooks/useInput';
import useOnClickOutside from '@/hooks/useOnClickOutside';

interface Props {
  priceList: Product[];
  setCsvFilteredPriceList: (key: Product[]) => void;
}

const limits = [20, 50, 100];

const PricesTable: React.FC<Props> = ({
  priceList,
  setCsvFilteredPriceList,
}) => {
  const [search, setSearch] = useInput();
  const [supplier, setSupplier] = useState(null);
  const [suppliersRef, isSuppliersVisible, toggleIsSuppliersVisible] = useOnClickOutside<HTMLDivElement>();
  const [limit, setLimit] = useState(0);
  const [offset, setOffset] = useState(0);

  const itemsWithAppliedFilters = useMemo(
    () => priceList
      .filter((item) => {
        if (!item.productCode) return false;
        if (!search) return true;

        let normalizedSearch;
        let regexp;

        try {
          normalizedSearch = search
            .toLowerCase()
            .replaceAll('(', '\\(')
            .replaceAll(')', '\\)');
          regexp = new RegExp(`^.*${normalizedSearch}.*$`);
        } catch (e) {
          return;
        }

        return regexp.test(item.productCode.toLowerCase()) || regexp.test(item.searchType.toLowerCase());
      })
      .filter((item) => {
        if (!supplier) return true;

        return item.supplier === supplier;
      })
      .sort((a, b) => a?.supplier.localeCompare(b?.supplier)),
    [search, supplier],
  );

  useEffect(() => {
    setCsvFilteredPriceList(itemsWithAppliedFilters);
  }, [itemsWithAppliedFilters]);

  const maxPages = Math.ceil(itemsWithAppliedFilters.length / limits[limit]);
  const calculatedOffset = maxPages > 1 ? offset : 0;
  const filteredItems: Product[] = [];

  if (maxPages >= 1) {
    const idk = calculatedOffset * limits[limit] + limits[limit];
    const pageLimit = idk > itemsWithAppliedFilters.length
      ? itemsWithAppliedFilters.length
      : idk;

    for (let i = calculatedOffset * limits[limit]; i < pageLimit; i += 1) {
      filteredItems.push(itemsWithAppliedFilters[i]);
    }
  }

  return (
    <>
      <Filters
        search={{
          searchValue: search,
          setSearchValue: (evt) => {
            setSearch(evt.target.value);
            setOffset(0);
          },
          placeholder: 'Search Product Code / Service',
          clear: () => setSearch(''),
        }}
        filters={[
          {
            name: 'Supplier',
            value: supplier,
            setValue: setSupplier,
            values: Array.from(
              new Set(
                priceList.reduce(
                  (acc, el) => [...acc, ...(el.supplier ? [el.supplier] : [])],
                  [] as string[],
                ),
              ),
            ),
            isApplied: !!supplier,
            ref: suppliersRef,
            isDropdownVisible: isSuppliersVisible,
            toggleIsVisible: toggleIsSuppliersVisible,
            containLargeValues: true,
          },
        ]}
      />
      {filteredItems.length > 0 ? (
        <TableWrapper>
          <Table>
            <THead>
              <tr>
                <th>Supplier</th>
                <th>Product Code</th>
                <th>Service</th>
                <th>TOTAL (ex. GST)</th>
                <th>GST</th>
                <th>TOTAL (inc. GST)</th>
              </tr>
            </THead>
            <TBody>
              {filteredItems.map((item) => (item.productCode ? (
                <TRow key={item.productCode}>
                  <th>{item.supplier}</th>
                  <th>{item.productCode}</th>
                  <th>{item.searchType}</th>
                  <th>
                    $
                    {(+item.priceExGST / 100).toFixed(2)}
                  </th>
                  <th>
                    $
                    {(+item.GST / 100).toFixed(2)}
                  </th>
                  <th>
                    $
                    {(+item.priceInclGST / 100).toFixed(2)}
                  </th>
                </TRow>
              ) : (
                ''
              )))}
            </TBody>
          </Table>
        </TableWrapper>
      ) : (
        <NoFound />
      )}
      <Pagination
        changePage={setOffset}
        currentPage={calculatedOffset}
        maxPages={maxPages}
        maxElements={
          search || supplier ? itemsWithAppliedFilters.length : priceList.length
        }
        limits={limits}
        limit={limit}
        setLimit={setLimit}
      />
    </>
  );
};

const TableWrapper = styled.div`
  margin-bottom: 16px;
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

export default PricesTable;
