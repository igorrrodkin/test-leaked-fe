import { Roles } from '@/store/reducers/user';

export default (role: Roles) => {
  switch (role) {
    case Roles.CUSTOMER: return 'User';
    case Roles.CUSTOMER_ADMIN: return 'Admin';
    case Roles.SYSTEM_ADMIN: return 'System Admin';
  }
};
