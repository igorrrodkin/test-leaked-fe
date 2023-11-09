import React from 'react';
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';

import { Roles } from '@/store/reducers/user';

import { selectUser } from '@/store/selectors/userSelectors';

export interface ITableHeaderColumn {
  id: string;
  content: string | React.ReactNode;
  isForSystemAdmin?: boolean;
}

export interface ITableHeader {
  columns: ITableHeaderColumn[];
}

export interface ITableRowColumn {
  id: string;
  content: string | React.ReactNode;
  isForSystemAdmin?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export interface ITableRow {
  columns: ITableRowColumn[];
  isSelectedRow: boolean;
  id: string;
  onRowClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

interface Props {
  marginBottom?: string,
  header: ITableHeader,
  rows: ITableRow[],
}

const Table: React.FC<Props> = ({ marginBottom = '0', header, rows }) => {
  const user = useSelector(selectUser);

  return (
    <TableStyled marginBottom={marginBottom}>
      <TableWrap>
        <THead>
          <HeaderTR>
            {header.columns.map((column) => (column.isForSystemAdmin
              ? user!.role === Roles.SYSTEM_ADMIN && (
              <TH key={column.id}>{column.content}</TH>
              )
              : (
                <TH key={column.id}>{column.content}</TH>
              )))}
          </HeaderTR>
        </THead>
        <TBody>
          {rows.map(({
            columns, isSelectedRow, onRowClick, id,
          }) => (
            <BodyTR
              key={id}
              onClick={onRowClick}
              isClickable={!!onRowClick}
              isActive={isSelectedRow}
            >
              {columns.map((column) => (column.isForSystemAdmin
                ? user!.role === Roles.SYSTEM_ADMIN && (
                  <TD
                    key={column.id}
                    onClick={column.onClick}
                    isClickable={!!column.onClick}
                  >
                    {column.content}
                  </TD>
                )
                : (
                  <TD
                    key={column.id}
                    onClick={column.onClick}
                    isClickable={!!column.onClick}
                  >
                    {column.content}
                  </TD>
                )))}
            </BodyTR>
          ))}
        </TBody>
      </TableWrap>
    </TableStyled>
  );
};

const TH = styled.th`
  padding: 12px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(17, 24, 39, 0.5);
  text-transform: uppercase;
  text-align: left;
`;

const TD = styled.td<{ isClickable: boolean }>`
  height: 64px;
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  text-align: left;

  ${({ isClickable }) => isClickable
    && css`
      cursor: pointer;
      :hover {
        color: var(--primary-green-color);
      }
    `}
`;

export const BodyTR = styled.tr<{ isActive: boolean; isClickable: boolean }>`
  ${({ isClickable }) => isClickable
    && css`
      cursor: pointer;
    `}

  :hover {
    background-color: #f9f9f9;
  }
`;

const HeaderTR = styled.tr``;

const THead = styled.thead`
  background-color: #f9f9f9;
`;

const TBody = styled.tbody``;

const TableWrap = styled.table`
  display: table;
  width: 100%;
  border-spacing: 0;
  -webkit-border-horizontal-spacing: 0;
  -webkit-border-vertical-spacing: 0;

  * {
    white-space: nowrap;
  }
`;

const TableStyled = styled.div<{ marginBottom: string }>`
  overflow-x: auto;
  flex: 1;
`;

export default Table;
