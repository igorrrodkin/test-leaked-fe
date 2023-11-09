import React from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import PDFMerger from 'pdf-merger-js/browser';
import styled from 'styled-components';

import DownloadIcon from '@/assets/icons/DownloadIcon';
import EmailIcon from '@/assets/icons/EmailIcon';
import FilesCountIcon from '@/assets/icons/FilesCountIcon';
import PrintIcon from '@/assets/icons/PrintIcon';

import Loader from '@/components/Loader';

import {
  downloadDocuments, sendAllDocumentsToEmailAction,
} from '@/store/actions/orderActions';

import { IGetPreSignedGetURL } from '@/store/reducers/order';
import {
  IDownloadDocumentsItem,
  ISendAllToEmailBody,
  ISendToEmailBody,
  Order,
} from '@/store/reducers/user';

import useToggle from '@/hooks/useToggle';

import getNounByForm from '@/utils/getNounByForm';
import printPdf from '@/utils/printPdf';

import { mainApiProtected } from '@/api';
import { AppDispatch } from '@/store';

interface Props {
  selectedOrders: Order[];
  close: () => void;
}

const SelectedOrdersPopUp: React.FC<Props> = ({ selectedOrders, close }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isPrintLoading, toggleIsPrintLoading] = useToggle();
  const [isDownloadLoading, toggleIsDownloadLoading] = useToggle();
  const [isSendLoading, toggleIsSendLoading] = useToggle();

  const print = async () => {
    try {
      toggleIsPrintLoading(true);

      const urls: IGetPreSignedGetURL[] = [];

      selectedOrders.forEach((el) => {
        const foundedOrder = selectedOrders?.find((order) => order.id === el.id);

        if (foundedOrder && foundedOrder.orderItems[0].fileKeys?.length) {
          foundedOrder.orderItems[0].fileKeys.forEach((link) => {
            urls.push({
              orderId: foundedOrder.id,
              links: [link.s3Key],
            });
          });
        }
      });

      const preSignedUrls = await mainApiProtected.getPreSignedGet(urls);

      const values = await Promise.all(preSignedUrls.flatMap((url) => (
        url.links.map((el: string) => axios.get(el, { responseType: 'blob' }))
      )));

      const merger = new PDFMerger();

      for (let i = 0; i < values.length; i += 1) {
        await merger.add(
          new Blob([values[i].data], { type: 'application/pdf' }),
        );
      }

      const mergedPdf = await merger.saveAsBlob();
      printPdf(mergedPdf);
      toggleIsPrintLoading(false);
    } catch (e: any) {
      toggleIsPrintLoading(false);
    }
  };

  const download = async () => {
    try {
      toggleIsDownloadLoading(true);

      const selected = selectedOrders.reduce((acc, el) => {
        if (el && el.orderItems[0].fileKeys) {
          const { fileKeys } = el.orderItems[0];

          acc.push({
            orderId: el.id,
            fileKeys,
          });
        }

        return acc;
      }, [] as IDownloadDocumentsItem[]);

      await dispatch(downloadDocuments(selected));

      toggleIsDownloadLoading(false);
    } catch (e: any) {
      toggleIsDownloadLoading(false);
    }
  };

  const sendToEmail = async () => {
    try {
      const selected = selectedOrders.map((el) => {
        const body: ISendAllToEmailBody = {
          orderId: el.id,
          ...(process.env.STAGE === 'dev' ? { baseUrl: window.location.origin } : {}),
        };
        return body;
      });

      if (selected.length) {
        toggleIsSendLoading(true);

        const documentsAmount = selectedOrders.reduce((acc, value) => (
          acc + value.orderItems[0].fileKeys!.length
        ), 0);

        await dispatch(
          sendAllDocumentsToEmailAction(selected as ISendToEmailBody[], documentsAmount),
        );

        toggleIsSendLoading(false);
      }
    } catch (e) {
      toggleIsSendLoading(false);
    }
  };

  return (
    <PopUp>
      <FilesCount>
        <FilesCountIcon />
        {`${getNounByForm(selectedOrders.length, 'File')} selected`}
      </FilesCount>
      <Actions>
        <li onClick={print} style={{ width: '88px', height: '34px' }}>
          {!isPrintLoading ? (
            <>
              <PrintIcon />
              Print
            </>
          ) : (
            <Loader
              size={20}
              thickness={2}
              color="var(--primary-green-color)"
            />
          )}
        </li>
        <EmailListItem onClick={sendToEmail}>
          {!isSendLoading ? (
            <>
              <EmailIcon />
              Email
            </>
          ) : (
            <Loader
              size={20}
              thickness={2}
              color="var(--primary-green-color)"
            />
          )}
        </EmailListItem>
        <li onClick={download} style={{ width: '122px', height: '34px' }}>
          {!isDownloadLoading ? (
            <>
              <DownloadIcon />
              Download
            </>
          ) : (
            <Loader
              size={20}
              thickness={2}
              color="var(--primary-green-color)"
            />
          )}
        </li>
        <CloseIcon
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={close}
        >
          <path
            d="M5.00098 5L19 18.9991"
            stroke="#292D32"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.99996 18.9991L18.999 5"
            stroke="#292D32"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </CloseIcon>
      </Actions>
    </PopUp>
  );
};

const PopUp = styled.div`
  position: fixed;
  bottom: 100px;
  left: calc(50% + 256px / 2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 38px 88px 38px 32px;
  max-width: 822px;
  width: 100%;
  z-index: 1;
  transform: translateX(-50%);
  background-color: #fff;
  box-shadow: 0 12px 80px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const FilesCount = styled.p`
  display: flex;
  align-items: center;
  grid-gap: 13px;
`;

const Actions = styled.ul`
  display: flex;
  align-items: center;
  grid-gap: 16px;

  li {
    display: flex;
    align-items: center;
    grid-gap: 13px;
    padding: 8px 12px;
    border-radius: 4px;
    height: 35px;
    font-size: 14px;
    font-weight: 500;
    background: #f8f9fb;
    cursor: pointer;

    :hover {
      background: #eaeaeb;
    }
  }
`;

const EmailListItem = styled.li`
  width: 91px;
`;

const CloseIcon = styled.svg`
  position: absolute;
  top: 50%;
  right: 32px;
  transform: translateY(-50%);
  cursor: pointer;
`;

export default SelectedOrdersPopUp;
