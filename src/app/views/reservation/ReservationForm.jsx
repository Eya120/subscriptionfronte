import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const reservationSchema = Yup.object().shape({
  abonnementId: Yup.number().required("Abonnement requis"),
  serviceId: Yup.number().required("Service requis"),
  utilisateurId: Yup.number().required("Utilisateur requis"),
  dateReservation: Yup.date().required("Date requise"),
  heureDebut: Yup.string().required("Heure de début requise"),
  heureFin: Yup.string().required("Heure de fin requise"),
});

const ReservationForm = ({ mode = "create", reservation = null, onClose }) => {
  const [abonnements, setAbonnements] = useState([]);
  const [services, setServices] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Charger abonnements, services, utilisateurs au montage
  useEffect(() => {
    // Remplace par tes appels axios vers ton backend pour ces données
    setAbonnements([
      { id: 1, nom: "Mensuel" },
      { id: 2, nom: "Annuel" },
    ]);

  }, []);

  const initialValues = reservation
    ? {
        abonnementId: reservation.abonnementId,
        serviceId: reservation.serviceId,
        utilisateurId: reservation.utilisateurId,
        dateReservation: reservation.dateReservation,
        heureDebut: reservation.heureDebut,
        heureFin: reservation.heureFin,
      }
    : {
        abonnementId: "",
        serviceId: "",
        utilisateurId: "",
        dateReservation: "",
        heureDebut: "",
        heureFin: "",
      };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setSuccessMessage("");
      setErrorMessage("");

      if (mode === "create") {
        await axios.post("http://localhost:3000/reservations", values);
        setSuccessMessage("Réservation créée avec succès !");
      } else {
        await axios.put(`http://localhost:3000/reservations/${reservation.id}`, values);
        setSuccessMessage("Réservation mise à jour avec succès !");
      }

      resetForm();
      if (onClose) onClose();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Erreur lors de la sauvegarde de la réservation"
      );
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={5} p={3} boxShadow={3} borderRadius={2}>
      <Typography variant="h5" mb={3}>
        {mode === "create" ? "Nouvelle Réservation" : "Modifier la Réservation"}
      </Typography>

      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={reservationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, handleChange, values }) => (
          <Form>
            <TextField
              select
              fullWidth
              margin="normal"
              label="Abonnement"
              name="abonnementId"
              value={values.abonnementId}
              onChange={handleChange}
              error={touched.abonnementId && Boolean(errors.abonnementId)}
              helperText={touched.abonnementId && errors.abonnementId}
            >
              {abonnements.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.nom}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              margin="normal"
              label="Service"
              name="serviceId"
              value={values.serviceId}
              onChange={handleChange}
              error={touched.serviceId && Boolean(errors.serviceId)}
              helperText={touched.serviceId && errors.serviceId}
            >
              {services.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.nom}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              margin="normal"
              label="Utilisateur"
              name="utilisateurId"
              value={values.utilisateurId}
              onChange={handleChange}
              error={touched.utilisateurId && Boolean(errors.utilisateurId)}
              helperText={touched.utilisateurId && errors.utilisateurId}
            >
              {utilisateurs.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.nom}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              margin="normal"
              type="date"
              label="Date de réservation"
              name="dateReservation"
              value={values.dateReservation}
              onChange={handleChange}
              error={touched.dateReservation && Boolean(errors.dateReservation)}
              helperText={touched.dateReservation && errors.dateReservation}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              type="datetime-local"
              label="Heure de début"
              name="heureDebut"
              value={values.heureDebut}
              onChange={handleChange}
              error={touched.heureDebut && Boolean(errors.heureDebut)}
              helperText={touched.heureDebut && errors.heureDebut}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              type="datetime-local"
              label="Heure de fin"
              name="heureFin"
              value={values.heureFin}
              onChange={handleChange}
              error={touched.heureFin && Boolean(errors.heureFin)}
              helperText={touched.heureFin && errors.heureFin}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <Button variant="contained" color="primary" type="submit" sx={{ mt: 3 }} fullWidth>
              {mode === "create" ? "Réserver" : "Mettre à jour"}
            </Button>

            {onClose && (
              <Button variant="outlined" color="secondary" sx={{ mt: 2 }} fullWidth onClick={onClose}>
                Annuler
              </Button>
            )}
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ReservationForm;
