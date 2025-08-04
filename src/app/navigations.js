const navigations = [
{
  name: "Tableau de bord",
  icon: "bar_chart",
  path: "/statistiques",
},
  { label: "PAGES", type: "label" },
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
    path: "/utilisateurs",
    icon: "group",
    iconText: "U",
  },

  {
    name: "Abonnements",
    path: "/abonnements",
    icon: "subscriptions"
    
  },

   {
    name: "Access",
    path: "/access",
      icon: "event_note"
    
  },

  {
    name: "Reservations",
    path: "/reservation",
      icon: "event_note"
    
  },

  {
    name: "Paiements",
    icon: "payment",
    children: [
      {
        name: "Effectuer un Paiement",
        path: "/payements",
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
  name: "Paramétrage",
  icon: "settings",
  children: [
    {
      name: "Type d’abonnement",
      path: "/parametrage/type-abonnement",
      icon: "category",
    },
    {
      name: "Règle de tarification",
      path: "/parametrage/regle-tarification",
      icon: "attach_money",
    },
    {
      name: "Horaire d’ouverture",
      path: "/parametrage/horaire-ouverture",
      icon: "access_time",
    },
  ],
},

  


 
];

export default navigations;
