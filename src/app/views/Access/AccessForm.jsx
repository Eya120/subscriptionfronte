import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Stack,
  Snackbar,
  Alert
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate } from "react-router-dom";

const accessSchema = Yup.object().shape({
  utilisateurId: Yup.number().required("Utilisateur requis"),
  abonnementId: Yup.number().required("Abonnement requis"),
  dateAcces: Yup.date().required("Date d'accès requise"),
  heureEntree: Yup.string().required("Heure d'entrée requise"),
  heureSortie: Yup.string().required("Heure de sortie requise"),
});

const AccessForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [dataSources, setDataSources] = useState({
    utilisateurs: [],
    abonnements: [],
  });

  const [access, setAccess] = useState({
    utilisateurId: "",
    abonnementId: "",
    dateAcces: "",
    heureEntree: "",
    heureSortie: "",
  });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const fetchJson = async (url) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [utilisateurs, abonnements] = await Promise.all([
          fetchJson("/api/utilisateurs"),
          fetchJson("/api/abonnements"),
        ]);

        setDataSources({ utilisateurs, abonnements });

        if (id) {
          const accessData = await fetchJson(`/api/access/${id}`);
          setAccess(accessData || {});
        }
      } catch (err) {
        setSnackbar({ open: true, message: "Erreur lors du chargement des données", severity: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (values, { resetForm }) => {
    setSubmitLoading(true);
    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `/api/access/${id}` : "/api/access";
      const token = localStorage.getItem("token");
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
      setSnackbar({ open: true, message: id ? "Accès mis à jour !" : "Accès créé !", severity: "success" });
      resetForm();
      setTimeout(() => navigate("/access"), 1000);
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
        {id ? "Modifier l'accès" : "Nouvel accès"}
      </Typography>

      <Formik
        enableReinitialize
        initialValues={access}
        validationSchema={accessSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, handleChange, values }) => (
          <Form noValidate>
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
              disabled={submitLoading}
            >
              {dataSources.utilisateurs.length > 0 ? (
                dataSources.utilisateurs.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.nom}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Aucun utilisateur</MenuItem>
              )}
            </TextField>

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
              disabled={submitLoading}
            >
              {dataSources.abonnements.length > 0 ? (
                dataSources.abonnements.map((a) => (
                  <MenuItem key={a.id} value={a.id}>
                    {a.typeAbonnement || a.nom || `Abonnement ${a.id}`}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Aucun abonnement</MenuItem>
              )}
            </TextField>

            <TextField
              fullWidth
              margin="normal"
              type="date"
              label="Date d'accès"
              name="dateAcces"
              value={values.dateAcces}
              onChange={handleChange}
              error={touched.dateAcces && Boolean(errors.dateAcces)}
              helperText={touched.dateAcces && errors.dateAcces}
              InputLabelProps={{ shrink: true }}
              disabled={submitLoading}
            />

            <Stack direction="row" spacing={2} mt={2}>
              <TextField
                fullWidth
                type="time"
                label="Heure d'entrée"
                name="heureEntree"
                value={values.heureEntree}
                onChange={handleChange}
                error={touched.heureEntree && Boolean(errors.heureEntree)}
                helperText={touched.heureEntree && errors.heureEntree}
                InputLabelProps={{ shrink: true }}
                disabled={submitLoading}
              />
              <TextField
                fullWidth
                type="time"
                label="Heure de sortie"
                name="heureSortie"
                value={values.heureSortie}
                onChange={handleChange}
                error={touched.heureSortie && Boolean(errors.heureSortie)}
                helperText={touched.heureSortie && errors.heureSortie}
                InputLabelProps={{ shrink: true }}
                disabled={submitLoading}
              />
            </Stack>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 3 }}
              fullWidth
              disabled={submitLoading}
            >
              {submitLoading ? <CircularProgress size={20} /> : id ? "Mettre à jour" : "Créer"}
            </Button>

            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 2 }}
              fullWidth
              onClick={() => navigate("/access")}
              disabled={submitLoading}
            >
              Annuler
            </Button>
          </Form>
        )}
      </Formik>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AccessForm;
