import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const accessSchema = Yup.object().shape({
  utilisateurId: Yup.number().required("Utilisateur requis"),
  abonnementId: Yup.number().required("Abonnement requis"),
  typeAcces: Yup.string().required("Type d’accès requis"),
  codeAcces: Yup.string().required("Code requis"),
  dateExpiration: Yup.date().required("Date d’expiration requise"),
});

const AccessForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [utilisateurs, setUtilisateurs] = useState([]);
  const [abonnements, setAbonnements] = useState([]);
  const [initialValues, setInitialValues] = useState({
    utilisateurId: "",
    abonnementId: "",
    typeAcces: "",
    codeAcces: "",
    dateExpiration: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersRes, abosRes] = await Promise.all([
          fetch("http://localhost:3000/api/utilisateurs"),
          fetch("http://localhost:3000/api/abonnements"),
        ]);

        setUtilisateurs(await usersRes.json());
        setAbonnements(await abosRes.json());

        if (id) {
          const res = await fetch(`http://localhost:3000/api/access/${id}`);
          const data = await res.json();
          setInitialValues({
            utilisateurId: data.utilisateurId,
            abonnementId: data.abonnementId,
            typeAcces: data.typeAcces,
            codeAcces: data.codeAcces,
            dateExpiration: data.dateExpiration.split("T")[0],
          });
        }
      } catch (e) {
        setErrorMsg("Erreur chargement données");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const url = `http://localhost:3000/api/access${id ? `/${id}` : ""}`;
      const method = id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Erreur sauvegarde");

      setSuccessMsg("Accès enregistré avec succès !");
      setTimeout(() => navigate("/access"), 1000);
    } catch (err) {
      setErrorMsg("Erreur lors de l’enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Box m={4}><CircularProgress /></Box>;

  return (
    <Box maxWidth={500} mx="auto" mt={4} p={4} boxShadow={3} borderRadius={2} bgcolor="#f9f9f9">
      <Typography variant="h5" mb={2}>{id ? "Modifier un accès" : "Ajouter un accès"}</Typography>

      {successMsg && <Alert severity="success">{successMsg}</Alert>}
      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <Formik
        initialValues={initialValues}
        validationSchema={accessSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange }) => (
          <Form>
            <TextField
              select
              fullWidth
              label="Utilisateur"
              name="utilisateurId"
              value={values.utilisateurId}
              onChange={handleChange}
              margin="normal"
              error={touched.utilisateurId && Boolean(errors.utilisateurId)}
              helperText={touched.utilisateurId && errors.utilisateurId}
            >
              {utilisateurs.map(u => (
                <MenuItem key={u.id} value={u.id}>{u.nom} {u.prenom}</MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Abonnement"
              name="abonnementId"
              value={values.abonnementId}
              onChange={handleChange}
              margin="normal"
              error={touched.abonnementId && Boolean(errors.abonnementId)}
              helperText={touched.abonnementId && errors.abonnementId}
            >
              {abonnements.map(a => (
                <MenuItem key={a.id} value={a.id}>Abonnement #{a.id}</MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Type d’accès"
              name="typeAcces"
              value={values.typeAcces}
              onChange={handleChange}
              margin="normal"
              error={touched.typeAcces && Boolean(errors.typeAcces)}
              helperText={touched.typeAcces && errors.typeAcces}
            >
              <MenuItem value="QR_CODE">QR Code</MenuItem>
              <MenuItem value="BADGE">Badge</MenuItem>
              <MenuItem value="PIN">Code PIN</MenuItem>
            </TextField>

            <TextField
              fullWidth
              label="Code d’accès"
              name="codeAcces"
              value={values.codeAcces}
              onChange={handleChange}
              margin="normal"
              error={touched.codeAcces && Boolean(errors.codeAcces)}
              helperText={touched.codeAcces && errors.codeAcces}
            />

            <TextField
              fullWidth
              type="date"
              label="Date d’expiration"
              name="dateExpiration"
              value={values.dateExpiration}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              error={touched.dateExpiration && Boolean(errors.dateExpiration)}
              helperText={touched.dateExpiration && errors.dateExpiration}
            />

            <Box mt={3} display="flex" justifyContent="space-between">
              <Button onClick={() => navigate("/access") } fullWidth>Annuler</Button>
              <Button type="submit" variant="contained" fullWidth disabled={submitting} >
                {id ? "Modifier" : "Créer"}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AccessForm;
