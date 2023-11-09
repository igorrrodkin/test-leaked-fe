import {
  applyMiddleware,
  combineReducers,
  compose,
  legacy_createStore as createStore,
} from 'redux';
import thunk from 'redux-thunk';

import { ApiKeyActions } from '@/store/actions/apiKeyActions';
import { InvoiceActions } from '@/store/actions/billingActions';
import { LogsActions } from '@/store/actions/logsActions';
import { NoticesActions } from '@/store/actions/noticesActions';
import { OrderActions } from '@/store/actions/orderActions';
import { OrganisationsActions } from '@/store/actions/organisationsActions';
import { PriceListActions } from '@/store/actions/priceListActions';
import { ReportsActions } from '@/store/actions/reportsActions';
import { ServicesActions } from '@/store/actions/servicesActions';
import { UserActions } from '@/store/actions/userActions';
import { UsersActions } from '@/store/actions/usersActions';

import ApiKeyReducer from '@/store/reducers/apiKey';
import InvoiceReducer from '@/store/reducers/billing';
import LogsReducer from '@/store/reducers/logs';
import NoticesReducer from '@/store/reducers/notices';
import OrderReducer from '@/store/reducers/order';
import OrganisationsReducer from '@/store/reducers/organisations';
import PriceListReducer from '@/store/reducers/priceList';
import ReportsReducer from '@/store/reducers/reports';
import ServicesReducer from '@/store/reducers/services';
import UserReducer from '@/store/reducers/user';
import UsersReducer from '@/store/reducers/users';

import {
  mainApi,
  mainApiProtected,
  mainAuthApi,
  mainAuthApiProtected,
  s3Api as S3Api,
} from '@/api';

const rootReducer = combineReducers({
  user: UserReducer,
  order: OrderReducer,
  organisations: OrganisationsReducer,
  notices: NoticesReducer,
  services: ServicesReducer,
  priceList: PriceListReducer,
  users: UsersReducer,
  reports: ReportsReducer,
  apiKey: ApiKeyReducer,
  logs: LogsReducer,
  billing: InvoiceReducer,
});

export const api = {
  mainApi,
  mainApiProtected,
  S3Api,
  mainAuthApi,
  mainAuthApiProtected,
};

const composeEnhancer = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export const enhancer = composeEnhancer(
  applyMiddleware(thunk.withExtraArgument(api)),
);

const store = createStore(rootReducer, enhancer);

export type AppDispatch = typeof store.dispatch;

export type State = ReturnType<typeof rootReducer>;

export type Actions = UserActions
| OrderActions
| OrganisationsActions
| NoticesActions
| ServicesActions
| PriceListActions
| UsersActions
| ReportsActions
| ApiKeyActions
| LogsActions
| InvoiceActions;

export default store;
