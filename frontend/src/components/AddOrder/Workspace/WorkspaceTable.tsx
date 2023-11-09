import React, { FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Checkbox from '@/components/Checkbox';
import Table, { ITableHeader, ITableRow } from '@/components/Table/Table';

import { orderActions } from '@/store/actions/orderActions';

import { IFoundedItems, TFoundedItems } from '@/store/reducers/order';
import { FullfilmentType } from '@/store/reducers/services';

import {
  selectCurrentService,
  selectOrderManuallyProducts,
  selectOrderProducts,
} from '@/store/selectors/orderSelectors';

import useToggle from '@/hooks/useToggle';

import { ExistingRegions } from '@/utils/getRegionsData';
import workspaceTableStructure from '@/utils/workspaceTableStructure';

import { AppDispatch } from '@/store';

interface Props {
  currentRegion: ExistingRegions,
}

const WorkspaceTable: FC<Props> = ({ currentRegion }) => {
  const [isAllChecked, toggleIsAllChecked] = useToggle();

  const { productId, identifier } = useSelector(selectCurrentService)!;
  const orderProducts = useSelector(selectOrderProducts)!;
  const orderManualProducts = useSelector(selectOrderManuallyProducts);

  const dispatch = useDispatch<AppDispatch>();

  const headerColumns = workspaceTableStructure[currentRegion][0];
  const rowColumns = workspaceTableStructure[currentRegion][1];

  useEffect(() => {
    if (orderProducts) {
      const isEveryChecked = orderProducts.every((el) => el.isChosen);

      toggleIsAllChecked(isEveryChecked);
    }
  }, [orderProducts]);

  const selectAllHandler = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    if (orderProducts) {
      const updated = orderProducts.map((el) => ({
        ...el,
        isChosen: target.checked,
      }));

      dispatch(orderActions.setOrderProducts(updated));
    }
  };

  const setOrderProducts = ({ id, type, productId: prodId }: IFoundedItems) => {
    if (orderProducts) {
      dispatch(orderActions.setOrderProducts(orderProducts.map((el) => {
        if (el.id === id) {
          const newEl = { ...el };
          newEl.isChosen = !newEl.isChosen;
          return newEl;
        }

        return el;
      })));

      if (type === FullfilmentType.MANUAL) {
        const updated = orderManualProducts[prodId].map((el: IFoundedItems) => {
          if (el.id === id) {
            const newEl = { ...el };
            newEl.isChosen = !newEl.isChosen;
            return newEl;
          }

          return el;
        });

        dispatch(orderActions.setOrderManuallyProducts({
          ...orderManualProducts,
          [prodId]: updated,
        }));
      }
    }
  };

  const remove = (item: any) => {
    const filtered = orderProducts!.filter((el) => el.id !== item.id);
    dispatch(orderActions.setOrderProducts(filtered));

    if (item.type === FullfilmentType.MANUAL && identifier) {
      const filteredManual = orderManualProducts[productId].filter((el: TFoundedItems) => el!.id !== item.id);
      dispatch(orderActions.setOrderManuallyProducts({
        ...orderManualProducts,
        [productId]: filteredManual,
      }));
    }
  };

  const tableHeaders: ITableHeader = useMemo(() => ({
    columns: [
      {
        id: `Header_Column_Select_All ${Math.random()}`,
        styles: `
          width: 16px;
        `,
        content: (
          <Checkbox
            type="checkbox"
            checked={isAllChecked}
            onChange={selectAllHandler}
          />
        ),
      },
      ...headerColumns.map((el) => ({
        id: `Header_Column_${el}`,
        content: el,
      })),
      {
        id: `Header_Column_Action ${Math.random()}`,
        styles: `
          padding: 0 25px !important;
          width: 16px;
          cursor: pointer;
        `,
        content: '',
      },
    ],
  }), [isAllChecked]);

  const tableRows: ITableRow[] = useMemo(() => orderProducts.map((el) => ({
    id: el.id,
    isSelectedRow: el.isChosen,
    onRowClick: () => {
      setOrderProducts(el);
    },
    columns: [
      {
        id: `Row_Column_Checkbox_${el.id}`,
        styles: `
          width: 16px;
        `,
        content: (
          <Checkbox
            type="checkbox"
            checked={el.isChosen}
            onChange={() => setOrderProducts(el)}
          />
        ),
      },
      ...rowColumns.map((column) => ({
        id: `Row_Column_${el.id}_${column}`,
        content: el.render?.[column.trim()] || '',
      })),
      {
        id: `Row_Column_Action_${el.id}`,
        styles: `
          padding: 0 25px !important;
          width: 16px;
          cursor: pointer;
        `,
        onClick: (evt) => {
          evt.stopPropagation();
          remove(el);
        },
        content: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.5">
              <path fillRule="evenodd" clipRule="evenodd" d="M5.8575 1.5H12.1425C14.8725 1.5 16.5 3.1275 16.4925 5.8575V12.1425C16.4925 14.8725 14.865 16.5 12.135 16.5H5.8575C3.1275 16.5 1.5 14.8725 1.5 12.135V5.8575C1.5 3.1275 3.1275 1.5 5.8575 1.5ZM11.7842 12.5797L9 9.79544L6.21577 12.5797C5.99833 12.7971 5.63771 12.7971 5.42027 12.5797C5.20284 12.3622 5.20284 12.0016 5.42027 11.7842L8.2045 8.99994L5.42027 6.21571C5.20284 5.99827 5.20284 5.63765 5.42027 5.42021C5.63771 5.20278 5.99833 5.20278 6.21577 5.42021L9 8.20445L11.7842 5.42021C12.0017 5.20278 12.3623 5.20278 12.5797 5.42021C12.7972 5.63765 12.7972 5.99827 12.5797 6.21571L9.7955 8.99994L12.5797 11.7842C12.7972 12.0016 12.7972 12.3622 12.5797 12.5797C12.3623 12.7971 12.0017 12.7971 11.7842 12.5797Z" fill="#292D32" />
            </g>
          </svg>
        ),
      },
    ],
  })), [orderProducts]);

  return (
    <Table
      marginBottom="32px"
      header={tableHeaders}
      rows={tableRows}
    />
  );
};

export default WorkspaceTable;
