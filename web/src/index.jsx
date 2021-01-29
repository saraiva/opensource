import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { createBrowserHistory } from 'history';
import { routerMiddleware, ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import App from './App';
import './index.css';
import Login from './pages/Login/Login';
import Install from './pages/Install/Install';
import Dashboard from './pages/Dashboard/Dashboard';
import RequireInstall from './containers/RequireInstall';
import RequireAuth from './containers/RequireAuth';
import RequireGuest from './containers/RequireGuest';

const history = createBrowserHistory();

// We get the token from the store to initialise the store.
// So we know if the user is still signed in.
function getAuthState() {
  try {
    const token = localStorage.getItem('token') || null;
    const expire = localStorage.getItem('expire') || null;
    const username = localStorage.getItem('username') || null;
    const role = localStorage.getItem('role') || null;
    // const installed = localStorage.getItem('installed') || null;
    const difference = new Date(expire) - new Date();
    const state = {
      auth: {
        token,
        expire,
        username,
        role,
        loggedIn: difference >= 0,
        loginError: false,
        installed: true, //! !installed,
        error: '',
      },
    };
    return state;
  } catch (err) { return undefined; }
}

const store = createStore(
  rootReducer(history),
  { ...getAuthState() },
  composeWithDevTools(
    applyMiddleware(
      thunk,
      routerMiddleware(history),
    ),
  ),
);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/install" component={RequireInstall(Install)} />
        <Route path="/login" component={RequireGuest(Login)} />
        <App>
          <Route exact path="/" component={RequireAuth(Dashboard)} />
        </App>
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
);
