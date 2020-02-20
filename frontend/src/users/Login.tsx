import React, { FunctionComponent } from 'react';
import { IAuthService } from '../common/AuthService';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ROUTES } from '../constants';
import withService from '../common/WithService';

type LoginProps = {
  authService: IAuthService;
};

const fakeUser = {
  email: 'lukasz@black.com',
  password: 'password',
};

const Login: FunctionComponent<LoginProps & RouteComponentProps> = ({
  authService,
  history,
}) => {
  React.useEffect(() => {
    if (!authService.isAuthenticated()) {
      authService
        .login(fakeUser.email, fakeUser.password)
        .then(() => history.push(ROUTES.root))
        .catch(err => console.error('Effect login error: ', err));
    }
  }, [authService, history]);
  return <div>Hello!</div>;
};

export default withService('authService')(withRouter(Login));
