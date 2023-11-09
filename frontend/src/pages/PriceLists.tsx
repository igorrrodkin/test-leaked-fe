import { Outlet } from 'react-router-dom';

import PageContainer from '@/components/PageContainer';

const PriceLists = () => (
  <PageContainer contentPadding="32px 0">
    <Outlet />
  </PageContainer>
);

export default PriceLists;
