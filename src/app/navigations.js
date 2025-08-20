const navigations = [
{
  name: "Tableau de bord",
  icon: "bar_chart",
  path: "/statistiques",
},
  { label: "PAGES", type: "label" },

 {
    name: "Abonnements",
    icon: "subscriptions",
    children: [
      {
        name: "Liste des abonnements",
        path: "/abonnements",
        icon: "list_alt",
      },
      {
        name: "Ajouter un abonnement",
        path: "/abonnements/new",
        icon: "add_circle",
      }
    ]
  },



  {
  name: "Accès",
  icon: "event_available",
  children: [
    {
      name: "Nouvel accès",
      path: "/access/new",
      icon: "add_circle",
    },
    {
      name: "Liste des accès",
      path: "/access",
      icon: "list_alt",
    },
  ],
},


  {
    name: "Auth",
    icon: "security",
    children: [
      { name: "Sign in", iconText: "SI", path: "/session/signin" },
      { name: "Sign up", iconText: "SU", path: "/session/signup" },
      { name: "Forgot Password", iconText: "FP", path: "/session/forgot-password" },
      { name: "Error", iconText: "404", path: "/session/404" }
    ]
  },

  
 
{
  name: "Utilisateurs",
  icon: "group",
  children: [
    {
      name: "Liste des utilisateurs",
      path: "/utilisateurs",
      icon: "list_alt",
    },
    {
      name: "Ajouter un utilisateur",
      path: "/utilisateurs/new",
      icon: "add_circle",
    }
  ],
},

{
    name: "Paiements",
    icon: "payment",
    children: [
      {
        name: "Effectuer un Paiement",
        path: "/payements/new",
        icon: "send",
      },
      
      {
        name: "Historique Paiements",
        path: "/payements/historique",
        icon: "credit_card",
      },
    ],
  },




 {
  name: "Réservations",
  icon: "event_note",
  children: [
    {
      name: "Nouvelle réservation",
      path: "/reservation/new",
      icon: "add_circle",
    },
    {
      name: "Liste des réservations",
      path: "/reservation/liste",
      icon: "list_alt",
    },
  ],
},
  

  

  {
  name: "Paramétrage",
  icon: "settings",
  children: [

    {
  name: "Types d’abonnement",
  icon: "credit_card",
  children: [
    {
      name: "Liste",
      path: "/parametrage/type-abonnement",
    },
    {
      name: "Ajouter",
      path: "/parametrage/type-abonnement/new",
    },
  ],
},


    {
  name: "Règle de tarification",
  icon: "attach_money",
  children: [
    {
      name: "Liste",
      path: "/parametrage/regle-tarification",
    },
    {
      name: "Ajouter",
      path: "/parametrage/regle-tarification/new",
    },
  ],
},


    
   {
  name: "Horaire d’ouverture",
  icon: "access_time",
  children: [
    {
      name: "Liste",
      path: "/parametrage/horaire-ouverture",
    },
    {
      name: "Ajouter",
      path: "/parametrage/horaire-ouverture/new",
    },
  ],
},






  ],
},

  
















 
];

export default navigations;
