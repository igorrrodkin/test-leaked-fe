import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import CloseIcon from '@/assets/icons/CloseIcon';

import { noticesActions } from '@/store/actions/noticesActions';

import { INotice } from '@/store/reducers/notices';

import { selectActiveNotices } from '@/store/selectors/noticesSelector';

const Notice = () => {
  const notices = useSelector(selectActiveNotices);

  const dispatch = useDispatch<any>();

  const handleActiveNoticeClose = (id: number) => {
    const activeNotices = notices!.filter((n) => n.id !== id);
    dispatch(noticesActions.setActiveNotices(activeNotices));
  };

  const sortBy2Params = (arr: INotice[] | null) => {
    if (!arr) return;

    return [...arr].sort((a, b) => {
      if (a.startDate === b.startDate) {
        return +(a.endDate || 0) < +(b.endDate || 0) ? -1 : 1;
      }
      return +b.startDate < +a.startDate ? -1 : 1;
    });
  };

  return notices && notices.length ? (
    <Wrapper>
      {sortBy2Params(notices)?.map((el) => (
        <Div key={el.id}>
          <Content isCentered={notices.length === 1}>
            <Info>
              <P>{el.subject}</P>
              <Message key={el.id}>{el.message}</Message>
            </Info>
          </Content>
          <StyledCloseIcon onClick={() => handleActiveNoticeClose(el.id)}>
            <CloseIcon />
          </StyledCloseIcon>
        </Div>
      ))}
    </Wrapper>
  ) : (
    <></>
  );
};

const Wrapper = styled.div`
  padding: 32px 32px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Div = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-gap: 10px;
  padding: 16px 20px;
  border-left: 3px solid var(--primary-yellow-border-color);
  background-color: var(--primary-yellow-background-color);
`;

const Content = styled.div<{ isCentered: boolean }>`
  display: flex;
  align-items: ${({ isCentered }) => (isCentered ? 'center' : 'flex-start')};
  grid-gap: 10px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 4px;
`;

const P = styled.p`
  font-weight: 600;
  font-size: 12px;
  line-height: 150%;
  letter-spacing: -0.03em;
  color: #1a1c1e;
`;
const Message = styled.p`
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  letter-spacing: -0.03em;
  color: #6c7278;
`;

const StyledCloseIcon = styled.div`
  flex: 0 0 20px;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  & svg {
    flex: 0 0 19px;
    max-width: 19px;
  }

  * {
    stroke: #acb5bb;
  }
`;

export default Notice;
