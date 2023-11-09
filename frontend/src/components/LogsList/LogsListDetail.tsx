import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import ArrowBackIcon from '@/assets/icons/ArrowBackIcon';
import ArrowRightIcon from '@/assets/icons/ArrowRightIcon';

import Loader from '@/components/Loader';

import { getFullLogAction, logsActions } from '@/store/actions/logsActions';

import { selectFullLog } from '@/store/selectors/logsSelector';

import useShiki, { setCDN } from '@/hooks/useShiki';

import convertTimestamp from '@/utils/convertTimestamp';

import { AppDispatch } from '@/store';

setCDN('https://unpkg.com/shiki/');

const LogsListDetail: FC = () => {
  const { id } = useParams();
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const fullLog = useSelector(selectFullLog);

  const highlighter = useShiki({
    theme: 'github-light',
    langs: ['json'],
  });

  const isHeaderValueString = (
    headerValue: string | { [key: string]: string },
  ): headerValue is string => typeof headerValue === 'string';

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        await dispatch(getFullLogAction(id!));
        setLoading(false);
      } catch (e) {
        setLoading(false);
        navigate('/notFound', {
          replace: true,
          state: {
            goBack: '/logs',
          },
        });
      }
    };

    window.scrollTo(0, 0);

    if (id) getData();

    return () => {
      dispatch(logsActions.setFullLog(null));
    };
  }, [id]);

  return !isLoading ? (
    <LogsListDetailStyled>
      <NavLineContainer>
        <StyledArrowBackIcon onClick={() => navigate(-1)} />
        <NavLine>
          <NavItem onClick={() => navigate(-1)}>Logs</NavItem>
          <ArrowRightIcon />
          <NavItem>{id}</NavItem>
        </NavLine>
      </NavLineContainer>
      {fullLog?.length ? (
        <Content>
          {fullLog[0].requestInfo && (
            <DataWrapper>
              <Title>Vendor Request</Title>
              <Text>
                User id:
                {' '}
                <TextInfo>{fullLog[0].requestInfo.userId}</TextInfo>
              </Text>
              <Text>
                Path:
                {' '}
                <TextInfo>{fullLog[0].requestInfo.path}</TextInfo>
              </Text>
              <Text>
                Query:
                {' '}
                <TextInfo>{fullLog[0].requestInfo.query}</TextInfo>
              </Text>
              <Text>
                Api key:
                {' '}
                <TextInfo>{fullLog[0].requestInfo.apiKey}</TextInfo>
              </Text>
              <Text>
                Date:
                {' '}
                <TextInfo>{convertTimestamp(fullLog[0].requestInfo.requestDate, true, true)}</TextInfo>
              </Text>
              <Text>
                Method:
                {' '}
                <TextInfo>{fullLog[0].requestInfo.method}</TextInfo>
              </Text>
              <Text>
                Org id:
                {' '}
                <TextInfo>{fullLog[0].requestInfo.orgId}</TextInfo>
              </Text>
              <Text>
                Status code:
                {' '}
                <TextInfo>{fullLog[0].requestInfo.statusCode}</TextInfo>
              </Text>
              <Text>
                Vendor Status:
                {' '}
                <TextInfo>{fullLog[0].requestInfo.vendorStatus}</TextInfo>
              </Text>
              <Text>
                Request Date:
                {' '}
                <TextInfo>
                  {convertTimestamp(fullLog[0].requestInfo.requestDate, true, true)}
                </TextInfo>
              </Text>
              <Text>Headers:</Text>
              <HeadersList>
                {fullLog[0].requestInfo.headers
              && Object.entries(fullLog[0].requestInfo.headers).length ? (
                    Object.entries(fullLog[0].requestInfo.headers)
                      .map((header, index) => (isHeaderValueString(header[1]) ? (
                        <li key={index}>
                          <Text>
                            {header[0]}
                            {': '}
                            <TextInfo>{header[1]}</TextInfo>
                          </Text>
                        </li>
                      ) : (
                        <>
                          <HeadersListTitle>
                            {header[0]}
                            :
                          </HeadersListTitle>
                          {Object.entries(header[1]).map((subHeader, subIndex) => (
                            <li key={subIndex}>
                              <Text>
                                {subHeader[0]}
                                {': '}
                                <TextInfo>{subHeader[1]}</TextInfo>
                              </Text>
                            </li>
                          ))}
                        </>
                      )))
                  ) : (
                    <li>Empty</li>
                  )}
              </HeadersList>
            </DataWrapper>
          )}
          {fullLog[0].responseInfo && (
            <DataWrapper>
              <Title>Vendor Response</Title>
              <Text>
                Status Code:
                {' '}
                <TextInfo>{fullLog[0].responseInfo.statusCode}</TextInfo>
              </Text>
              <Text>
                Duration:
                {' '}
                <TextInfo>{fullLog[0].responseInfo.duration}</TextInfo>
              </Text>
              <Text>
                Order id:
                {' '}
                <TextInfo>{fullLog[0].responseInfo.orderId}</TextInfo>
              </Text>
              <Text>
                Response Date:
                {' '}
                <TextInfo>
                  {convertTimestamp(fullLog[0].responseInfo.responseDate, true, true)}
                </TextInfo>
              </Text>
              <Text>Headers:</Text>
              <HeadersList>
                {fullLog[0].responseInfo.headers
              && Object.entries(fullLog[0].responseInfo.headers).length ? (
                    Object.entries(fullLog[0].responseInfo.headers)
                      .map((header, index) => (isHeaderValueString(header[1]) ? (
                        <li key={index}>
                          <Text>
                            {header[0]}
                            {': '}
                            <TextInfo>{header[1]}</TextInfo>
                          </Text>
                        </li>
                      ) : (
                        <>
                          <HeadersListTitle>
                            {header[0]}
                            :
                          </HeadersListTitle>
                          {Object.entries(header[1]).map((subHeader, subIndex) => (
                            <li key={subIndex}>
                              <Text>
                                {subHeader[0]}
                                {': '}
                                <TextInfo>{subHeader[1]}</TextInfo>
                              </Text>
                            </li>
                          ))}
                        </>
                      )))
                  ) : (
                    <li>Empty</li>
                  )}
              </HeadersList>
              <Text>Data:</Text>
              <Data
                dangerouslySetInnerHTML={{
                  __html:
                  highlighter?.codeToHtml(JSON.stringify(fullLog[0].responseInfo.data, null, ' '), {
                    lang: 'json',
                  }) || '',
                }}
              />
            </DataWrapper>
          )}
          {fullLog[0].clientRequest && (
            <DataWrapper>
              <Title>Client Request</Title>
              <Text>
                Path:
                {' '}
                <TextInfo>{fullLog[0].clientRequest.path}</TextInfo>
              </Text>
              <Text>
                Query:
                {' '}
                <TextInfo>{fullLog[0].clientRequest.query}</TextInfo>
              </Text>
              <Text>
                Method:
                {' '}
                <TextInfo>{fullLog[0].clientRequest.method}</TextInfo>
              </Text>
              <Text>
                Api key:
                {' '}
                <TextInfo>{fullLog[0].clientRequest.apiKey}</TextInfo>
              </Text>
              {fullLog[0].clientRequest.requestDate && (
              <Text>
                Request Date:
                {' '}
                <TextInfo>
                  {convertTimestamp(fullLog[0].clientRequest.requestDate, true, true)}
                </TextInfo>
              </Text>
              )}
              <Text>Headers:</Text>
              <HeadersList>
                {fullLog[0].clientRequest.headers
              && Object.entries(fullLog[0].clientRequest.headers).length ? (
                    Object.entries(fullLog[0].clientRequest.headers)
                      .map((header, index) => (isHeaderValueString(header[1]) ? (
                        <li key={index}>
                          <Text>
                            {header[0]}
                            {': '}
                            <TextInfo>{header[1]}</TextInfo>
                          </Text>
                        </li>
                      ) : (
                        <>
                          <HeadersListTitle>
                            {header[0]}
                            :
                          </HeadersListTitle>
                          {Object.entries(header[1]).map((subHeader, subIndex) => (
                            <li key={subIndex}>
                              <Text>
                                {subHeader[0]}
                                {': '}
                                <TextInfo>{subHeader[1]}</TextInfo>
                              </Text>
                            </li>
                          ))}
                        </>
                      )))
                  ) : (
                    <li>Empty</li>
                  )}
              </HeadersList>
              <Text>Body:</Text>
              <Data
                dangerouslySetInnerHTML={{
                  __html:
                  highlighter?.codeToHtml(
                    JSON.stringify(fullLog[0].clientRequest.body, null, ' '),
                    {
                      lang: 'json',
                    },
                  ) || '',
                }}
              />
            </DataWrapper>
          )}
          {fullLog[0].serverResponse && (
            <DataWrapper>
              <Title>Client Response</Title>
              <Text>
                User id:
                {' '}
                <TextInfo>{fullLog[0].serverResponse.userId}</TextInfo>
              </Text>
              <Text>
                Path:
                {' '}
                <TextInfo>{fullLog[0].serverResponse.path}</TextInfo>
              </Text>
              {fullLog[0].serverResponse?.duration && (
              <Text>
                Duration:
                {' '}
                <TextInfo>{fullLog[0].serverResponse.duration}</TextInfo>
              </Text>
              )}
              <Text>
                Params:
                {' '}
                <TextInfo>{fullLog[0].serverResponse.params}</TextInfo>
              </Text>
              <Text>
                Org id:
                {' '}
                <TextInfo>{fullLog[0].serverResponse.organisationId}</TextInfo>
              </Text>
              <Text>
                Order id:
                {' '}
                <TextInfo>{fullLog[0].serverResponse.orderId}</TextInfo>
              </Text>
              <Text>
                Status code:
                {' '}
                <TextInfo>{fullLog[0].serverResponse.statusCode}</TextInfo>
              </Text>
              {fullLog[0].serverResponse.userNotification && (
              <Text>
                User Notifications:
                {' '}
                <TextInfo>{fullLog[0].serverResponse.userNotification}</TextInfo>
              </Text>
              )}
              {fullLog[0].serverResponse.responseDate && (
              <Text>
                Response Date:
                {' '}
                <TextInfo>
                  {convertTimestamp(fullLog[0].serverResponse.responseDate, true, true)}
                </TextInfo>
              </Text>
              )}
              <Text>Data:</Text>
              <Data
                dangerouslySetInnerHTML={{
                  __html:
                  highlighter?.codeToHtml(
                    JSON.stringify(fullLog[0].serverResponse.data, null, ' '),
                    {
                      lang: 'json',
                    },
                  ) || '',
                }}
              />
            </DataWrapper>
          )}
        </Content>
      ) : <NoData>There is no data</NoData>}
    </LogsListDetailStyled>
  ) : (
    <Loader />
  );
};

