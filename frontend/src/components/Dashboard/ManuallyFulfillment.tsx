import React, { useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import base64 from 'base-64';
import styled, { css } from 'styled-components';

import AddedFileIcon from '@/assets/icons/AddedFileIcon';
import AddFileIcon from '@/assets/icons/AddFileIcon';
import CloseIcon from '@/assets/icons/CloseIcon';
import FailedAddFileIcon from '@/assets/icons/FailedAddFileIcon';
import PlusIcon from '@/assets/icons/PlusIcon';

import Background from '@/components/Background';
import Button from '@/components/Button';
import OrderInfo from '@/components/Dashboard/OrderInfo';
import Loader from '@/components/Loader';

import {
  completeFilesUploadAction,
  uploadFileAction,
} from '@/store/actions/orderActions';
import {
  getOrderDetailsAction,
  getOrdersAction,
  userActions,
} from '@/store/actions/userActions';

import { IFileKey } from '@/store/reducers/user';

import { selectOrderDetails, selectUser } from '@/store/selectors/userSelectors';

import useModalWindow from '@/hooks/useModalWindow';
import useToggle, { HandleToggle } from '@/hooks/useToggle';

import { getObjectFromQueries, getQueries } from '@/utils/api';

import { AppDispatch } from '@/store';

export enum LoadStates {
  IDLE = 'idle',
  LOADING = 'loading',
  ERROR = 'error',
}
export interface IFileData {
  file: File;
  fileKey?: IFileKey;
  loadState: LoadStates;
}

interface Props {
  close: HandleToggle;
  orderId: string;
}

export const FILE_LINKS_DIVIDER = 'speCIal_AlT_CoRPs_fiLES_DeViDER';

const ManuallyFulfillment: React.FC<Props> = ({ close, orderId }) => {
  const { search } = useLocation();

  const orderDetails = useSelector(selectOrderDetails);
  const user = useSelector(selectUser)!;

  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const [files, setFiles] = useState<IFileData[]>([]);
  const [isLoading, toggleIsLoading] = useToggle();
  const [isEdit, toggleIsEdit] = useToggle();

  const dispatch = useDispatch<AppDispatch>();

  useModalWindow();

  const decodedQuery = useMemo(() => base64.decode(search.slice(1)), [search]);

  const query = useMemo(
    () => ({
      ...getObjectFromQueries(decodedQuery),
      ...(user.userSettings?.general?.isShowOwnOrders ? { userId: user.id } : {}),
    }),
    [decodedQuery, user],
  );

  const isFilesLoading = useMemo(
    () => files.some(({ loadState }) => loadState === LoadStates.LOADING),
    [files],
  );

  useEffect(() => {
    if (!orderDetails) {
      dispatch(getOrderDetailsAction(orderId));
    }

    return () => {
      dispatch(userActions.setOrderDetails(null));
    };
  }, []);

  useEffect(() => {
    if (!orderDetails || !(orderDetails.orderItems[0].fileKeys || []).length) {
      return;
    }

    const uploadedFiles: IFileData[] = orderDetails.orderItems[0].fileKeys.map((fileKey) => ({
      file: {
        name: fileKey.filename || fileKey.s3Key,
      },
      fileKey,
      loadState: LoadStates.IDLE,
    } as IFileData));
    setFiles(uploadedFiles);
  }, [orderDetails]);

  const updateFileData = (file: IFileData, state: LoadStates, data?: IFileKey) => {
    setFiles((prev) => prev.map((item) => {
      if (item.file.name === file.file.name) {
        return {
          ...item,
          loadState: state,
          fileKey: data,
        };
      }
      return item;
    }));
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles && orderDetails) {
      const addedFiles = acceptedFiles.map((file) => ({
        file,
        loadState: LoadStates.LOADING,
        link: '',
      }));

      setFiles([...files, ...addedFiles]);

      addedFiles.map(async (file) => {
        await dispatch(uploadFileAction(updateFileData, file));
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/pdf': ['.pdf'],
    },
    maxSize: 1048576 * 100,
  });

  const handleCompleteFilesUpload = async () => {
    if ((isEdit || files.length > 0) && orderDetails) {
      const fileKeys = files.reduce(
        (attaches, f) => {
          if (!f.fileKey) return attaches;

          return [...attaches, f.fileKey];
        },
        [] as IFileKey[],
      );

      if (!isEdit && !fileKeys.length) return;

      try {
        toggleIsLoading(true);

        await dispatch(completeFilesUploadAction(
          {
            itemId: orderDetails.orderItems[0].id,
            fileKeys,
            fileKeysToDelete: deletedFiles,
          },
          orderDetails.id,
        ));

        await dispatch(getOrdersAction(getQueries(query)));

        toggleIsLoading(false);
        close(false);
      } catch (e) {
        toggleIsLoading(false);
      }
    }
  };

  const handleClose = (file: IFileData, fileErr: IFileData[]) => {
    setFiles(fileErr.filter((f) => f.file.name !== file.file.name));
    if (file.fileKey && file.fileKey.s3Key) {
      setDeletedFiles((prev) => [...prev, file.fileKey!.s3Key]);
    }
    toggleIsEdit(true);
  };

  const handleCloseOnLoading = (file: IFileData, fileErr: IFileData[]) => {
    if (file.loadState !== LoadStates.LOADING) return;

    handleClose(file, fileErr);
  };

  return (
    <Background close={close}>
      {orderDetails ? (
        <Content onClick={(evt) => evt.stopPropagation()}>
          <OrderInfo orderDetails={orderDetails} />
          <Workspace>
            <Header>
              Upload Files
              <CloseIcon handler={close} />
            </Header>
            <Wrap {...getRootProps()}>
              {(files.length > 0 && !isDragActive) ? (
                <>
                  <FilesWrapper onClick={(evt) => evt.stopPropagation()}>
                    {files.map((file, i) => (
                      <FileItem key={file.file.name + i}>
                        <FileInfo>
                          {file.loadState === LoadStates.LOADING && (
                          <LoadingFile
                            isPointer={file.loadState === LoadStates.LOADING}
                            onClick={() => handleCloseOnLoading(file, files)}
                          >
                            <CloseIcon />
                            <Loader color="#ffffff4d" size={45} />
                          </LoadingFile>
                          )}
                          {file.loadState === LoadStates.IDLE && <AddedFileIcon />}
                          {file.loadState === LoadStates.ERROR && (
                          <FailedAddFileIcon />
                          )}
                          <div>
                            <FileName>
                              {file.loadState !== LoadStates.ERROR
                                ? file.file.name
                                : 'Your file failed.'}
                            </FileName>
                            {file.file.size && (
                            <FileSize>
                              {(file.file.size / 1024 ** 2).toFixed(2)}
                              {' '}
                              MB
                            </FileSize>
                            )}
                          </div>
                        </FileInfo>
                        {file.loadState !== LoadStates.LOADING && (
                        <RemoveFile onClick={() => handleClose(file, files)}>
                          <CloseIcon />
                        </RemoveFile>
                        )}
                      </FileItem>
                    ))}
                  </FilesWrapper>
                  <AddMore>
                    <PlusIcon />
                    <Gap />
                    {' '}
                    Add more files
                    <input
                      id="add-file-input"
                      type="file"
                      name="add-file-input"
                      multiple
                      accept="text/pdf,.pdf"
                      {...getInputProps()}
                    />
                  </AddMore>
                </>
              ) : (
                <DropArea>
                  <StyledAddFileIcon />
                  <DropAreaMainText>Select a PDF file to upload</DropAreaMainText>
                  <DropAreaAdditionalText>
                    or drag and drop it here
                  </DropAreaAdditionalText>
                  <Browse>
                    Browse File
                    <input
                      id="file-input"
                      type="file"
                      name="file-input"
                      multiple
                      accept="text/pdf,.pdf"
                      {...getInputProps()}
                    />
                  </Browse>
                </DropArea>
              )}
            </Wrap>

            {(files.length > 0 || isEdit) && (
              <Buttons>
                <Button isCancel onClick={close}>
                  Cancel
                </Button>
                <Button
                  disabled={isEdit ? isFilesLoading : !files.length || isFilesLoading}
                  onClick={handleCompleteFilesUpload}
                >
                  {isLoading ? (
                    <Loader size={24} thickness={2} color="#fff" />
                  ) : (
                    'Submit'
                  )}
                </Button>
              </Buttons>
            )}
          </Workspace>
        </Content>
      ) : (
        <Loader color="#fff" />
      )}
    </Background>
  );
};

const Wrap = styled.div`
  min-width: 500px;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  row-gap: 26px;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 3fr 4fr;
  grid-gap: 32px;
  padding: 32px 22px 32px 32px;
  border-radius: 16px;
  max-width: 1000px;
  background-color: #fff;
  cursor: default;
`;

const Workspace = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-gap: 16px;
  margin-bottom: 32px;
  font-size: 24px;
  font-weight: 600;
  margin-right: 10px;

  svg {
    cursor: pointer;
  }
`;

const FilesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  
  max-height: calc(90vh - 210px);
  overflow-y: auto;
  padding-right: 10px;

  width: calc(100% - 4px);

  &::-webkit-scrollbar-thumb {
    outline: 2px solid transparent;
    height: 20%;
    width: 20%;
    background-color: rgba(176, 176, 176, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar {
    transition: all 0.3s ease-in;
    width: 5px;
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    box-shadow: inset 0 0 0 transparent;
    -webkit-box-shadow: inset 0 0 0 transparent;
    margin: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(176, 176, 176, 0.3);
  }
`;

const DropArea = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 70px;
  border: 1px dashed #bebebe;
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
  color: #6c7278;
`;

const Browse = styled.label`
  padding: 16px 20px;
  border-radius: 4px;
  font-weight: 500;
  color: #fff;
  background-color: var(--primary-green-color);
  cursor: pointer;
  transition: all 0.3s ease;

  :hover {
    background-color: var(--primary-green-hover-color);
  }
`;

const FileItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-gap: 24px;
  padding: 28px;
  max-width: 100%;
  border-radius: 10px;
  background-color: #edf1f3;
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
  width: 280px;
  font-size: 18px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileSize = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #6c7278;
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

  transition: all 0.3s ease;
  :hover {
    background-color: #c8c8c8;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  grid-gap: 16px;
  margin-right: 10px;
  padding-top: 12px;

  button {
    height: 48px;
    transition: all 0.3s ease;
  }
`;

const AddMore = styled.label`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: -0.03em;
  color: var(--primary-green-color);
  cursor: pointer;
  transition: all 0.3s ease;

  :hover {
    opacity: 0.8;
  }

  & > input {
    display: none;
    width: 0;
    height: 0;
  }
`;

const LoadingFile = styled.div<{ isPointer: boolean }>`
  flex: 0 0 60px;
  width: 60px;
  height: 60px;
  background: #27a376;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;

  ${({ isPointer }) => isPointer
    && css`
      cursor: pointer;
    `}

  & svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    fill: #ffffff;
    path {
      stroke: #ffffff;
    }
  }

  &:hover {
    opacity: 0.8;
  }
`;

const Gap = styled.span`
  flex: 0 0 12px;
  width: 12px;
`;

export default ManuallyFulfillment;
