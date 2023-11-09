import React, { useEffect } from 'react';
import TagManager from 'react-gtm-module';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router';
import { Route, Routes } from 'react-router-dom';
import { useIntercom } from 'react-use-intercom';
import styled from 'styled-components';

import ResetPassword from '@/components/Auth/GetResetLink';
import LoginNow from '@/components/Auth/LoginNow';
import UpdatePassword from '@/components/Auth/UpdatePassword';
import AuthRouter from '@/components/AuthRouter';
import InvoiceDetails from '@/components/Billing/InvoiceDetails';
import { InvoiceDetailsMatters } from '@/components/Billing/InvoiceDetailsMatters';
import { InvoiceDetailsOrders } from '@/components/Billing/InvoiceDetailsOrders';
import { InvoiceDetailsPDF } from '@/components/Billing/InvoiceDetailsPDF';
import { InvoiceDetailsRefunds } from '@/components/Billing/InvoiceDetailsRefunds';
import InvoicesTab from '@/components/Billing/InvoicesTab';
import PaymentCreditsTab from '@/components/Billing/PaymentCreditsTab';
import SummaryTab from '@/components/Billing/SummaryTab';
import LogsListDetail from '@/components/LogsList/LogsListDetail';
import LogsTableContainer from '@/components/LogsList/LogsTableContainer';
import Menu from '@/components/Menu';
import Notice from '@/components/Notices/Notice';
import ProtectedListResultPage from '@/components/OrderDetails/ListResultPage';
import OrganisationAPIKeys from '@/components/OrganisationSettings/OrganisationAPIKeys';
import OrganisationDetails from '@/components/OrganisationSettings/OrganisationDetails';
import PageHeader from '@/components/PageHeader';
import Popup from '@/components/Popup';
import PriceListDetail from '@/components/PriceList/PriceListDetail';
import PriceListsPage from '@/components/PriceList/PriceListsPage';
import ProtectedRouter from '@/components/ProtectedRouter';
import SettingsAddNewCard from '@/components/Settings/Billing/SettingsAddNewCard';
import SettingsBilling from '@/components/Settings/Billing/SettingsBilling';
import MyDetails from '@/components/Settings/MyDetails';
import Preferences from '@/components/Settings/Preferences/Preferences';
import SettingsUsers from '@/components/Settings/Users/SettingsUsers';

import AddOrder from '@/pages/AddOrder';
import AllServices from '@/pages/AllServices';
import ApiKeys from '@/pages/ApiKeys';
import Auth from '@/pages/Auth';
import Billings from '@/pages/billings/Billings';
import Invoices from '@/pages/billings/Invoices';
import PaymentCredits from '@/pages/billings/PaymentCredits';
import Summary from '@/pages/billings/Summary';
import GlobalSearchPage from '@/pages/GlobalSearchPage';
import LogsLists from '@/pages/LogsLists';
import { NotFound } from '@/pages/NotFound';
import Notices from '@/pages/Notices';
import OrderDetails from '@/pages/OrderDetails';
import Orders from '@/pages/Orders';
import OrganisationBilling from '@/pages/OrganisationBilling';
import Organisations from '@/pages/Organisations';
import OrganisationSettings from '@/pages/OrganisationSettings';
import PriceList from '@/pages/PriceList';
import PriceLists from '@/pages/PriceLists';
import Privacy from '@/pages/Privacy';
import Registration from '@/pages/Registration';
import ReportingPage from '@/pages/Reporting';
import Services from '@/pages/Services';
import Settings from '@/pages/Settings';
import TermsOfService from '@/pages/TermsOfService';
import Users from '@/pages/Users';

import { Roles } from '@/store/reducers/user';

import { selectServicesModal } from '@/store/selectors/servicesSelector';
import { selectPopup, selectUser } from '@/store/selectors/userSelectors';

import GlobalStyle from '@/utils/getNormalizedCSS';
import { ExistingRegions } from '@/utils/getRegionsData';
import Logger from '@/utils/logger';

