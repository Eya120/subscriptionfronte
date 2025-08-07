import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate } from "react-router-dom";

const abonnementSchema = Yup.object().shape({
  utilisateurId: Yup.number().required("Utilisateur requis"),
  typeAbonnement: Yup.string().required("Type d’abonnement requis"),
  dateDebut: Yup.date().required("Date de début requise"),
  dateFin: Yup.date()
    .required("Date de fin requise")
    .min(Yup.ref("dateDebut"), "La date de fin doit être après la date de début"),
  tarif: Yup.number()
    .required("Tarif requis")
    .min(0, "Le tarif doit être positif"),
});

const AbonnementForm = () => {
  const { id } = useParams(); // id si modification
  const navigate = useNavigate();

  const [utilisateurs, setUtilisateurs] = useState([]);
  const [initialValues, setInitialValues] = useState({
    utilisateurId: "",
    typeAbonnement: "",
    dateDebut: "",
    dateFin: "",
    tarif: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUsers = await fetch("http://localhost:3000/api/utilisateurs");
        if (!resUsers.ok) throw new Error("Erreur chargement utilisateurs");
        const usersData = await resUsers.json();
        setUtilisateurs(usersData);

        if (id) {
          const resAbonnement = await fetch(`http://localhost:3000/api/abonnements/${id}`);
          if (!resAbonnement.ok) throw new Error("Erreur chargement abonnement");
          const abonnementData = await resAbonnement.json();

          setInitialValues({
            utilisateurId: abonnementData.utilisateurId || "",
            typeAbonnement: abonnementData.typeAbonnement || "",
            dateDebut: abonnementData.dateDebut ? abonnementData.dateDebut.split("T")[0] : "",
            dateFin: abonnementData.dateFin ? abonnementData.dateFin.split("T")[0] : "",
            tarif: abonnementData.tarif != null ? abonnementData.tarif : "",
          });
        }
        setLoading(false);
      } catch (error) {
        setErrorMessage(error.message || "Erreur chargement données");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (values, { resetForm }) => {
    setSubmitLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (id) {
        // Modifier
        const res = await fetch(`http://localhost:3000/api/abonnements/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error("Erreur mise à jour abonnement");
        setSuccessMessage("Abonnement mis à jour avec succès !");
      } else {
        // Créer
        const res = await fetch("http://localhost:3000/api/abonnements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error("Erreur création abonnement");
        setSuccessMessage("Abonnement créé avec succès !");
        resetForm();
      }

      setTimeout(() => navigate("/abonnements"), 1000);
    } catch (error) {
      setErrorMessage(error.message || "Erreur lors de la sauvegarde");
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
    <Box
      sx={{
        maxWidth: 480,
        mx: "auto",
        mt: 5,
        p: 4,
        bgcolor: "background.paper",
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" mb={3} align="center" fontWeight="bold">
        {id ? "Modifier un abonnement" : "Créer un nouvel abonnement"}
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={abonnementSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form noValidate>
            <TextField
              select
              label="Utilisateur"
              name="utilisateurId"
              fullWidth
              margin="normal"
              value={values.utilisateurId}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.utilisateurId && Boolean(errors.utilisateurId)}
              helperText={touched.utilisateurId && errors.utilisateurId}
            >
              <MenuItem value="">
                <em>Choisir un utilisateur</em>
              </MenuItem>
              {utilisateurs.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.nom} {user.prenom}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Type d’abonnement"
              name="typeAbonnement"
              fullWidth
              margin="normal"
              value={values.typeAbonnement}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.typeAbonnement && Boolean(errors.typeAbonnement)}
              helperText={touched.typeAbonnement && errors.typeAbonnement}
            />

            <TextField
              label="Date début"
              type="date"
              name="dateDebut"
              fullWidth
              margin="normal"
              value={values.dateDebut}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.dateDebut && Boolean(errors.dateDebut)}
              helperText={touched.dateDebut && errors.dateDebut}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Date fin"
              type="date"
              name="dateFin"
              fullWidth
              margin="normal"
              value={values.dateFin}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.dateFin && Boolean(errors.dateFin)}
              helperText={touched.dateFin && errors.dateFin}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Tarif (€)"
              type="number"
              name="tarif"
              fullWidth
              margin="normal"
              value={values.tarif}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.tarif && Boolean(errors.tarif)}
              helperText={touched.tarif && errors.tarif}
              inputProps={{ min: 0, step: "0.01" }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 3,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => navigate("/abonnements")}
                disabled={submitLoading}
                fullWidth
                 startIcon={submitLoading && <CircularProgress size={20} />}
              >
                Annuler
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                disabled={submitLoading}
                 startIcon={submitLoading && <CircularProgress size={20} />}
              >
                {id ? "Modifier" : "Créer"}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AbonnementForm;
