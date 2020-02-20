import * as React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';

const Main: React.SFC = ({ children }) => (
  <main data-main="root-component">
    <Link to={ROUTES.songs}>songs</Link>
    <Link to={ROUTES.login}>login</Link>
    {children}
  </main>
);

export default Main;
