import React, { FunctionComponent } from 'react';
//import loadable from '@loadable/component';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ROUTES } from './constants';
import SongsRoute from './songs';
import MainRoute from './main';
import UsersRoutes from './users/UserRoutes';

const Routes: FunctionComponent = () => (
  <BrowserRouter>
    <Switch>
      <Route path={ROUTES.users} component={UsersRoutes} />
      <Route exact path={ROUTES.root} component={MainRoute} />
      <Route path={ROUTES.songs} component={SongsRoute} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
