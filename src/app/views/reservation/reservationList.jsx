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
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const reservationSchema = Yup.object().shape({
  abonnementId: Yup.number().required("Abonnement requis"),
  serviceId: Yup.number().required("Service requis"),
  utilisateurId: Yup.number().required("Utilisateur requis"),
  dateReservation: Yup.date().required("Date requise"),
  heureDebut: Yup.string().required("Heure de début requise"),
  heureFin: Yup.string().required("Heure de fin requise"),
});

const ReservationForm = () => {
  const [abonnements, setAbonnements] = useState([]);
  const [services, setServices] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Charger les données mock ou via API au chargement
  useEffect(() => {
    // Exemple mock, à remplacer par appel axios si nécessaire
    setAbonnements([
      { id: 1, nom: "Mensuel" },
      { id: 2, nom: "Annuel" },
    ]);
    setServices([]);
    setUtilisateurs([]);
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setSuccessMessage("");
      setErrorMessage("");

      // Appel API backend pour créer la réservation
      await axios.post("http://localhost:3000/reservations", {
        abonnementId: values.abonnementId,
        serviceId: values.serviceId,
        utilisateurId: values.utilisateurId,
        dateReservation: values.dateReservation,
        heureDebut: values.heureDebut,
        heureFin: values.heureFin,
      });

      setSuccessMessage("Réservation créée avec succès !");
      resetForm();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Erreur lors de la création de la réservation"
      );
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={5} p={3} boxShadow={3} borderRadius={2}>
      <Typography variant="h5" mb={3}>
        Nouvelle Réservation
      </Typography>

      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <Formik
        initialValues={{
          abonnementId: "",
          serviceId: "",
          utilisateurId: "",
          dateReservation: "",
          heureDebut: "",
          heureFin: "",
        }}
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

            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 3 }}
              fullWidth
            >
              Réserver
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ReservationForm;
