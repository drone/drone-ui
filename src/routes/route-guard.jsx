import PropTypes from 'prop-types';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import { VISIBILITY_LEVELS } from '_constants';
import NotFound from 'pages/not-found';

export default function RouteGuard(props) {
  const {
    component: Component, visibility, componentProps, children, ...rest
  } = props;
  const { user } = componentProps;
  const isUserAuthenticated = !!user;
  const isUserAdmin = user?.admin;
  const route = (
    <Route
      {...rest}
      render={(renderProps) => (Component
        ? <Component {...renderProps} {...componentProps} />
        : children)}
    />
  );
  if (
    // show if page is open to anyone
    [visibility === VISIBILITY_LEVELS.PUBLIC,
      // or show if page is open to authenticated user
      visibility === VISIBILITY_LEVELS.PRIVATE && isUserAuthenticated,
      // or show if page is open to admins
      visibility === VISIBILITY_LEVELS.ADMIN && isUserAdmin,
    ].some((cond) => !!cond)) return route;

  if (visibility !== VISIBILITY_LEVELS.PUBLIC && isUserAuthenticated === false) {
    return <Redirect to="/welcome" />;
  }
  return <NotFound user={user} />;
}

RouteGuard.propTypes = {
  component: PropTypes.func.isRequired,
  visibility: PropTypes.oneOf(Object.values(VISIBILITY_LEVELS)),
  componentProps: PropTypes.shape({
    user: PropTypes.shape({}),
  }),
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

RouteGuard.defaultProps = {
  componentProps: {},
  children: null,
  visibility: 0,
};
