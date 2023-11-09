import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import AddedFileIcon from '@/assets/icons/AddedFileIcon';
import AddFileIcon from '@/assets/icons/AddFileIcon';
import CloseIcon from '@/assets/icons/CloseIcon';

import Background from '@/components/Background';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Loader from '@/components/Loader';

import { uploadPriceListAction } from '@/store/actions/priceListActions';
import { userActions } from '@/store/actions/userActions';

import { PopupTypes } from '@/store/reducers/user';

import useInput from '@/hooks/useInput';
import useKeyPress from '@/hooks/useKeyPress';
import useModalWindow from '@/hooks/useModalWindow';
import useToggle, { HandleToggle } from '@/hooks/useToggle';

import { AppDispatch } from '@/store';

interface Props {
  close: HandleToggle
}

const AddPriceList: React.FC<Props> = ({ close }) => {
  const [file, setFile] = useState<File>();
  const [id, setId] = useInput();
  const [description, setDescription] = useInput();
  const [isLoading, toggleIsLoading] = useToggle();

  useModalWindow();

  const dispatch = useDispatch<AppDispatch>();
  const enterPressed = useKeyPress('Enter');

  useEffect(() => {
    if (enterPressed) uploadPriceList();
  }, [enterPressed]);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles) setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
  });

  const handleFileChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (evt.target.files) setFile(evt.target.files[0]);
  };

  const cancel = () => {
    setFile(undefined);
    setId('');
    setDescription('');
  };

  const uploadPriceList = async () => {
    if (id && description && file) {
      try {
        toggleIsLoading(true);
        await dispatch(uploadPriceListAction({
          priceListName: id,
          description,
          file,
        }));
        dispatch(userActions.setPopup({
          type: PopupTypes.SUCCESS,
          mainText: 'Success',
          additionalText: 'Price list have been uploaded',
        }));
        toggleIsLoading(false);
        close(false);
      } catch (e) {
        toggleIsLoading(false);
      }
    }
  };

  return (
    <Background close={close}>
      <Content onClick={(evt) => evt.stopPropagation()}>
        <Header>
          Upload Price List
          <CloseIcon handler={close} />
        </Header>
        {file ? (
          <>
            <FileItem>
              <FileInfo>
                <AddedFileIcon />
                <div>
                  <FileName>{file.name}</FileName>
                  <FileSize>
                    {(file.size / 1024 ** 2).toFixed(2)}
                    {' '}
                    MB
                  </FileSize>
                </div>
              </FileInfo>
              <RemoveFile>
                <CloseIcon onClick={cancel} />
              </RemoveFile>
            </FileItem>
            <Input
              label="Price List ID"
              labelMarginBottom={12}
              value={id}
              onChange={setId}
              inputMarginBottom="24px"
              inputHeight="48px"
              placeholder="Input Price List ID Here"
            />
            <Input
              label="Description"
              labelMarginBottom={12}
              value={description}
              onChange={setDescription}
              inputMarginBottom="42px"
              inputHeight="48px"
              placeholder="Input Description Here"
            />
            <Buttons>
              <Button
                isCancel
                onClick={cancel}
              >
                Cancel
              </Button>
              <Button
                disabled={!file || !id || !description}
                onClick={uploadPriceList}
              >
                {isLoading ? <Loader size={24} thickness={2} color="#fff" /> : 'Create'}
              </Button>
            </Buttons>
          </>
        ) : (
          <DropArea {...getRootProps()}>
            <StyledAddFileIcon />
            <DropAreaMainText>Select a CSV File to upload</DropAreaMainText>
            <DropAreaAdditionalText>or drag and drop it here</DropAreaAdditionalText>
            <Browse>
              Browse File
              <input
                type="file"
                onChange={handleFileChange}
                multiple={false}
                accept=".csv"
                {...getInputProps()}
              />
            </Browse>
          </DropArea>
        )}
      </Content>
    </Background>
  );
};

const Content = styled.div`
  padding: 32px;
  width: 100%;
  max-width: 642px;
  border-radius: 16px;
  background-color: #fff;
  cursor: default;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-gap: 16px;
  margin-bottom: 32px;
  font-size: 24px;
  font-weight: 600;
  
  svg {
    cursor: pointer;
  }
`;

const DropArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 70px;
  border: 1px dashed #BEBEBE;
  border-radius: 10px;

  input {
    display: none;
  }
`;

const StyledAddFileIcon = styled(AddFileIcon)`
  margin-bottom: 14px;
`;

const DropAreaMainText = styled.p`
  margin-bottom: 6px;
  font-weight: 500;
`;

const DropAreaAdditionalText = styled.p`
  margin-bottom: 32px;
  font-size: 12px;
  color: #6C7278;
`;

const Browse = styled.label`
  padding: 16px 20px;
  border-radius: 4px;
  font-weight: 500;
  color: #fff;
  background-color: var(--primary-green-color);
  cursor: pointer;
  
  :hover {
    background-color: var(--primary-green-hover-color);
  }
`;

const FileItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-gap: 24px;
  margin-bottom: 32px;
  padding: 28px;
  border-radius: 10px;
  background-color: #EDF1F3;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 20px;
  
  svg {
    flex-shrink: 0;
  }
`;

const FileName = styled.p`
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 600;
`;

const FileSize = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #6C7278;
`;

const RemoveFile = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #fff;
  cursor: pointer;
  
  svg {
    width: 20px;
    min-width: 20px;
    height: 20px;
    min-height: 20px;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  grid-gap: 16px;
  
  button {
    height: 48px;
  }
`;

export default AddPriceList;
