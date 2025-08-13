import React, { useEffect, useState } from "react";
import {
  Box, Typography, CircularProgress, Stack, IconButton, Tooltip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import GenericTable from "../../components/GenericTable";
import { QRCodeCanvas } from "qrcode.react"; 

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  const navigate = useNavigate();

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/reservations");
      const data = await res.json();
      setReservations(data);
    } catch (error) {
      alert("Erreur lors du chargement des réservations");
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDeleteClick = (id) => {
    setToDeleteId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await fetch(`http://localhost:3000/api/reservations/${toDeleteId}`, { method: "DELETE" });
      setShowDeleteDialog(false);
      setToDeleteId(null);
      fetchReservations();
    } catch (error) {
      alert("Erreur lors de la suppression");
      console.error(error);
    }
  };

  // ✅ Colonnes avec QR Code
  const columns = [
    { header: "Utilisateur", field: "utilisateurNom" },
    { header: "Abonnement", field: "abonnementNom" },
    { header: "Service", field: "serviceNom" },
    { 
      header: "Date", 
      field: "dateReservation", 
      render: (row) => new Date(row.dateReservation).toLocaleDateString() 
    },
    { header: "Heure début", field: "heureDebut" },
    { header: "Heure fin", field: "heureFin" },
    { 
      header: "QR Code", 
      render: (row) => (
        <QRCodeCanvas 
          value={row.codeAcces || `RES-${row.id}`} // valeur encodée
          size={64} // taille du QR Code
          level="H" // niveau de correction
        />
      )
    },
    {
      header: "Actions",
      render: (row) => (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Tooltip title="Modifier">
            <IconButton color="primary" onClick={() => navigate(`/reservations/edit/${row.id}`)} size="small">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Supprimer">
            <IconButton color="error" onClick={() => handleDeleteClick(row.id)} size="small">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box maxWidth={1100} mx="auto" mt={5} p={3} boxShadow={3} borderRadius={2} bgcolor="#fafafa">
      <Typography variant="h4" mb={3} textAlign="center" fontWeight="bold">
        Gestion des Réservations
      </Typography>

      <Box mb={2} display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={() => navigate("/reservation/new")}>
          + Nouvelle réservation
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <GenericTable
          columns={columns}
          data={reservations}
          noDataMessage="Aucune réservation trouvée."
        />
      )}

      {/* Dialog suppression */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>Êtes-vous sûr de vouloir supprimer cette réservation ?</DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Annuler</Button>
          <Button onClick={handleDeleteConfirm} color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReservationList;
