import { Navigate, Route, Routes } from 'react-router-dom';

import MattersTableContainer from '@/components/Matters/MattersTableContainer';
import OrdersTableContainer from '@/components/Orders/OrdersTableContainer';

const Matters = () => (
  <Routes>
    <Route path="/" element={<MattersTableContainer />} />
    <Route path="/orders" element={<OrdersTableContainer />} />
    <Route
      path="*"
      element={<Navigate to="/dashboard/matters" replace />}
    />
  </Routes>
);

export default Matters;
