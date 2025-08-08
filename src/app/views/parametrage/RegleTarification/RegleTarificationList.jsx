import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GenericTable from "../../../components/GenericTable"; // Ajuste le chemin selon ton projet

const RegleTarificationList = () => {
  const [regles, setRegles] = useState([]);
  const navigate = useNavigate();

  const fetchRegles = async () => {
    try {
      const res = await axios.get("http://localhost:3000/regle-tarification", {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      setRegles(res.data);
    } catch (error) {
      console.error("Erreur de chargement :", error);
    }
  };

  useEffect(() => {
    fetchRegles();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/regle-tarification/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      fetchRegles();
    } catch (error) {
      console.error("Erreur de suppression :", error);
    }
  };

  const columns = [
    {
      field: "jour",
      header: "Jour",
      cellStyle: { paddingLeft: "20px" },
      headerStyle: { paddingLeft: "20px" },
    },
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
              onClick={() => navigate(`/parametrage/regle-tarification/edit/${row.id}`)}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Supprimer">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(row.id)}
            >
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
