import React, {
  FC, useEffect, useRef, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import styled, { css } from 'styled-components';

import { Content } from '@/pages/Notices';

import { userActions } from '@/store/actions/userActions';

import { PopupTypes } from '@/store/reducers/user';

import { selectInvoiceDetails } from '@/store/selectors/billingSelectors';

import { AppDispatch } from '@/store';

import NoFound from '../NoFound';

export const InvoiceDetailsPDF:FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const invoiceDetails = useSelector(selectInvoiceDetails);

  const ref = useRef<HTMLIFrameElement>(null);

  const [selectedDocument, setSelectedDocument] = useState<string | null>();

  useEffect(() => {
    const getPdf = async (presignedUrlValue: string) => {
      axios.get(presignedUrlValue, { responseType: 'blob' })
        .then((response) => {
          const blob = new Blob([response.data], { type: 'application/pdf' });
          const blobURL = URL.createObjectURL(blob);
          setSelectedDocument(blobURL);
        })
        .catch(() => {
          dispatch(userActions.setPopup({
            mainText: 'Error',
            additionalText: 'Something went wrong',
            type: PopupTypes.ERROR,
          }));
          setSelectedDocument(undefined);
        });
    };

    if (invoiceDetails && invoiceDetails.presignedUrl) {
      getPdf(invoiceDetails.presignedUrl);
    } else {
      setSelectedDocument(null);
    }
  }, [invoiceDetails]);

  return (
    <Content>
      {selectedDocument ? (
        <IFrame ref={ref} src={`${selectedDocument}#zoom=FitW`} />
      ) : selectedDocument === null ? (
        <NoFound isTextVisible={false} />
      ) : (
        <Box padding="300px 0" isCentered>
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.9951 2H8.99512C7.89512 2 6.99512 2.9 6.99512 4V16C6.99512 17.1 7.89512 18 8.99512 18H20.9951C22.0951 18 22.9951 17.1 22.9951 16V4C22.9951 2.9 22.0951 2 20.9951 2ZM12.4951 9.5C12.4951 10.33 11.8251 11 10.9951 11H9.99512V12.25C9.99512 12.66 9.65512 13 9.24512 13C8.83512 13 8.49512 12.66 8.49512 12.25V8C8.49512 7.45 8.94512 7 9.49512 7H10.9951C11.8251 7 12.4951 7.67 12.4951 8.5V9.5ZM17.4951 11.5C17.4951 12.33 16.8251 13 15.9951 13H13.9951C13.7151 13 13.4951 12.78 13.4951 12.5V7.5C13.4951 7.22 13.7151 7 13.9951 7H15.9951C16.8251 7 17.4951 7.67 17.4951 8.5V11.5ZM21.4951 7.75C21.4951 8.16 21.1551 8.5 20.7451 8.5H19.9951V9.5H20.7451C21.1551 9.5 21.4951 9.84 21.4951 10.25C21.4951 10.66 21.1551 11 20.7451 11H19.9951V12.25C19.9951 12.66 19.6551 13 19.2451 13C18.8351 13 18.4951 12.66 18.4951 12.25V8C18.4951 7.45 18.9451 7 19.4951 7H20.7451C21.1551 7 21.4951 7.34 21.4951 7.75ZM9.99512 9.5H10.9951V8.5H9.99512V9.5ZM3.99512 6C3.44512 6 2.99512 6.45 2.99512 7V20C2.99512 21.1 3.89512 22 4.99512 22H17.9951C18.5451 22 18.9951 21.55 18.9951 21C18.9951 20.45 18.5451 20 17.9951 20H5.99512C5.44512 20 4.99512 19.55 4.99512 19V7C4.99512 6.45 4.54512 6 3.99512 6ZM14.9951 11.5H15.9951V8.5H14.9951V11.5Z"
              fill="#6C7278"
            />
          </svg>
          PDF PREVIEW GOES HERE
        </Box>
      )}
    </Content>
  );
};

const IFrame = styled.iframe`
  width: 100%;
  height: 100vh;
  border: 0;
`;

const Box = styled.div<{
  padding?: string;
  height?: string;
  isCentered?: boolean;
  maxWidth?: string;
}>`
  max-width: ${({ maxWidth = 'auto' }) => maxWidth};
  padding: ${({ padding = '32px' }) => padding};
  height: ${({ height = 'auto' }) => height};
  border: 1px solid #dce4e8;
  border-radius: 12px;

  ${({ isCentered }) => (isCentered
    ? css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      grid-gap: 32px;
      font-size: 14px;
      font-weight: 600;
    `
    : '')}
`;
