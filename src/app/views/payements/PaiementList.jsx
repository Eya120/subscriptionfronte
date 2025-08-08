import React, { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography, CircularProgress } from "@mui/material";

const PaiementList = () => {
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaiements = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/api/payements");
        const data = await res.json();
        setPaiements(data);
      } catch (error) {
        alert("Erreur lors du chargement des paiements");
      }
      setLoading(false);
    };
    fetchPaiements();
  }, []);

  const columns = [
    { field: "id", header: "ID" },
    { field: "utilisateurNom", header: "Utilisateur" },
    { field: "abonnementNom", header: "Abonnement" },
    { field: "montant", header: "Montant (€)" },
    {
      field: "datePaiement",
      header: "Date paiement",
      render: (row) => new Date(row.datePaiement).toLocaleDateString(),
    },
    { field: "modePaiement", header: "Mode de paiement" },
  ];

  return (
    <Box maxWidth={1100} mx="auto" mt={5} p={3}>
      <Typography variant="h4" mb={3} textAlign="center" fontWeight="bold">
        Gestion des Paiements
      </Typography>

      <Box mb={2} display="flex" justifyContent="flex-end">
        <Button variant="contained" onClick={() => navigate("/payements/new")}>
          + Nouveau paiement
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <GenericTable columns={columns} data={paiements} />
      )}
    </Box>
  );
};

export default PaiementList;
