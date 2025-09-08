import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import GenericTable from "../../../components/GenericTable";
import { regleTarificationService } from "../../services/regleTarificationService";

const RegleTarificationList = () => {
  const [regles, setRegles] = useState([]);
  const navigate = useNavigate();

  const fetchRegles = async () => {
    try {
      const res = await regleTarificationService.getAll();

      // Log des données reçues du backend
      console.log("📦 Données reçues du backend : ", res.data);

      // Formatage des données pour la table
      const formatted = res.data.map((r) => ({
        id: r.id,
        typeAbonnementNom: r.typeAbonnementNom || "-", // Vérifie ici le nom exact reçu
        jour: r.jour,
        heureDebut: r.heureDebut,
        heureFin: r.heureFin,
        tarif: r.tarif,
      }));

      // Log des données envoyées au tableau
      console.log("🧾 Données envoyées au tableau : ", formatted);

      setRegles(formatted);
    } catch (error) {
      console.error("❌ Erreur de chargement :", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette règle ?")) return;
    try {
      await regleTarificationService.delete(id);
      fetchRegles();
    } catch (error) {
      console.error("Erreur de suppression :", error);
    }
  };

  useEffect(() => {
    fetchRegles();
  }, []);

  const columns = [
    { field: "typeAbonnementNom", header: "Type d'abonnement" },
    { field: "jour", header: "Jour" },
    { field: "heureDebut", header: "Heure début" },
    { field: "heureFin", header: "Heure fin" },
    { field: "tarif", header: "Tarif (€)" },
    {
      field: "actions",
      header: "Actions",
      width: 140,
      render: (row) => (
        <Box display="flex" justifyContent="center" gap={1}>
          <Tooltip title="Modifier">
            <IconButton
              size="small"
              color="primary"
              onClick={() => navigate(`/parametrage/regle-tarification/${row.id}`)}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Supprimer">
            <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box m={4}>
      <Typography variant="h4" mb={3} textAlign="center" fontWeight="bold">
        Règles de tarification
      </Typography>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/parametrage/regle-tarification/new")}
        >
          Ajouter
        </Button>
      </Box>

      <GenericTable columns={columns} data={regles} />
    </Box>
  );
};

export default RegleTarificationList;
