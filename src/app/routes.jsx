import { lazy } from "react";
import { Navigate } from "react-router-dom";

import AuthGuard from "./auth/AuthGuard";
import { authRoles } from "./auth/authRoles";


import Loadable from "./components/Loadable";
import MatxLayout from "./components/MatxLayout/MatxLayout";
import sessionRoutes from "./views/sessions/session-routes";


import UserList from "./views/utilisateurs/UserList";
import AbonnementsList from "app/views/abonnements/AbonnementsList";
import ReservationList from "./views/reservation/reservationlist";
import PaymentPage from "./views/payements/PaymentPage";


// DASHBOARD PAGE
const Analytics = Loadable(lazy(() => import("app/views/dashboard/Analytics")));
const routes = [
  { path: "/", element: <Navigate to="dashboard/default" /> },
  
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),

    children: [
      // dashboard route
      { path: "/dashboard/default", element: <Analytics />, auth: authRoles.admin },
      {path: "/utilisateurs", element: <UserList />,auth: authRoles.admin },
      { path: "/abonnements", element: <AbonnementsList />, auth: authRoles.admin },
      { path: "/reservation", element: <ReservationList />, auth: authRoles.admin },
       { path: "/payements", element: <PaymentPage />, auth: authRoles.admin },
   
      
    ]
  },

  // session pages route
  ...sessionRoutes
];

export default routes;
