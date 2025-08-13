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

import PaiementsForm from "./views/payements/PaiementsForm";
import PaiementList from "./views/payements/PaiementList";

import AccessList from "./views/access/AccessList";
import AccessForm from "./views/access/AccessForm";

import TypeAbonnementList from "./views/parametrage/TypeAbonnement/TypeAbonnementList";
import TypeAbonnementForm from "./views/parametrage/TypeAbonnement/TypeAbonnementForm";

import RegleTarificationList from "./views/parametrage/RegleTarification/RegleTarificationList";
import RegleTarificationForm from "./views/parametrage/RegleTarification/RegleTarificationForm";

import HoraireOuvertureList from "./views/parametrage/HoraireOuverture/HoraireOuvertureList";
import HoraireOuvertureForm from "./views/parametrage/HoraireOuverture/HoraireOuvertureForm";


import Statistiques from "./views/Statistiques/statistiques"; // adapte le chemin si nécessaire

import ReservationFormWrapper from "./views/reservation/ReservationFormWrapper";
import UserFormWrapper from "./views/utilisateurs/UserFormWrapper";




// DASHBOARD PAGE
const Analytics = Loadable(lazy(() => import("app/views/statistiques/statistiques")));
const routes = [
  { path: "/", element: <Navigate to="statistiques" /> },
  
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
     
      
      { path: '/reservation',element: <ReservationList />},
      { path: '/reservation/liste', element: <ReservationList />},
      {  path: '/reservation/new', element: <ReservationForm />},
      { path:"/reservation/edit/:id" ,element:<ReservationFormWrapper mode="edit"/>},
  


       { path: "/payements/new", element: <PaiementsForm />, auth: authRoles.admin },
       { path: "/payements/historique", element: <PaiementList />, auth: authRoles.admin },
       {path: "/paiements/edit/:id", element: <PaiementsForm />},
       
       {path: "/access", element: <AccessList />},
       {path: "/access/new",element: <AccessForm />},
       {path: "/access/:id",element: <AccessForm />},

       { path: "/parametrage/type-abonnement", element: <TypeAbonnementList />, auth: authRoles.admin },
       { path: "/parametrage/type-abonnement/new", element: <TypeAbonnementForm />, auth: authRoles.admin },
       { path: "/parametrage/type-abonnement/:id", element: <TypeAbonnementForm />, auth: authRoles.admin }, 

       {path: "/parametrage/regle-tarification", element: <RegleTarificationList />,auth: authRoles.admin},
       {path: "/parametrage/regle-tarification/new",element: <RegleTarificationForm />,auth: authRoles.admin},
       {path: "/parametrage/regle-tarification/edit/:id",element: <RegleTarificationForm />,auth: authRoles.admin},

       { path: "/parametrage/horaire-ouverture", element: <HoraireOuvertureList />, auth: authRoles.admin },
       { path: "/parametrage/horaire-ouverture/new", element: <HoraireOuvertureForm />, auth: authRoles.admin },
       { path: "/parametrage/horaire-ouverture/edit/:id", element: <HoraireOuvertureForm />, auth: authRoles.admin },



        {path: "/statistiques",element: <Statistiques />}
   
      
    ]
  },

  // session pages route
  ...sessionRoutes
];

export default routes;
