import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem('admin_token');
  return (
    <Route {...rest} render={props => (token ? <Component {...props} /> : <Redirect to="/admin/login" />)} />
  );
};

export default PrivateRoute;