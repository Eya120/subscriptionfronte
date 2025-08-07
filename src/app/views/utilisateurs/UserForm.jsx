import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const roles = [
  { value: "utilisateur", label: "Utilisateur" },
  { value: "admin", label: "Administrateur" },
];

const userSchema = Yup.object().shape({
  nom: Yup.string().required("Nom requis"),
  prenom: Yup.string().required("Prénom requis"),
  email: Yup.string().email("Email invalide").required("Email requis"),
  password: Yup.string().when("mode", {
    is: "create",
    then: Yup.string().required("Mot de passe requis"),
    otherwise: Yup.string(),
  }),
  role: Yup.string().required("Rôle requis"),
});

const UserForm = ({ mode = "create", user = null, onClose }) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const initialValues = {
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    email: user?.email || "",
    password: "",
    role: user?.role || "utilisateur",
    mode, // pour la validation conditionnelle
  };

  const handleSubmit = async (values, { resetForm }) => {
    setSubmitLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const method = mode === "edit" ? "PUT" : "POST";
      const url =
        mode === "edit"
          ? `http://localhost:3000/api/utilisateurs/${user.id}`
          : "http://localhost:3000/api/utilisateurs";

      const bodyData = { ...values };
      delete bodyData.mode; // Ne pas envoyer ce champ

      // En édition, si password vide, ne pas l'envoyer
      if (mode === "edit" && !bodyData.password) {
        delete bodyData.password;
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) throw new Error("Erreur lors de la sauvegarde");

      setSuccessMessage(`Utilisateur ${mode === "edit" ? "modifié" : "créé"} avec succès`);
      resetForm();
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      setErrorMessage(error.message || "Une erreur est survenue");
    }
    setSubmitLoading(false);
  };

  return (
    <Box maxWidth={600} mx="auto" mt={4} p={3} boxShadow={3} borderRadius={2} bgcolor="#fff">
      <Typography variant="h5" mb={3} textAlign="center">
        {mode === "edit" ? "Modifier l'utilisateur" : "Créer un utilisateur"}
      </Typography>

      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={userSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, handleChange, values }) => (
          <Form noValidate>
            <TextField
              fullWidth
              margin="normal"
              label="Nom"
              name="nom"
              value={values.nom}
              onChange={handleChange}
              error={touched.nom && Boolean(errors.nom)}
              helperText={touched.nom && errors.nom}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Prénom"
              name="prenom"
              value={values.prenom}
              onChange={handleChange}
              error={touched.prenom && Boolean(errors.prenom)}
              helperText={touched.prenom && errors.prenom}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Mot de passe"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              helperText={
                mode === "edit"
                  ? "Laissez vide pour ne pas modifier"
                  : "Obligatoire"
              }
              error={touched.password && Boolean(errors.password)}
              required={mode === "create"}
            />

            <TextField
              select
              fullWidth
              margin="normal"
              label="Rôle"
              name="role"
              value={values.role}
              onChange={handleChange}
              error={touched.role && Boolean(errors.role)}
              helperText={touched.role && errors.role}
            >
              {roles.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <Stack direction="row" spacing={2} mt={3}>
              <Button
                variant="outlined"
                onClick={onClose}
                fullWidth
                disabled={submitLoading}
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
                {mode === "edit" ? "Modifier" : "Créer"}
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default UserForm;
