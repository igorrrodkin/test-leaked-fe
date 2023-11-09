import React, { FC, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import { CheckboxCell } from '@/components/AddOrder/Workspace/WorkspaceVerificationTable';
import Checkbox from '@/components/Checkbox';
import Loader from '@/components/Loader';
import { BodyTR } from '@/components/Table/Table';

import { IVerify, IVerifyResponse } from '@/store/reducers/order';

import useToggle from '@/hooks/useToggle';

import { ExistingRegions } from '@/utils/getRegionsData';
import mapTitlesByService from '@/utils/mapTitlesByService';
import workspaceTableStructure from '@/utils/workspaceTableStructure';

type RenderType = { [p in string]: string | boolean };

enum ErrorTypes {
  WARNING = 'warning',
  ERROR = 'error',
}

interface Props {
  index: number;
  verifyResponses: IVerifyResponse[] | null;
  elementId: string;
  render: RenderType;
  isUnable: boolean;
  dataForVerification: IVerify;
  region: ExistingRegions;
  isSelected: boolean;
  isDisabled: boolean | undefined;
  selectRow: () => void;
  setUnable: (id: string, value: boolean, isChosen?: boolean, isDisabled?: boolean) => void;
  remove: () => void;
}

const errorsList = {
  WA: ['An incorrectly formatted Title Reference is entered.', 'Invalid Product Attribute'],
  NSW: [],
  QLD: [],
  ALL: [],
  VIC: [],
  TAS: [],
  ACT: [],
  NT: [],
};

const WorkspaceMixRow: FC<Props> = ({
  index,
  verifyResponses,
  elementId,
  render,
  isUnable,
  dataForVerification,
  region,
  isSelected,
  isDisabled,
  selectRow,
  setUnable,
  remove,
}) => {
  const [isLoading, toggleIsLoading] = useToggle(isUnable);
  const [toRender, setToRender] = useState<RenderType>(render);

  const rowColumns = workspaceTableStructure[region][1];

  useEffect(() => {
    if (verifyResponses && verifyResponses[index] && !isLoading) {
      setUnable(elementId, false, isSelected, isDisabled);
    }

    if (verifyResponses && verifyResponses[index] && isLoading) {
      const isInfo = rowColumns.includes('information');

      try {
        const result = verifyResponses[index];

        if (result.userNotification) {
          const { message } = result.data;

          const errorType = errorsList[region].includes(message)
            ? ErrorTypes.ERROR
            : ErrorTypes.WARNING;

          setToRender((prevState) => ({
            ...prevState,
            isChosen: false,
            errorType,
            ...(isInfo ? { information: message } : { error: message }),
          }));

          if (errorType !== ErrorTypes.ERROR) {
            setUnable(elementId, false, false, true);
          }
        } else {
          const mappedResults = mapTitlesByService(
            {
              region,
              meta: result,
            },
            '0',
            dataForVerification.identifier,
            '',
          )[0];

          setToRender((prevState) => ({
            ...prevState,
            ...mappedResults.render,
          }));

          setUnable(elementId, false, true, false);
        }

        toggleIsLoading(false);
      } catch (e: any) {
        toggleIsLoading(false);
        setUnable(elementId, false, false, true);

        setToRender((prevState) => ({
          ...prevState,
          isChosen: false,
          errorType: ErrorTypes.WARNING,
          ...(isInfo ? { information: e.message } : { error: e.message }),
        }));
      }
    }
  }, [verifyResponses]);

  return (
    <TR
      isClickable={!isLoading && !!selectRow && toRender.errorType !== ErrorTypes.ERROR}
      isActive={isSelected}
      onClick={
        toRender.errorType === ErrorTypes.ERROR
        || (toRender.errorType === ErrorTypes.WARNING && toRender.error === 'Invalid reference')
        || (toRender.errorType === ErrorTypes.WARNING && toRender.information === 'Folio Cancelled')
        || (toRender.errorType === ErrorTypes.WARNING && toRender.error === 'Verification failed')
        || (toRender.errorType === ErrorTypes.WARNING && toRender.error === "The verification service is unavailable and can't process your request")
          ? undefined
          : selectRow
      }
    >
      <CheckboxCell>
        {isLoading ? (
          <Loader size={18} thickness={2} />
        ) : (
          <Checkbox
            type="checkbox"
            checked={isSelected}
            disabled={
              toRender.errorType === ErrorTypes.ERROR
              || (toRender.errorType === ErrorTypes.WARNING && toRender.error === 'Invalid reference')
              || (toRender.errorType === ErrorTypes.WARNING && toRender.information === 'Folio Cancelled')
              || (toRender.errorType === ErrorTypes.WARNING && toRender.error === 'Verification failed')
              || (toRender.errorType === ErrorTypes.WARNING && toRender.error === "The verification service is unavailable and can't process your request")
            }
            onChange={toRender.errorType === ErrorTypes.ERROR ? undefined : selectRow}
          />
        )}
      </CheckboxCell>
      {!toRender.error ? (
        rowColumns.map((el) => {
          const key = el + Math.random();

          if (toRender[el.trim()]) {
            return (
              <Cell
                key={key}
                errorType={el === 'information' ? (toRender.errorType as ErrorTypes) : undefined}
              >
                {toRender[el.trim()]}
              </Cell>
            );
          }

          return <th key={key} aria-label="Empty" />;
        })
      ) : (
        <>
          <th>{toRender[rowColumns[0]]}</th>
          <Cell colSpan={rowColumns.length - 1} errorType={toRender.errorType as ErrorTypes}>
            {toRender.error}
          </Cell>
        </>
      )}
      <ActionCell
        onClick={(evt) => {
          evt.stopPropagation();
          remove();
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.5">
            <path fillRule="evenodd" clipRule="evenodd" d="M5.8575 1.5H12.1425C14.8725 1.5 16.5 3.1275 16.4925 5.8575V12.1425C16.4925 14.8725 14.865 16.5 12.135 16.5H5.8575C3.1275 16.5 1.5 14.8725 1.5 12.135V5.8575C1.5 3.1275 3.1275 1.5 5.8575 1.5ZM11.7842 12.5797L9 9.79544L6.21577 12.5797C5.99833 12.7971 5.63771 12.7971 5.42027 12.5797C5.20284 12.3622 5.20284 12.0016 5.42027 11.7842L8.2045 8.99994L5.42027 6.21571C5.20284 5.99827 5.20284 5.63765 5.42027 5.42021C5.63771 5.20278 5.99833 5.20278 6.21577 5.42021L9 8.20445L11.7842 5.42021C12.0017 5.20278 12.3623 5.20278 12.5797 5.42021C12.7972 5.63765 12.7972 5.99827 12.5797 6.21571L9.7955 8.99994L12.5797 11.7842C12.7972 12.0016 12.7972 12.3622 12.5797 12.5797C12.3623 12.7971 12.0017 12.7971 11.7842 12.5797Z" fill="#292D32" />
          </g>
        </svg>
      </ActionCell>
    </TR>
  );
};

const TR = styled(BodyTR)`
  th {
    padding: 12px 35px 12px 0;
    
    :first-child {
      padding: 12px 35px 12px 18px;
    }
  }

  :hover th {
    background-color: #f9f9f9;
  }
`;

const Cell = styled.th<{ errorType?: ErrorTypes }>`
  ${({ errorType }) => {
    if (!errorType) {
      return css`
        color: inherit;
      `;
    }

    if (errorType === ErrorTypes.WARNING) {
      return css`
        color: var(--primary-warning-color);
      `;
    }

    return css`
      color: var(--primary-red-color);
    `;
  }}
`;

const ActionCell = styled.th`
  padding: 12px 24px 12px 0;
  width: 18px;

  svg {
    cursor: pointer;
  }
`;

export default WorkspaceMixRow;
