import React, {
  FC, useEffect, useMemo, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import WorkspaceMixRow from '@/components/AddOrder/Workspace/WorkspaceMixRow';
import Checkbox from '@/components/Checkbox';

import {
  Table, TableWrapper, TBody, THead,
} from '@/pages/Notices';

import { orderActions } from '@/store/actions/orderActions';

import { IFoundedItems, IVerifyResponse, TFoundedItems } from '@/store/reducers/order';
import { FullfilmentType } from '@/store/reducers/services';

import {
  selectCurrentService,
  selectMatter,
  selectOrderManuallyProducts,
  selectOrderProducts,
} from '@/store/selectors/orderSelectors';

import useToggle from '@/hooks/useToggle';

import { getIdentifier } from '@/utils/getIdentifier';
import { ExistingRegions } from '@/utils/getRegionsData';
import workspaceTableStructure from '@/utils/workspaceTableStructure';

import { api, AppDispatch } from '@/store';

interface Props {
  currentRegion: ExistingRegions;
}

function splitOnChunks<T>(array: Array<T>, chunkSize: number): Array<Array<T>> {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    chunks.push(chunk);
  }
  return chunks;
}

const WorkspaceMixTable: FC<Props> = ({ currentRegion }) => {
  const [isAllChecked, toggleIsAllChecked] = useToggle();

  const { productId, identifier } = useSelector(selectCurrentService)!;
  const orderProducts = useSelector(selectOrderProducts)!;
  const orderManualProducts = useSelector(selectOrderManuallyProducts);
  const currentService = useSelector(selectCurrentService);
  const matter = useSelector(selectMatter);

  const [verifyResponses, setVerifyResponses] = useState<IVerifyResponse[] | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  const headerColumns = workspaceTableStructure[currentRegion][0];

  const allPossibleChoose = useMemo(
    () => orderProducts.filter((el) => !el.isUnable && !el.isDisabled),
    [orderProducts],
  );

  useEffect(() => {
    if (allPossibleChoose.length) {
      const isEveryChecked = allPossibleChoose.every((el) => el.isChosen);

      toggleIsAllChecked(isEveryChecked);
    }
  }, [orderProducts]);

  const selectAllHandler = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    if (allPossibleChoose.length && verifyResponses?.length) {
      const updated = orderProducts.map((el, index) => ({
        ...el,
        isChosen:
          el.isUnable || verifyResponses?.[index]?.data.message === 'Invalid reference'
          || verifyResponses?.[index]?.data.message === 'Folio Cancelled'
          || (verifyResponses?.[index]?.data.message === "The verification service is unavailable and can't process your request" && !verifyResponses?.[index]?.data?.titles?.length)
            ? false
            : target.checked,
      }));

      dispatch(orderActions.setOrderProducts(updated));
    }
  };

  const setOrderProducts = (item: IFoundedItems) => {
    const founded = orderProducts.find((el) => el.id === item.id);

    if (founded) {
      const updated = {
        ...founded,
        isChosen: !founded.isChosen,
      };

      dispatch(orderActions.updateOrderProduct(updated));
    }
  };

  const setUnableForProduct = (id: string, value: boolean, isChosen?: boolean, isDisabled?: boolean) => {
    const founded = orderProducts.find((el) => el.id === id);

    if (founded) {
      const updated = {
        ...founded,
        isUnable: value,
        isVerified: !value,
        isDisabled,
      };

      if (typeof isChosen !== 'undefined') {
        updated.isChosen = isChosen;
      }

      dispatch(orderActions.updateOrderProduct(updated));
    }
  };

  const remove = (item: any, index: number) => {
    const filtered = orderProducts!.filter((el) => el.id !== item.id);
    dispatch(orderActions.setOrderProducts(filtered));

    if (verifyResponses && verifyResponses.length) {
      const arr = verifyResponses;
      arr.splice(index, 1);

      setVerifyResponses(arr);
    }

    if (item.type === FullfilmentType.MANUAL && identifier) {
      const filteredManual = orderManualProducts[productId].filter(
        (el: TFoundedItems) => el!.id !== item.id,
      );
      dispatch(
        orderActions.setOrderManuallyProducts({
          ...orderManualProducts,
          [productId]: filteredManual,
        }),
      );
    }
  };

  const chunked = useMemo(() => {
    const arr1 = orderProducts
      .filter((orderProduct) => !orderProduct.isVerified && !orderProduct.isOnVerify)
      .map(
        (orderProduct) => {
          if (orderProduct.isUnable) {
            return async function request() {
              const response = await api.mainApiProtected.verify({
                matter,
                region: currentRegion,
                identifier: getIdentifier(currentRegion),
                input: { matterReference: matter, ...orderProduct.inputs },
              });

              return response;
            };
          }
          return async function request() {
            const response = await new Promise<IVerifyResponse>((resolve) => {
              resolve({
                data: orderProduct,
                isError: false,
                path: '',
                status: 200,
                userNotification: '',
              });
            });

            return response;
          };
        },
      );

    const arr2 = orderProducts
      .map(
        (orderProduct) => ({
          ...orderProduct,
          isOnVerify: true,
        }),
      );

    return { arr1: splitOnChunks(arr1, 10), arr2 };
  }, [orderProducts]);

  useEffect(() => {
    const getData = async () => {
      try {
        dispatch(orderActions.setOrderProducts(chunked.arr2));
        dispatch(orderActions.setVerifyResponsesStatus(true));
        for (let i = 0; i < chunked.arr1.length; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          const data = await Promise.all(chunked.arr1[i].map((item) => item()));

          setVerifyResponses((prev) => {
            if (prev) {
              return [...prev, ...data];
            }

            return [...data];
          });
        }

        dispatch(orderActions.setVerifyResponsesStatus(false));
      } catch (e: any) {
        setVerifyResponses((prev) => {
          if (prev) {
            return [
              ...prev,
              {
                data: { message: e.message },
                isError: true,
                path: '',
                status: e.code,
                userNotification: e.message,
              },
            ];
          }

          return [
            {
              data: { message: e.message },
              isError: true,
              path: '',
              status: e.code,
              userNotification: e.message,
            },
          ];
        });

        if (e.code === 400 && e.message === 'Organisation is suspended') {
          dispatch(orderActions.setSearchError(`${e.message}`));
          dispatch(orderActions.setOrderProducts([]));
        }
        dispatch(orderActions.setVerifyResponsesStatus(false));
      }
    };

    if (chunked.arr1.length) {
      getData();
    }
  }, [chunked]);

  return (
    currentService && (
      <TableWrapper>
        <Table>
          <THead>
            <tr>
              <CheckboxCell>
                <Checkbox
                  type="checkbox"
                  checked={isAllChecked}
                  disabled={!allPossibleChoose.length}
                  onChange={selectAllHandler}
                />
              </CheckboxCell>
              {headerColumns.map((el: string, i: number) => (
                <th key={el + i}>{el.trim()}</th>
              ))}
              <th aria-label="Remove" />
            </tr>
          </THead>
          <TBody>
            {orderProducts.map((el, index) => (
              <WorkspaceMixRow
                key={el.id}
                index={index}
                verifyResponses={verifyResponses}
                elementId={el.id}
                render={el.render}
                isUnable={!!el.isUnable}
                dataForVerification={{
                  matter,
                  region: currentRegion,
                  identifier: getIdentifier(currentRegion),
                  input: el.inputs,
                }}
                region={currentRegion}
                isSelected={el.isChosen}
                isDisabled={el.isDisabled}
                selectRow={() => setOrderProducts(el)}
                setUnable={setUnableForProduct}
                remove={() => remove(el, index)}
              />
            ))}
          </TBody>
        </Table>
      </TableWrapper>
    )
  );
};

export const CheckboxCell = styled.th`
  width: 18px;
`;

export default WorkspaceMixTable;
