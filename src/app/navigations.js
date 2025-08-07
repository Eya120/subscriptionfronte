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
    name: "Access",
    path: "/access",
      icon: "event_note"
    
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
