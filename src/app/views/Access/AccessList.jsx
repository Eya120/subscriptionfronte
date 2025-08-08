import React, { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";
import { IconButton, Box, CircularProgress } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AccessList = () => {
  const [accessData, setAccessData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccess = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/acces");
        const data = await res.json();
        setAccessData(data);
      } catch (error) {
        console.error("Erreur de chargement des accès :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAccess();
  }, []);

  const columns = [
    { header: "Utilisateur ID", field: "utilisateurId" },
    { header: "Abonnement ID", field: "abonnementId" },
    { header: "Type d’accès", field: "typeAcces" },
    { header: "Code d’accès", field: "codeAcces" },
    {
      header: "Expiration",
      field: "dateExpiration",
      render: (row) => new Date(row.dateExpiration).toLocaleDateString(),
    },
    {
      header: "Actions",
      render: (row) => (
        <Box display="flex" justifyContent="center">
          <IconButton
            color="primary"
            onClick={() => navigate(`/access/edit/${row.id}`)}
          >
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(row.id)}>
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      await fetch(`http://localhost:3000/api/acces/${id}`, { method: "DELETE" });
      setAccessData(accessData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  if (loading) {
    return (
      <Box mt={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box mt={4}>
      <GenericTable
        title="Liste des accès"
        columns={columns}
        data={accessData}
      />
    </Box>
  );
};

export default AccessList;
