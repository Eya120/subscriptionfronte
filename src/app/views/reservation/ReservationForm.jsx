import React, { useEffect, useState } from "react";
import {
  TextField, Button, MenuItem, Box, Typography, Alert,
  CircularProgress, Stack,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate } from "react-router-dom";

const reservationSchema = Yup.object().shape({
  abonnementId: Yup.number().required("Abonnement requis"),
  serviceId: Yup.number().required("Service requis"),
  utilisateurId: Yup.number().required("Utilisateur requis"),
  dateReservation: Yup.date().required("Date requise"),
  heureDebut: Yup.string().required("Heure de début requise"),
  heureFin: Yup.string().required("Heure de fin requise"),
});

const ReservationForm = () => {
  const { id } = useParams(); // id de la réservation, undefined si création
  const navigate = useNavigate();

  const [dataSources, setDataSources] = useState({
    abonnements: [],
    services: [],
    utilisateurs: [],
  });
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Charger abonnements, services, utilisateurs et si id, charger réservation
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resAbonnements, resServices, resUsers] = await Promise.all([
          fetch("http://localhost:3000/api/abonnements"),
          fetch("http://localhost:3000/api/services"),
          fetch("http://localhost:3000/api/utilisateurs"),
        ]);
        const abonnementsData = await resAbonnements.json();
        const servicesData = await resServices.json();
        const utilisateursData = await resUsers.json();

        setDataSources({ abonnements: abonnementsData, services: servicesData, utilisateurs: utilisateursData });

        if (id) {
          const resReservation = await fetch(`http://localhost:3000/api/reservations/${id}`);
          const reservationData = await resReservation.json();
          setReservation(reservationData);
        }
        setLoading(false);
      } catch (error) {
        setErrorMessage("Erreur lors du chargement des données");
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const initialValues = reservation
    ? {
        abonnementId: reservation.abonnementId,
        serviceId: reservation.serviceId,
        utilisateurId: reservation.utilisateurId,
        dateReservation: reservation.dateReservation.split("T")[0],
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
    setSubmitLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (id) {
        await fetch(`http://localhost:3000/api/reservations/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        setSuccessMessage("Réservation mise à jour avec succès !");
      } else {
        await fetch("http://localhost:3000/api/reservations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        setSuccessMessage("Réservation créée avec succès !");
      }
      resetForm();
      setTimeout(() => navigate("/reservations"), 1000); // Retour à la liste après succès
    } catch (error) {
      setErrorMessage(error.message || "Erreur lors de la sauvegarde.");
    }
    setSubmitLoading(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth={600} mx="auto" mt={4} p={3} boxShadow={3} borderRadius={2} bgcolor="#fff">
      <Typography variant="h5" mb={3} textAlign="center">
        {id ? "Modifier la Réservation" : "Nouvelle Réservation"}
      </Typography>

      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={reservationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, handleChange, values }) => (
          <Form noValidate>
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
              {dataSources.abonnements.map((abonnement) => (
                <MenuItem key={abonnement.id} value={abonnement.id}>
                  {abonnement.nom}
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
              {dataSources.services.map((service) => (
                <MenuItem key={service.id} value={service.id}>
                  {service.nom}
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
              {dataSources.utilisateurs.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.nom}
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
              InputLabelProps={{ shrink: true }}
            />

            <Stack direction="row" spacing={2} mt={2}>
              <TextField
                fullWidth
                type="time"
                label="Heure de début"
                name="heureDebut"
                value={values.heureDebut}
                onChange={handleChange}
                error={touched.heureDebut && Boolean(errors.heureDebut)}
                helperText={touched.heureDebut && errors.heureDebut}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="time"
                label="Heure de fin"
                name="heureFin"
                value={values.heureFin}
                onChange={handleChange}
                error={touched.heureFin && Boolean(errors.heureFin)}
                helperText={touched.heureFin && errors.heureFin}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 3 }}
              fullWidth
              disabled={submitLoading}
              startIcon={submitLoading && <CircularProgress size={20} />}
            >
              {id ? "Mettre à jour" : "Réserver"}
            </Button>

            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 2 }}
              fullWidth
              onClick={() => navigate("/reservation")}
              disabled={submitLoading}
            >
              Annuler
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ReservationForm;
