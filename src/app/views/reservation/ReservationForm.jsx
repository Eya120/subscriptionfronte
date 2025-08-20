import React, { useEffect, useState } from "react";
import {
  TextField, Button, MenuItem, Box, Typography, CircularProgress,
  Stack, Snackbar, Alert
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
  const { id } = useParams();
  const navigate = useNavigate();

  const [dataSources, setDataSources] = useState({
    abonnements: [],
    services: [],
    utilisateurs: [],
  });
  const [reservation, setReservation] = useState({
    abonnementId: "",
    serviceId: "",
    utilisateurId: "",
    dateReservation: "",
    heureDebut: "",
    heureFin: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const fetchJson = async (url) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [abonnementsData, servicesData, utilisateursData] = await Promise.all([
          fetchJson("/api/abonnements"),
          fetchJson("/api/services"),
          fetchJson("/api/utilisateurs"),
        ]);
        setDataSources({ abonnements: abonnementsData, services: servicesData, utilisateurs: utilisateursData });

        if (id) {
          const resReservation = await fetchJson(`/api/reservations/${id}`);
          setReservation(resReservation || {});
        }
      } catch {
        setSnackbar({ open: true, message: "Erreur lors du chargement des données", severity: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const initialValues = reservation;

  const handleSubmit = async (values, { resetForm }) => {
    setSubmitLoading(true);
    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `/api/reservations/${id}` : "/api/reservations";
      const token = localStorage.getItem("token");
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
      setSnackbar({ open: true, message: id ? "Réservation mise à jour !" : "Réservation créée !", severity: "success" });
      resetForm();
      setTimeout(() => navigate("/reservations"), 1000);
    } catch (err) {
      setSnackbar({ open: true, message: err.message || "Erreur lors de la sauvegarde", severity: "error" });
    } finally {
      setSubmitLoading(false);
    }
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
      <Typography variant="h5" mb={3} textAlign="center" fontWeight="bold">
        {id ? "Modifier la Réservation" : "Nouvelle Réservation"}
      </Typography>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={reservationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, handleChange, values }) => (
          <Form noValidate>
            <TextField
              select fullWidth margin="normal" label="Abonnement" name="abonnementId"
              value={values.abonnementId} onChange={handleChange}
              error={touched.abonnementId && Boolean(errors.abonnementId)}
              helperText={touched.abonnementId && errors.abonnementId}
              disabled={submitLoading}
            >
              {Array.isArray(dataSources.abonnements) && dataSources.abonnements.map(a => (
                <MenuItem key={a.id} value={a.id}>{a.nom}</MenuItem>
              ))}
            </TextField>

            <TextField
              select fullWidth margin="normal" label="Service" name="serviceId"
              value={values.serviceId} onChange={handleChange}
              error={touched.serviceId && Boolean(errors.serviceId)}
              helperText={touched.serviceId && errors.serviceId}
              disabled={submitLoading}
            >
              {Array.isArray(dataSources.services) && dataSources.services.map(s => (
                <MenuItem key={s.id} value={s.id}>{s.nom}</MenuItem>
              ))}
            </TextField>

            <TextField
              select fullWidth margin="normal" label="Utilisateur" name="utilisateurId"
              value={values.utilisateurId} onChange={handleChange}
              error={touched.utilisateurId && Boolean(errors.utilisateurId)}
              helperText={touched.utilisateurId && errors.utilisateurId}
              disabled={submitLoading}
            >
              {Array.isArray(dataSources.utilisateurs) && dataSources.utilisateurs.map(u => (
                <MenuItem key={u.id} value={u.id}>{u.nom}</MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth margin="normal" type="date" label="Date de réservation" name="dateReservation"
              value={values.dateReservation} onChange={handleChange}
              error={touched.dateReservation && Boolean(errors.dateReservation)}
              helperText={touched.dateReservation && errors.dateReservation}
              InputLabelProps={{ shrink: true }}
              disabled={submitLoading}
            />

            <Stack direction="row" spacing={2} mt={2}>
              <TextField
                fullWidth type="time" label="Heure de début" name="heureDebut"
                value={values.heureDebut} onChange={handleChange}
                error={touched.heureDebut && Boolean(errors.heureDebut)}
                helperText={touched.heureDebut && errors.heureDebut}
                InputLabelProps={{ shrink: true }} disabled={submitLoading}
              />
              <TextField
                fullWidth type="time" label="Heure de fin" name="heureFin"
                value={values.heureFin} onChange={handleChange}
                error={touched.heureFin && Boolean(errors.heureFin)}
                helperText={touched.heureFin && errors.heureFin}
                InputLabelProps={{ shrink: true }} disabled={submitLoading}
              />
            </Stack>

            <Button
              variant="contained" color="primary" type="submit" sx={{ mt: 3 }} fullWidth
              disabled={submitLoading} startIcon={submitLoading && <CircularProgress size={20} />}
            >
              {id ? "Mettre à jour" : "Réserver"}
            </Button>

            <Button
              variant="outlined" color="primary" sx={{ mt: 2 }} fullWidth
              onClick={() => navigate("/reservation")}
              disabled={submitLoading}
            >
              Annuler
            </Button>
          </Form>
        )}
      </Formik>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReservationForm;
