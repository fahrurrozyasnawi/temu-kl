import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// login option 3 routing
const AuthLogin3 = Loadable(
  lazy(() => import('views/pages/authentication/authentication3/Login3'))
);
const AuthRegister3 = Loadable(
  lazy(() => import('views/pages/authentication/authentication3/Register3'))
);

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = (isAuth) => {
  return {
    path: '/',
    element: !isAuth ? <MinimalLayout /> : <Navigate to="/dashboard" />,
    children: [
      {
        path: '/login',
        element: <AuthLogin3 />
      },
      {
        path: '/register',
        element: <AuthRegister3 />
      }
    ]
  };
};

export default AuthenticationRoutes;
