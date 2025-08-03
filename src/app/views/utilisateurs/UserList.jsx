import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import MaterialTable from "material-table";
import axios from "axios";
import { SimpleCard } from "app/components";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const roleOptions = [
  { value: "admin", label: "Administrateur" },
  { value: "user", label: "Utilisateur" },
  { value: "coach", label: "Coach" },
];

const roleLabel = (role) => {
  const found = roleOptions.find((r) => r.value === role);
  return found ? found.label : role;
};

const validationSchema = Yup.object({
  nom: Yup.string().required("Le nom est requis"),
  prenom: Yup.string().required("Le prénom est requis"),
  email: Yup.string().email("Email invalide").required("L'email est requis"),
  role: Yup.string().oneOf(roleOptions.map((r) => r.value)).required("Le rôle est requis"),
  password: Yup.string().when("id", {
    is: (id) => !id, // si pas d'id = création, password requis
    then: Yup.string().required("Le mot de passe est requis").min(6, "Minimum 6 caractères"),
    otherwise: Yup.string().notRequired(),
  }),
});

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:3000/utilisateurs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      setSnackbar({ open: true, message: "Erreur lors du chargement des utilisateurs", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    const token = localStorage.getItem("accessToken");
    if (window.confirm("Confirmer la suppression ?")) {
      try {
        await axios.delete(`http://localhost:3000/utilisateurs/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsers();
        setSnackbar({ open: true, message: "Utilisateur supprimé avec succès", severity: "success" });
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        setSnackbar({ open: true, message: "Erreur lors de la suppression", severity: "error" });
      }
    }
  };

  return (
    <Box m={-1}>
      <SimpleCard title="Liste des utilisateurs">
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <MaterialTable
            title=""
            columns={[
              { title: "ID", field: "id", editable: "never" },
              { title: "Nom", field: "nom" },
              { title: "Prénom", field: "prenom" },
              { title: "Email", field: "email" },
              {
                title: "Rôle",
                field: "role",
                render: (rowData) => roleLabel(rowData.role),
                editable: "never",
              },
            ]}
            data={users}
            options={{
              search: true,
              paging: true,
              sorting: true,
              actionsColumnIndex: 5,
            }}
            actions={[
              {
                icon: "edit",
                tooltip: "Modifier",
                onClick: (event, rowData) => {
                  setEditingUser(rowData);
                  setOpen(true);
                },
              },
              {
                icon: "delete",
                tooltip: "Supprimer",
                onClick: (event, rowData) => handleDelete(rowData.id),
              },
              {
                icon: "add",
                tooltip: "Ajouter un utilisateur",
                isFreeAction: true,
                onClick: () => {
                  setEditingUser({ nom: "", prenom: "", email: "", role: "" });
                  setOpen(true);
                },
              },
            ]}
          />
        )}

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editingUser?.id ? "Modifier" : "Créer"} un utilisateur</DialogTitle>
          <DialogContent>
            <Formik
              initialValues={editingUser || { nom: "", prenom: "", email: "", role: "", password: "" }}
              validationSchema={validationSchema}
              enableReinitialize
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const token = localStorage.getItem("accessToken");
                  if (values.id) {
                    await axios.put(`http://localhost:3000/utilisateurs/${values.id}`, values, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    setSnackbar({ open: true, message: "Utilisateur modifié avec succès", severity: "success" });
                  } else {
                    await axios.post("http://localhost:3000/utilisateurs", values, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    setSnackbar({ open: true, message: "Utilisateur créé avec succès", severity: "success" });
                  }
                  setOpen(false);
                  fetchUsers();
                } catch (error) {
                  console.error("Erreur lors de la sauvegarde :", error.response?.data || error.message);
                  setSnackbar({ open: true, message: "Erreur lors de la sauvegarde", severity: "error" });
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ submitForm, isSubmitting, isValid }) => (
                <Form>
                  {editingUser?.id && (
                    <Field
                      as={TextField}
                      name="id"
                      label="ID"
                      fullWidth
                      margin="dense"
                      disabled
                    />
                  )}

                  <Box sx={{ marginLeft: "0.5cm", marginRight: "0.5cm" }}>
                    <Field
                      as={TextField}
                      name="nom"
                      label="Nom"
                      fullWidth
                      margin="dense"
                    />
                  </Box>
                  <Box sx={{ marginLeft: "0.5cm", marginRight: "0.5cm" }}>
                    <Field
                      as={TextField}
                      name="prenom"
                      label="Prénom"
                      fullWidth
                      margin="dense"
                    />
                  </Box>
                  <Box sx={{ marginLeft: "0.5cm", marginRight: "0.5cm" }}>
                    <Field
                      as={TextField}
                      name="email"
                      label="Email"
                      fullWidth
                      margin="dense"
                    />
                  </Box>
                  <Box sx={{ marginLeft: "0.5cm", marginRight: "0.5cm" }}>
                    <Field
                      name="role"
                      label="Rôle"
                      select
                      fullWidth
                      margin="dense"
                      as={TextField}
                    >
                      {roleOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Field>
                  </Box>

                  {!editingUser?.id && (
                    <Box sx={{ marginLeft: "0.5cm", marginRight: "0.5cm" }}>
                      <Field
                        as={TextField}
                        type="password"
                        name="password"
                        label="Mot de passe"
                        fullWidth
                        margin="dense"
                      />
                    </Box>
                  )}

                  <DialogActions>
                    <Button onClick={() => setOpen(false)} disabled={isSubmitting}>
                      Annuler
                    </Button>
                    <Button
                      onClick={submitForm}
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting || !isValid}
                    >
                      {editingUser?.id ? "Modifier" : "Créer"}
                    </Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      </SimpleCard>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
