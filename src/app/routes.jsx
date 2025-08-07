import { lazy } from "react";
import { Navigate } from "react-router-dom";

import AuthGuard from "./auth/AuthGuard";
import { authRoles } from "./auth/authRoles";

import Loadable from "./components/Loadable";
import MatxLayout from "./components/MatxLayout/MatxLayout";
import sessionRoutes from "./views/sessions/session-routes";

import UserForm from "./views/utilisateurs/UserForm";
import UserList from "./views/utilisateurs/UserList";

import AbonnementsList from "app/views/abonnements/AbonnementsList";
import AbonnementsForm from "app/views/abonnements/AbonnementsForm";

import ReservationList from "./views/reservation/ReservationList";
import ReservationForm from "./views/reservation/ReservationForm";

import PaymentPage from "./views/payements/PaymentPage";
import PaymentHistory from "./views/payements/PaymentHistory"; // Ajoute cette ligne

import AccessList from "./views/access/AccessList";

import TypeAbonnementList from "./views/parametrage/TypeAbonnementList";
import RegleTarificationList from "./views/parametrage/RegleTarificationList";
import HoraireOuvertureList from "./views/parametrage/HoraireOuvertureList";

import Statistiques from "./views/Statistiques/statistiques"; // adapte le chemin si nécessaire

import ReservationFormWrapper from "./views/reservation/ReservationFormWrapper";
import UserFormWrapper from "./views/utilisateurs/UserFormWrapper";




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

     { path: "/utilisateurs", element: <UserList />, auth: authRoles.admin },
     { path: "/utilisateurs/new", element: <UserFormWrapper mode="create" /> },
     { path: "/utilisateurs/edit/:id", element: <UserFormWrapper mode="edit" /> },


      {path: "/abonnements", element: <AbonnementsList />, auth: authRoles.admin,},
      {path: "/abonnements/new",element: <AbonnementsForm mode="create" />,auth: authRoles.admin},
      {path: "/abonnements/edit/:id",element: <AbonnementsForm mode="edit" />,auth: authRoles.admin},
     
      {name: 'Réservations',icon: 'event_note',children: [
      { path: '/reservation',element: <ReservationList />},
      { name: 'Liste des réservations',path: '/reservation/liste', element: <ReservationList />},
      { name: 'Ajouter une réservation', path: '/reservation/new', element: <ReservationForm />},
      { path:"/reservation/edit/:id" ,element:<ReservationFormWrapper mode="edit"/>},
  ],
},

       { path: "/payements", element: <PaymentPage />, auth: authRoles.admin },
       { path: "/payements/historique", element: <PaymentHistory />, auth: authRoles.admin },
       {path: "/access",element: <AccessList />, auth: authRoles.admin},
       { path: "/parametrage/type-abonnement", element: <TypeAbonnementList />, auth: authRoles.admin },
       { path: "/parametrage/regle-tarification", element: <RegleTarificationList />, auth: authRoles.admin },
        { path: "/parametrage/horaire-ouverture", element: <HoraireOuvertureList />, auth: authRoles.admin },
    
        {path: "/statistiques",element: <Statistiques />}
   
      
    ]
  },

  // session pages route
  ...sessionRoutes
];

export default routes;
