import React from 'react';
import { ROUTES } from '../constants';
import { Route, Switch } from 'react-router-dom';
import Login from './Login';

const UsersRoutes: React.FunctionComponent = () => (
  <Switch>
    <Route exact path={ROUTES.login} component={Login} />
  </Switch>
);

export default UsersRoutes;
