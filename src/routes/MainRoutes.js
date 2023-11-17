import { lazy, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { AuthContext } from 'contexts/AuthContext';

// dashboard routing
const DashboardDefault = Loadable(
  lazy(() => import('views/dashboard/Default'))
);

// utilities routing
const UtilsTypography = Loadable(
  lazy(() => import('views/utilities/Typography'))
);
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(
  lazy(() => import('views/utilities/MaterialIcons'))
);
const UtilsTablerIcons = Loadable(
  lazy(() => import('views/utilities/TablerIcons'))
);

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// tfu page
const ListTFU = Loadable(lazy(() => import('views/tfu')));
const ViewTFU = Loadable(lazy(() => import('views/tfu/ViewData')));
const OfflineAssesmentTFU = Loadable(
  lazy(() => import('views/tfu/AssesmentOffline'))
);
const OnlineAssesmentTFU = Loadable(lazy(() => import('views/tfu/Assesment')));
const ReportTFU = Loadable(lazy(() => import('views/tfu/Report')));

// tpp page
const ListTPP = Loadable(lazy(() => import('views/tpp')));
const ViewTPP = Loadable(lazy(() => import('views/tpp/ViewData')));
const OfflineAssesmentTPP = Loadable(
  lazy(() => import('views/tpp/AssesmentOffline'))
);
const OnlineAssesmentTPP = Loadable(lazy(() => import('views/tpp/Assesment')));
const ReportTPP = Loadable(lazy(() => import('views/tpp/Report')));

// healthy house page
const ListHealthyHouse = Loadable(lazy(() => import('views/healthyHouse')));
const ViewHealthyHouse = Loadable(
  lazy(() => import('views/healthyHouse/ViewData'))
);
const OfflineAssesmentHealthyHouse = Loadable(
  lazy(() => import('views/healthyHouse/AssesmentOffline'))
);
const OnlineAssesmentHealthyHouse = Loadable(
  lazy(() => import('views/healthyHouse/Assesment'))
);

// sanitary page
const ListSanitary = Loadable(lazy(() => import('views/sanitary')));
const ViewSanitary = Loadable(lazy(() => import('views/sanitary/ViewData')));
const OnlineAssesmentSanitary = Loadable(
  lazy(() => import('views/sanitary/Assesment'))
);
const CounselingSanitary = Loadable(
  lazy(() => import('views/sanitary/Counseling'))
);

// water page
const ListWater = Loadable(lazy(() => import('views/water')));
const ViewWater = Loadable(lazy(() => import('views/water/ViewData')));
const FormInitWater = Loadable(
  lazy(() => import('views/water/FormGeneralInfo'))
);
const FormInspectWater = Loadable(
  lazy(() => import('views/water/FormInspection'))
);
const OfflineAssesmentWater = Loadable(
  lazy(() => import('views/water/AssesmentOffline'))
);
const OnlineAssesmentWater = Loadable(
  lazy(() => import('views/water/Assesment'))
);

// master-data
const Users = Loadable(lazy(() => import('views/master-data/user')));
const Puskesmas = Loadable(lazy(() => import('views/master-data/puskesmas')));
const Residents = Loadable(lazy(() => import('views/master-data/warga')));
const Documents = Loadable(lazy(() => import('views/master-data/documents')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = (isAuth) => {
  // const { getDataUser } = useContext(AuthContext);

  return {
    path: '/',
    element: isAuth ? <MainLayout /> : <Navigate to="/login" />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard/default" />
      },
      {
        path: '/dashboard',
        element: <Navigate to="/dashboard/default" />
      },
      {
        path: 'dashboard',
        children: [
          {
            path: 'default',
            element: <DashboardDefault />
          }
        ]
      },

      {
        path: 'tfu',
        permission: 'tfu:all',
        children: [
          {
            path: '',
            permission: 'tfu:read',
            element: <ListTFU />
          },
          {
            path: 'view/:_id',
            permission: 'tfu:read',
            element: <ViewTFU />
          },
          {
            path: 'report',
            children: [
              {
                path: '',
                element: <ReportTFU />
              },
              {
                path: 'recap',
                element: <ReportTFU />
              }
            ]
          },
          {
            path: 'assesment/offline/:type/:_id',
            permission: 'tfu:assesment',
            element: <OfflineAssesmentTFU />
          },
          {
            path: 'assesment/online/:type/:_id',
            permission: 'tfu:assesment',
            element: <OnlineAssesmentTFU />
          }
        ]
      },
      {
        path: 'tpp',
        permission: 'tpp:all',
        children: [
          {
            path: '',
            permission: 'tpp:read',
            element: <ListTPP />
          },
          {
            path: 'view/:_id',
            permission: 'tpp:read',
            element: <ViewTPP />
          },
          {
            path: 'report',
            children: [
              {
                path: '',
                element: <ReportTPP />
              },
              {
                path: 'recap',
                element: <ReportTPP />
              }
            ]
          },
          {
            path: 'assesment/offline/:type/:_id',
            permission: 'tpp:assesment',
            element: <OfflineAssesmentTPP />
          },
          {
            path: 'assesment/online/:type/:_id',
            permission: 'tpp:assesment',
            children: [
              {
                path: '',
                element: <OnlineAssesmentTPP />
              }
            ]
          }
        ]
      },
      {
        path: 'healthy-house',
        permission: 'hh:all',
        children: [
          {
            path: '',
            permission: 'hh:read',
            element: <ListHealthyHouse />
          },

          {
            path: 'view/:_id',
            permission: 'hh:read',
            element: <ViewHealthyHouse />
          },
          // {
          //   path: 'report',
          //   children: [
          //     {
          //       path: '',
          //       element: <ReportHealthyHouse />
          //     },
          //     {
          //       path: 'recap',
          //       element: <ReportHealthyHouse />
          //     }
          //   ]
          // }
          {
            path: 'assesment/offline/:type/:_id',
            permission: 'hh:assesment',
            element: <OfflineAssesmentHealthyHouse />
          },
          {
            path: 'assesment/online/:type/:_id',
            permission: 'hh:assesment',
            children: [
              {
                path: '',
                element: <OnlineAssesmentHealthyHouse />
              }
            ]
          }
        ]
      },
      {
        path: 'sanitary',
        permission: 'sanitary:all',
        children: [
          {
            path: '',
            permission: 'sanitary:read',
            element: <ListSanitary />
          },

          {
            path: 'view/:_id',
            permission: 'sanitary:read',
            element: <ViewSanitary />
          },
          // {
          //   path: 'report',
          //   children: [
          //     {
          //       path: '',
          //       element: <ReportHealthyHouse />
          //     },
          //     {
          //       path: 'recap',
          //       element: <ReportHealthyHouse />
          //     }
          //   ]
          // }
          {
            path: 'assesment/online/:_id',
            permission: 'sanitary:assesment',
            element: <OnlineAssesmentSanitary />
          },
          {
            path: 'counseling/:_id',
            permission: 'sanitary:assesment',
            element: <CounselingSanitary />
          }
          // {
          //   path: 'assesment/online/:type/:_id',
          //   children: [
          //     {
          //       path: '',
          //       element: <OnlineAssesmentHealthyHouse />
          //     }
          //   ]
          // }
        ]
      },
      {
        path: 'water',
        permission: 'water:all',
        children: [
          {
            path: '',
            permission: 'water:read',
            element: <ListWater />
          },
          {
            path: 'view/:_id',
            permission: 'water:read',
            element: <ViewWater />
          },
          {
            path: 'form',
            children: [
              {
                path: '',
                permission: 'water:add',
                element: <FormInitWater />
              },
              {
                path: 'inspect',
                permission: 'water:add',
                element: <FormInspectWater />
              }
            ]
          },
          // {
          //   path: 'report',
          //   children: [
          //     {
          //       path: '',
          //       element: <ReportWater />
          //     },
          //     {
          //       path: 'recap',
          //       element: <ReportWater />
          //     }
          //   ]
          // }
          {
            path: 'assesment/offline/:type/:_id',
            permission: 'water:assesment',
            element: <OfflineAssesmentWater />
          },
          {
            path: 'assesment/online/:type/:_id',
            permission: 'water:assesment',
            children: [
              {
                path: '',
                element: <OnlineAssesmentWater />
              }
            ]
          }
        ]
      },
      {
        path: 'master-data',
        children: [
          {
            path: 'users',
            permission: 'user:read',
            element: <Users />
          },
          {
            path: 'puskesmas',
            permission: 'puskesmas:read',
            element: <Puskesmas />
          },
          {
            path: 'document',
            permission: 'document:read',
            element: <Documents />
          },
          {
            path: 'residents',
            permission: 'resident:read',
            element: <Residents />
          }
        ]
      }
    ]
  };
};

export default MainRoutes;
