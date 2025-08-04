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
import PaymentHistory from "./views/payements/PaymentHistory"; // Ajoute cette ligne
import AccessList from "./views/access/AccessList";
import TypeAbonnementList from "./views/parametrage/TypeAbonnementList";
import RegleTarificationList from "./views/parametrage/RegleTarificationList";
import HoraireOuvertureList from "./views/parametrage/HoraireOuvertureList";
import Statistiques from "./views/Statistiques/statistiques"; // adapte le chemin si nécessaire





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
       { path: "/payements/historique", element: <PaymentHistory />, auth: authRoles.admin },
       {path: "/access",element: <AccessList />, auth: authRoles.admin},
       { path: "/parametrage/type-abonnement", element: <TypeAbonnementList />, auth: authRoles.admin },
       { path: "/parametrage/regle-tarification", element: <RegleTarificationList />, auth: authRoles.admin },
        { path: "/parametrage/horaire-ouverture", element: <HoraireOuvertureList />, auth: authRoles.admin },
     {
  path: "/statistiques",
  element: <Statistiques />,
}
   
      
    ]
  },

  // session pages route
  ...sessionRoutes
];

export default routes;
