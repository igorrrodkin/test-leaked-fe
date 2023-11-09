import React from 'react';

import FramedBlock from '@/components/Settings/Users/FramedBlock';
import UsersBlock from '@/components/Settings/Users/UsersBlock';

interface IGeneralInfo {
  title: string;
  subtitle: string;
  handleBtnClick: () => void;
}

const GeneralUsersInfo: React.FC<IGeneralInfo> = ({
  title,
  subtitle,
  handleBtnClick,
}) => (
  <UsersBlock title="Users">
    <FramedBlock
      title={title}
      subtitle={subtitle}
      btnText="+ Add new user"
      handleBtnClick={handleBtnClick}
    />
  </UsersBlock>
);

export default GeneralUsersInfo;
