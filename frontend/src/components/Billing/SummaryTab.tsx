import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import MasterCardIcon from '@/assets/icons/MasterCardIcon';
import VisaIcon from '@/assets/icons/VisaIcon';

import { SummaryModal } from '@/components/Billing/SummaryModal';
import SummaryTable from '@/components/Billing/SummaryTable';
import Loader from '@/components/Loader';
import NoFound from '@/components/NoFound';

import { Content } from '@/pages/Notices';

import { billingActions, getSummaryAction } from '@/store/actions/billingActions';

import { selectSummary } from '@/store/selectors/billingSelectors';
import { selectUser } from '@/store/selectors/userSelectors';

import useToggle from '@/hooks/useToggle';

import { AppDispatch } from '@/store';

import Button from '../Button';

const SummaryTab: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector(selectUser);
  const summary = useSelector(selectSummary);

  const [isDataLoading, toggleIsDataLoading] = useToggle(true);
  const [isMdalVisible, toggleIsModalVisible] = useToggle(false);

  const defaultCard = summary && summary.paymentMethods ? summary.paymentMethods.find((card) => card.default) : null;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const getNextMonth = () => {
    const currentMonth = new Date().getMonth();

    return `${months[currentMonth + 1]}`;
  };

  const getCardIcon = (brand: string) => {
    switch (brand) {
      case 'visa': {
        return <VisaIcon width="50" height="30" />;
      }
      case 'mastercard': {
        return <MasterCardIcon width="50" height="30" />;
      }
      default: return <VisaIcon width="50" height="30" />;
    }
  };

  const handleOpenModal = () => {
    toggleIsModalVisible(true);
  };

  const handleCloseModal = () => {
    toggleIsModalVisible(false);
  };

  useEffect(() => {
    getData();

    return () => {
      dispatch(billingActions.setInvoices(null));
    };
  }, []);

  const getData = async () => {
    if (user) {
      try {
        toggleIsDataLoading(true);
        await dispatch(getSummaryAction(user.organisations[0].id));
        toggleIsDataLoading(false);
      } catch (e) {
        toggleIsDataLoading(false);
      }
    }
  };

  return (
    <>
      {!isDataLoading ? (
        <Content>
          <div>
            {summary && Object.keys(summary).length ? (
              <Wrapper>
                <Card>
                  <Title>Current Balance</Title>
                  <TextWrapper>
                    <Text>
                      {`${+summary.currentBalance < 0
                        ? `${Number(summary.currentBalance / 100).toFixed(2).replace('-', '-$')}` || '-'
                        : `$${Number(summary.currentBalance / 100).toFixed(2)}` || '-'}`}
                    </Text>
                    <Span>
                      + (
                      {`${+summary.openBalance < 0
                        ? `${Number(summary.openBalance / 100).toFixed(2).replace('-', '-$')}` || '-'
                        : `$${Number(summary.openBalance / 100).toFixed(2)}` || '-'}`}
                      {' '}
                      Pending)
                    </Span>
                  </TextWrapper>
                  {summary.paymentMethods ? (
                    <div style={{ marginTop: '10px' }}>
                      <Button type="button" onClick={handleOpenModal}>Make a payment</Button>
                    </div>
                  ) : null}
                </Card>
                {user && user.organisations[0].paymentType === 'Automatic Payments' && (
                <>
                  <Card>
                    <Title>Next automatic payment</Title>
                    <TextWrapper style={{ marginBottom: '10px' }}>
                      <Text>
                        {getNextMonth()}
                        {' '}
                        1
                      </Text>
                      <Span>
                        or when your balance
                        {' '}
                        <br />
                        {' '}
                        reaches $
                        {Number(summary.threshold / 100).toFixed(2)}
                      </Span>
                    </TextWrapper>
                    {defaultCard && (
                    <BankCard>
                      {getCardIcon(defaultCard.brand)}
                      {' '}
                      {defaultCard.brand.slice(0, 1).toUpperCase()}
                      {defaultCard.brand.slice(1)}
                      {' '}
                      ****
                      {' '}
                      {defaultCard.last4}
                    </BankCard>
                    )}
                  </Card>
                  <Card>
                    <Title>How automatic payments work</Title>
                    <SubText>You’ll be charged:</SubText>
                    <List>
                      <Li>- On the 1st of each month and</Li>
                      <Li>
                        - Any time your balance reaches your $
                        {Number(summary.threshold / 100).toFixed(2)}
                        {' '}
                        threshold
                      </Li>
                    </List>
                  </Card>
                </>
                )}
              </Wrapper>
            ) : null}
            <div>
              {summary && Object.keys(summary).length ? (
                <SummaryTable summary={summary} />
              ) : (
                <NoFound />
              )}
            </div>
          </div>
          {summary && summary.paymentMethods && isMdalVisible && (
          <SummaryModal
            currentBalance={summary.currentBalance}
            cards={summary.paymentMethods}
            onClose={handleCloseModal}
            getData={getData}
          />
          )}
        </Content>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default SummaryTab;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
`;

const Card = styled.div`
  padding: 15px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
`;

const Title = styled.h2`
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  margin: 0 0 15px 0;
`;

const TextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const Text = styled.p`
  font-size: 30px;
  font-weight: 500;
  line-height: 34px;
  margin: 0;
`;

const SubText = styled.p`
  font-size: 22px;
  font-weight: 500;
  line-height: 26px;
  margin: 0;
`;

const Span = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-heigt: 14px;
`;

const List = styled.ul`
  margin-top: 5px;
`;

const Li = styled.li`
  font-size: 14px;
  line-height: 16px;
  margin-bottom: 5px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const BankCard = styled.p`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 400;
  line-heigt: 14px;
`;
