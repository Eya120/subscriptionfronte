import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import GenericTable from "../../../components/GenericTable"; // Ajuste le chemin si nécessaire
import { typeAbonnementService } from "../../services/typeAbonnementService";

const TypeAbonnementList = () => {
  const [types, setTypes] = useState([]);
  const navigate = useNavigate();

  const fetchTypes = async () => {
    try {
      const data = await typeAbonnementService.getAll();
      setTypes(data);
    } catch (error) {
      console.error("Erreur lors du chargement des types :", error);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await typeAbonnementService.remove(id);
      fetchTypes();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const columns = [
    { field: "nom", header: "Nom", cellStyle: { paddingLeft: "20px" }, headerStyle: { paddingLeft: "20px" } },
    { field: "description", header: "Description" },
    { field: "duree", header: "Durée (jours)" },
    { field: "prix", header: "Prix (€)" },
    {
      field: "actions",
      header: "Actions",
      width: 140,
      render: (row) => (
        <Box display="flex" justifyContent="center" gap={1}>
          <Tooltip title="Modifier">
            <IconButton size="small" color="primary" onClick={() => navigate(`/parametrage/type-abonnement/${row.id}`)}>
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
        Types d'abonnement
      </Typography>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/parametrage/type-abonnement/new")}>
          Ajouter
        </Button>
      </Box>

      <GenericTable columns={columns} data={types} />
    </Box>
  );
};

export default TypeAbonnementList;
