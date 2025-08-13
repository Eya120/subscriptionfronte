import React, { useEffect, useState } from "react";
import { Button, Box, CircularProgress, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import GenericTable from "../../components/GenericTable";
import { QRCodeCanvas } from "qrcode.react"; // ✅ Import QR Code

const AbonnementList = () => {
  const [abonnements, setAbonnements] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAbonnements = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/abonnements");
      const data = await response.json();
      setAbonnements(data);
    } catch (error) {
      console.error("Erreur lors du chargement des abonnements :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/abonnements/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAbonnements((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  };

  useEffect(() => {
    fetchAbonnements();
  }, []);

  const columns = [
    { header: "ID", field: "id" },
    { header: "Utilisateur ID", field: "utilisateurId" },
    { header: "Type", field: "typeAbonnement" },
    { header: "Date Début", field: "dateDebut" },
    { header: "Date Fin", field: "dateFin" },
    { header: "Tarif (€)", field: "tarif" },
    { 
      header: "QR Code", 
      render: (row) => (
        <QRCodeCanvas
          value={row.codeAcces || `ABO-${row.id}`} // valeur encodée
          size={64}
          level="H"
        />
      )
    },
    {
      header: "Actions",
      render: (row) => (
        <Box display="flex" justifyContent="center">
          <IconButton onClick={() => navigate(`/abonnements/${row.id}`)}>
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(row.id)}>
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="primary" onClick={() => navigate("/abonnements/new")}>
          Ajouter un abonnement
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <GenericTable
          title="Liste des abonnements"
          columns={columns}
          data={abonnements}
        />
      )}
    </Box>
  );
};

export default AbonnementList;
