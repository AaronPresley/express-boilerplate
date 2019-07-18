import * as React from 'react';
import * as reactDom from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Global } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';

import App from './app';
import configureStore from './state/store';
import theme, { globalStyles } from './styles';

const store = configureStore();

reactDom.render(
  <Provider store={store}>
    <Router>
      <ThemeProvider theme={theme}>
        <Global styles={globalStyles} />
        <App />
      </ThemeProvider>
    </Router>
  </Provider>,
  document.getElementById('root'),
);
