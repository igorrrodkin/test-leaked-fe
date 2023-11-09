import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import CloseIcon from '@/assets/icons/CloseIcon';

import Background from '@/components/Background';
import Button from '@/components/Button';
import EditableInput from '@/components/EditableInput';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import Select from '@/components/Select';
import SettingsOption from '@/components/Settings/Preferences/SettingsOption';

import { createService, updateService } from '@/store/actions/servicesActions';

import {
  FullfilmentType,
  ICreateService,
  IService,
  IServiceUpdated,
} from '@/store/reducers/services';

import { selectIsUserServicesLoading } from '@/store/selectors/servicesSelector';

import useInput, { OnChange } from '@/hooks/useInput';
import useKeyPress from '@/hooks/useKeyPress';
import useModalWindow from '@/hooks/useModalWindow';

import { ExistingRegions } from '@/utils/getRegionsData';
import isFormChanged from '@/utils/isFormChanged';

import { AppDispatch } from '@/store';

interface Props {
  close: Function;
  service?: IService;
}

const ServiceModalWindow: React.FC<Props> = ({ close, service }) => {
  const [code, setCode] = useInput(service?.productId);
  const [supplier, setSupplier] = useInput(service?.supplier);
  const [searchType, setSearchType] = useInput(service?.searchType);
  const [label, setLabel] = useInput(service?.label);
  const [group, setGroup] = useInput(service?.group);
  const [subgroup, setSubgroup] = useInput(service?.subgroup);
  const [region, setRegion] = useState(
    service?.region
      ? Object.values(ExistingRegions).findIndex(
        (existingType) => service.region === existingType,
      )
      : undefined,
  );
  const [description, setDescription] = useInput(service?.description || '');
  const [serviceDisclaimer, setServiceDisclaimer] = useInput(service?.serviceDisclaimer || '');
  const [searchResultDisclaimer, setSearchResultDisclaimer] = useInput(service?.searchResultDisclaimer || '');
  const [status, setStatus] = useState(!!service?.status);
  const setIsUserServicesLoading = useSelector(selectIsUserServicesLoading);

  const enterPress = useKeyPress('Enter');
  const shiftPress = useKeyPress('Shift');

  const dispatch = useDispatch<AppDispatch>();
  useModalWindow();

  const isDisabled = !code
    || !supplier
    || !searchType
    || !group
    || !subgroup
    || region === undefined;

  useEffect(() => {
    if (enterPress && !shiftPress && !isDisabled) {
      createServiceFunc();
    }
  }, [enterPress]);

  const textareaHandler = (e: React.ChangeEvent<HTMLTextAreaElement>, changeFunc: OnChange) => {
    if (enterPress && !shiftPress) {
      e.preventDefault();
    } else {
      changeFunc(e);
    }
  };

  const descriptionHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    textareaHandler(e, setDescription);
  };

  const serviceDisclaimerHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    textareaHandler(e, setServiceDisclaimer);
  };

  const searchResultsDisclaimerHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    textareaHandler(e, setSearchResultDisclaimer);
  };

  const createServiceFunc = async () => {
    if (service?.id) {
      const updateServiceObj: IServiceUpdated = {
        supplier: supplier || '',
        searchType,
        label,
        group: group || '',
        subgroup: subgroup || '',
        description: description || '',
        serviceDisclaimer,
        searchResultDisclaimer,
        status,
        region: Object.values(ExistingRegions)[region!],
      };

      if (!isFormChanged(service, updateServiceObj)) {
        close(false);
        return;
      }

      await dispatch(
        updateService(service.productId, updateServiceObj),
      );

      close(false);
    } else {
      const createdServiceObj: ICreateService = {
        productId: code,
        supplier,
        searchType,
        label,
        group,
        subgroup,
        description,
        serviceDisclaimer,
        searchResultDisclaimer,
        status,
        region: Object.values(ExistingRegions)[region!],
      };

      await dispatch(createService(createdServiceObj));

      close(false);
    }
  };

  return (
    <Background close={() => close()}>
      <ModalWindow
        onClick={(evt) => evt.stopPropagation()}
      >
        <Header>
          <Title>{service ? 'Update Service' : 'Add New Service'}</Title>
          <CloseIcon onClick={() => close()} />
        </Header>
        <Content>
          <GridBox>
            <Input
              value={code}
              onChange={setCode}
              label="Product Code"
              labelMarginBottom={12}
              placeholder="Placeholder"
              inputMarginBottom="0"
              inputFontSize="16px"
              style={{ height: '48px' }}
              disabled={!!service?.productId}
            />
            <Input
              value={supplier}
              onChange={setSupplier}
              label="Supplier"
              labelMarginBottom={12}
              placeholder="Placeholder"
              inputMarginBottom="0"
              inputFontSize="16px"
              style={{ height: '48px' }}
            />
            <Input
              value={searchType}
              onChange={setSearchType}
              label="Search Type"
              labelMarginBottom={12}
              placeholder="Search Type"
              inputMarginBottom="0"
              inputFontSize="16px"
              style={{ height: '48px' }}
            />
            <Input
              value={label}
              onChange={setLabel}
              label="Label"
              labelMarginBottom={12}
              placeholder="Label"
              inputMarginBottom="0"
              inputFontSize="16px"
              style={{ height: '48px' }}
            />
            <Input
              value={group}
              onChange={setGroup}
              label="Group"
              labelMarginBottom={12}
              placeholder="Placeholder"
              inputMarginBottom="0"
              inputFontSize="16px"
              style={{ height: '48px' }}
            />
            <Input
              value={subgroup}
              onChange={setSubgroup}
              label="Subgroup"
              labelMarginBottom={12}
              placeholder="Placeholder"
              inputMarginBottom="0"
              inputFontSize="16px"
              style={{ height: '48px' }}
            />
            <EditableInput
              isEditMode
              isLocked
              label="Fulfillment"
              value={
                service?.id
                  ? service?.fulfilmentType || ''
                  : FullfilmentType.MANUAL
              }
              placeholder="Placeholder"
            />
            <label>
              <Span>Region</Span>
              <Select
                selectedItem={region}
                setSelectedItem={setRegion}
                items={Object.values(ExistingRegions)}
                placeholder="Placeholder"
                height="48px"
                fontSize="16"
              />
            </label>
            <label>
              <Span>Description</Span>
              <Textarea
                value={description}
                placeholder="Placeholder"
                onChange={descriptionHandler}
              />
            </label>
            <label>
              <Span>Service Disclaimer</Span>
              <Textarea
                value={serviceDisclaimer}
                placeholder="Placeholder"
                onChange={serviceDisclaimerHandler}
              />
            </label>
            <label>
              <Span>Search Result Disclaimer</Span>
              <Textarea
                value={searchResultDisclaimer}
                placeholder="Placeholder"
                onChange={searchResultsDisclaimerHandler}
              />
            </label>
          </GridBox>
          <SettingsOption
            isActive={status}
            setIsActive={setStatus}
            justifyContent="flex-start"
          >
            Make this product active?
          </SettingsOption>
        </Content>
        <Buttons>
          <StyledButton isCancel onClick={() => close()}>
            Cancel
          </StyledButton>
          <StyledButton onClick={createServiceFunc} disabled={isDisabled}>
            {setIsUserServicesLoading ? (
              <Loader size={24} thickness={2} color="#fff" />
            ) : service?.id ? (
              'Update'
            ) : (
              'Add'
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
  padding: 32px 0;
  width: 982px;
  max-height: 98%;
  border-radius: 16px;
  background-color: #fff;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-gap: 10px;
  padding: 0 32px 32px;

  svg {
    cursor: pointer;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 32px;
  padding: 0 32px;
  width: calc(100% - 4px);
  height: 100%;
  cursor: default;
  overflow-y: auto;
  scrollbar-color: rgba(163, 163, 163, 0.7);

  &::-webkit-scrollbar-thumb {
    outline: 2px solid transparent;
    height: 20%;
    width: 20%;
    background-color: rgba(163, 163, 163, 0.7);
    border-radius: 4px;
  }

  &::-webkit-scrollbar {
    transition: all 0.3s ease-in;
    width: 5px;
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 0 transparent;
    -webkit-box-shadow: inset 0 0 0 transparent;
    background: transparent;
    margin: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(163, 163, 163, 0.7);
  }
`;

const Title = styled.h3`
  font-size: 24px;
  font-weight: 600;
`;

const GridBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 32px;
  grid-column-gap: 16px;
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
  min-height: 221px;
  border: 1px solid rgba(35, 35, 35, 0.16);
  border-radius: 4px;
  resize: none;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  grid-gap: 16px;
  padding: 32px 32px 0;
`;

const StyledButton = styled(Button)`
  height: 48px;
`;

export default ServiceModalWindow;