const App = () => {
  const user = useSelector(selectUser);
  const popup = useSelector(selectPopup);
  const servicesModal = useSelector(selectServicesModal);
  const { boot, update } = useIntercom();
  const location = useLocation();

  useEffect(() => {
    boot();
  }, []);

  useEffect(() => {
    if (user) {
      update({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        userId: user.id.toString(),
        createdAt: new Date().getTime().toString(),
        phone: user.phone,
        avatar: {
          type: 'avatar',
          imageUrl: '',
        },
        company: {
          companyId: user.organisations[0].id.toString(),
          name: user.organisations[0].name,
        },
      });
    }
  }, [user]);

  useEffect(() => {
    if (user && window) {
      TagManager.dataLayer({
        dataLayer: {
          event: 'pageview',
          pagePath: `${location.pathname}`,
          pageUrl: `${window.location.href}`,
          pageTitle: `${location.pathname.replaceAll('/', ' ').toUpperCase()}`,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          userId: user.id.toString(),
          createdAt: new Date().getTime().toString(),
          userRole: user.role,
        },
      });
    }
  }, [user, location]);

  Logger.initialize();

  return (
    <GlobalContainer>
      <GlobalStyle />
      <Routes>
        <Route
          path="/"
          element={(
            <ProtectedRouter>
              <Navigate to="/dashboard/matters" replace />
            </ProtectedRouter>
          )}
        />
        <Route
          path="/sign-in"
          element={(
            <AuthRouter>
              <Auth />
            </AuthRouter>
          )}
        />
        <Route
          path="/sign-up"
          element={(
            <AuthRouter>
              <Registration />
            </AuthRouter>
          )}
        />
        <Route
          path="/login-now/*"
          element={(
            <AuthRouter>
              <LoginNow />
            </AuthRouter>
          )}
        />
        <Route
          path="/verify-now/*"
          element={(
            <AuthRouter>
              <LoginNow />
            </AuthRouter>
          )}
        />
        <Route
          path="/forgot-password"
          element={(
            <AuthRouter>
              <ResetPassword />
            </AuthRouter>
          )}
        />
        <Route
          path="/update-password/*"
          element={(
            <AuthRouter>
              <UpdatePassword />
            </AuthRouter>
          )}
        />
        <Route
          path="/terms-of-service"
          element={<TermsOfService />}
        />
        <Route
          path="/privacy"
          element={<Privacy />}
        />
        <Route
          path="/*"
          element={(
            <ProtectedRouter>
              <Menu />
              <ContentContainer>
                {servicesModal && <AllServices />}
                <PageHeader />
                <Notice />
                <Routes>
                  <Route
                    path="/dashboard/orders/:organisationId/:matterId"
                    element={<OrderDetails />}
                  />
                  <Route
                    path="/dashboard/orders/:orderId"
                    element={<ProtectedListResultPage />}
                  />
                  <Route path="/dashboard/*" element={<Orders />} />
                  <Route path="/reporting" element={<ReportingPage />} />
                  <Route path="/all" element={<AddOrder region={ExistingRegions.ALL} />} />
                  <Route path="/nsw" element={<AddOrder region={ExistingRegions.NSW} />} />
                  <Route path="/vic" element={<AddOrder region={ExistingRegions.VIC} />} />
                  <Route path="/qld" element={<AddOrder region={ExistingRegions.QLD} />} />
                  <Route path="/sa" element={<AddOrder region={ExistingRegions.SA} />} />
                  <Route path="/wa" element={<AddOrder region={ExistingRegions.WA} />} />
                  <Route path="/tas" element={<AddOrder region={ExistingRegions.TAS} />} />
                  <Route path="/act" element={<AddOrder region={ExistingRegions.ACT} />} />
                  <Route path="/nt" element={<AddOrder region={ExistingRegions.NT} />} />
                  <Route path="/global-search" element={<GlobalSearchPage />} />
                  <Route path="/price-list" element={<PriceList />} />
                  <Route path="/settings" element={<Settings />}>
                    <Route path="my-details" element={<MyDetails />} />
                    <Route path="preferences" element={<Preferences />} />
                    {(user?.role === Roles.CUSTOMER_ADMIN
                      || user?.role === Roles.SYSTEM_ADMIN) && (
                      <Route
                        path="organisation-details"
                        element={(
                          <OrganisationDetails
                            organisationId={user!.organisations[0].id}
                            organisation={user!.organisations[0]}
                            isUserSettings
                          />
                        )}
                      />
                    )}
                    {(user?.role === Roles.CUSTOMER_ADMIN
                      || user?.role === Roles.SYSTEM_ADMIN) && (
                      <Route path="users" element={<SettingsUsers />} />
                    )}
                    {(user?.role === Roles.CUSTOMER_ADMIN
                      || user?.role === Roles.SYSTEM_ADMIN) && (
                      <Route
                        path="billing"
                        element={<SettingsBilling organisation={user!.organisations[0]} />}
                      />
                    )}
                    {(user?.role === Roles.CUSTOMER_ADMIN
                      || user?.role === Roles.SYSTEM_ADMIN) && (
                      <Route
                        path="billing/add-card"
                        element={<SettingsAddNewCard />}
                      />
                    )}
                    {(user?.role === Roles.CUSTOMER_ADMIN
                      || user?.role === Roles.SYSTEM_ADMIN) && (
                      <Route
                        path="api-keys"
                        element={(
                          <OrganisationAPIKeys
                            organisationId={user!.organisations[0].id}
                          />
                        )}
                      />
                    )}
                  </Route>
                  {user?.role === Roles.SYSTEM_ADMIN ? (
                    <Route
                      path="/organisations"
                      element={<Organisations />}
                    />
                  ) : (
                    ''
                  )}
                  {user?.role === Roles.SYSTEM_ADMIN ? (
                    <Route
                      path="/organisations/:organisationId/settings/*"
                      element={<OrganisationSettings />}
                    />
                  ) : (
                    ''
                  )}
                  {user?.role === Roles.SYSTEM_ADMIN ? (
                    <Route path="/users" element={<Users />} />
                  ) : (
                    ''
                  )}
                  {user?.role === Roles.SYSTEM_ADMIN ? (
                    <Route path="/services" element={<Services />} />
                  ) : (
                    ''
                  )}
                  {user?.role === Roles.SYSTEM_ADMIN ? (
                    <Route path="/price-lists" element={<PriceLists />}>
                      <Route index element={<PriceListsPage />} />
                      <Route path=":id" element={<PriceListDetail />} />
                    </Route>
                  ) : (
                    ''
                  )}
                  {(user?.role === Roles.SYSTEM_ADMIN
                    || user?.role === Roles.CUSTOMER_ADMIN) && (
                    <Route
                      path="/billing"
                      element={<OrganisationBilling />}
                    >
                      <Route index element={<SummaryTab />} />
                      <Route path="invoices" element={<InvoicesTab />} />
                      <Route path="payments-credits" element={<PaymentCreditsTab />} />
                    </Route>
                  )}
                  {(user?.role === Roles.SYSTEM_ADMIN
                    || user?.role === Roles.CUSTOMER_ADMIN) && (
                    <Route
                      path="/billing/invoiceDetails/:invoiceNumber"
                      element={<InvoiceDetails startLink="billing" visitedFrom="/billing/invoices" />}
                    >
                      <Route index element={<InvoiceDetailsPDF />} />
                      <Route path="matters" element={<InvoiceDetailsMatters />} />
                      <Route path="orders" element={<InvoiceDetailsOrders />} />
                      <Route path="payments-credits" element={<InvoiceDetailsRefunds />} />
                    </Route>
                  )}
                  {user?.role === Roles.SYSTEM_ADMIN && (
                    <Route path="/api-keys" element={<ApiKeys />} />
                  )}
                  {user?.role === Roles.SYSTEM_ADMIN && (
                    <Route
                      path="/notices"
                      element={<Notices />}
                    />
                  )}
                  {user?.role === Roles.SYSTEM_ADMIN && (
                    <Route path="/logs" element={<LogsLists />}>
                      <Route index element={<LogsTableContainer />} />
                      <Route path=":id" element={<LogsListDetail />} />
                    </Route>
                  )}
                  {user?.role === Roles.SYSTEM_ADMIN && (
                    <Route
                      path="/billings"
                      element={<Billings />}
                    >
                      <Route index element={<Summary />} />
                      <Route path="invoices" element={<Invoices />} />
                      <Route path="payments-credits" element={<PaymentCredits />} />
                    </Route>
                  )}
                  {(user?.role === Roles.SYSTEM_ADMIN
                    || user?.role === Roles.CUSTOMER_ADMIN) && (
                    <Route
                      path="/billings/invoiceDetails/:invoiceNumber"
                      element={<InvoiceDetails startLink="billings" visitedFrom="/billings/invoices" />}
                    >
                      <Route index element={<InvoiceDetailsPDF />} />
                      <Route path="matters" element={<InvoiceDetailsMatters />} />
                      <Route path="orders" element={<InvoiceDetailsOrders />} />
                      <Route path="payments-credits" element={<InvoiceDetailsRefunds />} />
                    </Route>
                  )}
                  <Route path="/notFound" element={<NotFound />} />
                  <Route
                    path="*"
                    element={<Navigate to="/dashboard/matters" replace />}
                  />
                </Routes>
              </ContentContainer>
            </ProtectedRouter>
          )}
        />
      </Routes>
      {popup ? (
        <Popup
          type={popup.type}
          mainText={popup.mainText}
          additionalText={popup.additionalText}
          applyTimeout={popup.applyTimeout}
        />
      ) : (
        ''
      )}
    </GlobalContainer>
  );
};

const GlobalContainer = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  min-height: 100vh;
  overflow: hidden;
`;

const ContentContainer = styled.div`
  position: relative;
  min-height: inherit;
  padding-top: var(--search-height);
  padding-left: var(--sidebar-width);
`;

export default App;
