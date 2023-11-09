import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import styled from 'styled-components';

import CloseIcon from '@/assets/icons/CloseIcon';

import Background from '@/components/Background';
import Button from '@/components/Button';
import DatepickerWithTime from '@/components/Datepicker/DatepickerWithTime';
import Infotip from '@/components/Infotip';
import Input from '@/components/Input';
import Loader from '@/components/Loader';

import {
  createNoticeAction,
  getActiveNoticesAction,
  updateNoticeAction,
} from '@/store/actions/noticesActions';
import { userActions } from '@/store/actions/userActions';

import { ICreateNotice, INotice } from '@/store/reducers/notices';
import { PopupTypes } from '@/store/reducers/user';

import useInput from '@/hooks/useInput';
import useKeyPress from '@/hooks/useKeyPress';
import useModalWindow from '@/hooks/useModalWindow';
import useToggle from '@/hooks/useToggle';

import isFormChanged from '@/utils/isFormChanged';

import { AppDispatch } from '@/store';

interface Props {
  close: Function;
  notice?: INotice;
}

const NoticeModalWindow: React.FC<Props> = ({ close, notice }) => {
  const [subject, setSubject] = useInput(notice?.subject);
  const [startDate, setStartDate] = useState<number | undefined>();
  const [endDate, setEndDate] = useState<number | undefined>();
  const [message, setMessage] = useInput(notice?.message);
  const [modalRef, setModalRef] = useState<HTMLDivElement | null>(null);
  const [isLoading, toggleIsLoading] = useToggle();

  const enterPress = useKeyPress('Enter');
  const shiftPress = useKeyPress('Shift');

  const dispatch = useDispatch<AppDispatch>();
  useModalWindow();

  useEffect(() => {
    if (startDate && endDate && moment(startDate).isSameOrAfter(moment(endDate))) {
      const mem = moment(startDate).add(1, 'minutes').valueOf();
      setEndDate(mem);
    }
  }, [startDate]);

  useEffect(() => {
    const isDisabled = !subject || !startDate || !message;
    if (enterPress && !shiftPress && !isDisabled) {
      createNotice();
    }
  }, [enterPress]);

  const textareaHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (enterPress && !shiftPress) {
      e.preventDefault();
    } else {
      setMessage(e);
    }
  };

  const createNotice = async () => {
    if (!isDisabled && !isLoading) {
      try {
        if (notice?.id) {
          const updateNoticeObj: ICreateNotice = {
            subject: subject.trim(),
            startDate: startDate || +notice.startDate,
            message: message.trim(),
          };

          if (endDate || notice.endDate) {
            updateNoticeObj.endDate = endDate || +notice.endDate!;
          }

          const isChanged = isFormChanged(
            notice,
            {
              ...updateNoticeObj,
              startDate: String(updateNoticeObj.startDate),
              endDate: String(updateNoticeObj.endDate),
            },
          );

          if (!isChanged) {
            close(false);
            return;
          }

          toggleIsLoading(true);

          await dispatch(updateNoticeAction(notice.id, updateNoticeObj));
        } else {
          toggleIsLoading(true);

          const createNoticeObj: ICreateNotice = {
            subject: subject.trim(),
            startDate,
            message: message.trim(),
          };

          if (endDate) {
            createNoticeObj.endDate = endDate;
          }

          await dispatch(createNoticeAction(createNoticeObj));
        }

        await dispatch(getActiveNoticesAction());

        toggleIsLoading(false);
        dispatch(
          userActions.setPopup({
            type: PopupTypes.SUCCESS,
            mainText: notice?.id
              ? 'Success update Notice'
              : 'Success add new Notice',
            additionalText: notice?.id
              ? 'Notice has been updated'
              : 'New notice has been added',
          }),
        );
        close(false);
      } catch (e: any) {
        toggleIsLoading(false);
      }
    }
  };

  const start = startDate ? String(startDate) : undefined;
  const end = endDate ? String(endDate) : undefined;

  const isDisabled = (!subject.trim() || !startDate || !message.trim())
    || !!(
      notice?.id
      && !isFormChanged(
        notice,
        {
          subject: subject.trim(),
          startDate: start,
          endDate: end || null,
          message: message.trim(),
        },
      )
    );

  return (
    <Background close={() => close()}>
      <ModalWindow
        ref={(ref) => setModalRef(ref)}
        onClick={(evt) => evt.stopPropagation()}
      >
        <Header>
          <Title>{notice?.id ? 'Update Notice' : 'Add New Notice'}</Title>
          <CloseIcon onClick={() => close()} />
        </Header>
        <Input
          value={subject}
          onChange={setSubject}
          label="Subject"
          labelMarginBottom={12}
          placeholder="Maintenance"
          inputMarginBottom="0"
          inputFontSize="16px"
          style={{ height: '48px' }}
        />
        {!!modalRef && (
          <>
            <DatepickerWithTime
              label="Start Time"
              setFunc={setStartDate}
              modalRef={modalRef}
              initialTime={
                notice?.startDate
                  ? notice.startDate
                  : start
              }
            />
            <DatepickerWithTime
              label={(
                <>
                  End Time
                  <Infotip infotip="Required to display banner." />
                  (Optional)
                </>
              )}
              setFunc={setEndDate}
              modalRef={modalRef}
              setFrom={startDate ? new Date(startDate) : undefined}
              initialTime={
                notice?.endDate
                  ? notice.endDate
                  : end
              }
              isEnd
            />
          </>
        )}
        <label>
          <Span>Message</Span>
          <Textarea
            value={message}
            placeholder="Input your message"
            onChange={textareaHandler}
          />
        </label>
        <Buttons>
          <StyledButton isCancel onClick={() => close()}>
            Cancel
          </StyledButton>
          <StyledButton
            onClick={createNotice}
            width="80px"
            disabled={isDisabled}
          >
            {isLoading ? (
              <Loader size={24} thickness={2} color="#fff" />
            ) : notice?.id ? (
              'Save'
            ) : (
              'Send'
            )}
          </StyledButton>
        </Buttons>
      </ModalWindow>
    </Background>
  );
};

const ModalWindow = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 32px;
  padding: 32px;
  width: 478px;
  border-radius: 16px;
  background-color: #fff;
  cursor: default;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-gap: 10px;

  svg {
    cursor: pointer;
  }
`;

const Title = styled.h3`
  font-size: 24px;
  font-weight: 600;
`;

const Span = styled.span`
  display: block;
  margin-bottom: 12px;
  font-size: 16px;
  color: #6c7278;
  font-weight: 500;
`;

const Textarea = styled.textarea`
  padding: 16px 24px;
  width: 100%;
  min-height: 122px;
  border: 1px solid rgba(35, 35, 35, 0.16);
  border-radius: 4px;
  resize: none;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  grid-gap: 16px;
`;

const StyledButton = styled(Button)`
  height: 48px;
`;

export default NoticeModalWindow;
