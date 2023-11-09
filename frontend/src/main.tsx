import React from 'react';
import ReactDOM from 'react-dom/client';
import TagManager from 'react-gtm-module';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { IntercomProvider } from 'react-use-intercom';

import App from '@/App';
import store from '@/store';

const GTM_ID = 'GTM-MH4V422';

const tagManagerArgs = {
  gtmId: GTM_ID,
  dataLayer: {
    userId: 'visitor-id',
    userProject: 'Alts-Corp',
  },
};

TagManager.initialize(tagManagerArgs);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <IntercomProvider appId={process.env.INTERCOM_APP_ID!} autoBoot>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </IntercomProvider>
  </Provider>,
);
