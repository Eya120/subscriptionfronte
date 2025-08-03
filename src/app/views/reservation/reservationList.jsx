import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
} from "@mui/material";
import ReservationForm from "./ReservationForm";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [formMode, setFormMode] = useState("create");
  const [showForm, setShowForm] = useState(false);

  const fetchReservations = async () => {
    try {
      const response = await axios.get("http://localhost:3000/reservations");
      setReservations(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des réservations", error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
    setFormMode("edit");
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Confirmer la suppression ?")) {
      try {
        await axios.delete(`http://localhost:3000/reservations/${id}`);
        fetchReservations();
      } catch (error) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedReservation(null);
    fetchReservations();
  };

  return (
    <Box maxWidth={1050} mx="auto" mt={5} p={3} boxShadow={3} borderRadius={2}>
      <Typography variant="h4" mb={3}>
        Gestion des Réservations
      </Typography>

      {!showForm && (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setFormMode("create");
              setSelectedReservation(null);
              setShowForm(true);
            }}
            sx={{ mb: 2 }}
          >
            Nouvelle réservation
          </Button>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Utilisateur</TableCell>
                <TableCell>Abonnement</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Heure début</TableCell>
                <TableCell>Heure fin</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Aucune réservation trouvée.
                  </TableCell>
                </TableRow>
              )}
              {reservations.map((res) => (
                <TableRow key={res.id}>
                  <TableCell>{res.utilisateurNom}</TableCell>
                  <TableCell>{res.abonnementNom}</TableCell>
                  <TableCell>{res.serviceNom}</TableCell>
                  <TableCell>{new Date(res.dateReservation).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(res.heureDebut).toLocaleTimeString()}</TableCell>
                  <TableCell>{new Date(res.heureFin).toLocaleTimeString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleEdit(res)}
                      sx={{ mr: 1 }}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(res.id)}
                    >
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}

      {showForm && (
        <ReservationForm
          mode={formMode}
          reservation={selectedReservation}
          onClose={handleFormClose}
        />
      )}
    </Box>
  );
};

export default ReservationList;
