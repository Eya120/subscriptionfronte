import React, { useEffect, useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GenericTable from "../../../components/GenericTable";

const HoraireOuvertureList = () => {
  const [horaires, setHoraires] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchHoraires = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/horaire-ouverture", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setHoraires(res.data);
    } catch (error) {
      console.error("Erreur de chargement :", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHoraires();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/horaire-ouverture/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      fetchHoraires();
    } catch (error) {
      console.error("Erreur de suppression :", error);
    }
  };

  const columns = [
    { field: "jour", header: "Jour" },
    { field: "heureOuverture", header: "Heure ouverture" },
    { field: "heureFermeture", header: "Heure fermeture" },
    {
      header: "Actions",
      field: "actions",
      render: (row) => (
        <Box display="flex" justifyContent="center" gap={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate(`/parametrage/horaire-ouverture/edit/${row.id}`)}
          >
            Modifier
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDelete(row.id)}
          >
            Supprimer
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box mx="auto" maxWidth={900} mt={5} p={3}>
      <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
        Horaires d’ouverture
      </Typography>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          onClick={() => navigate("/parametrage/horaire-ouverture/new")}
        >
          + Ajouter un horaire
        </Button>
      </Box>

      <GenericTable columns={columns} data={horaires} loading={loading} />
    </Box>
  );
};

export default HoraireOuvertureList;