const LogsListDetailStyled = styled.div``;

const NavLineContainer = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 12px;
  margin-bottom: 32px;
  padding: 0 32px 32px;
  border-bottom: 1px solid rgba(26, 28, 30, 0.16);
`;

const NoData = styled.p`
  text-align: center;
  margin: 20px 0;
  font-weight: 500;
`;

const StyledArrowBackIcon = styled(ArrowBackIcon)`
  cursor: pointer;
`;

const NavLine = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 8px;
`;

const NavItem = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #acb5bb;

  :last-child {
    font-size: 16px;
    font-weight: 600;
    color: var(--primary-dark-color);
  }

  :first-child {
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      color: inherit;
    }
  }
`;

const Content = styled.div`
  display: grid;
  row-gap: 20px;
  padding: 0 32px;
`;

const DataWrapper = styled.div`
  border-bottom: 2px solid #eeeeee;
  padding-bottom: 20px;

  &:last-of-type {
    border-bottom: none;
  }
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Text = styled.p`
  font-weight: 600;
  margin-bottom: 10px;
  width: 100%;
  word-wrap: anywhere;

  &:last-child {
    margin-bottom: 0;
  }
`;

const TextInfo = styled.span`
  font-weight: 400;
`;

const HeadersList = styled.ul`
  padding-left: 15px;
  margin-bottom: 10px;
  list-style: disc;
`;

const HeadersListTitle = styled.li`
  font-weight: 500;
  list-style-type: none;
  margin-left: -20px;

  &:not(:first-child) {
    margin-top: 10px;
  }
`;

const Data = styled.div`
  overflow: auto;
  height: 300px;
  background-color: #f6f6f6;
  border-radius: 10px;
  padding: 10px 15px;

  & pre {
    background-color: #f6f6f6 !important;
    overflow: hidden;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
    max-width: 100%;
  }
`;

export default LogsListDetail;
