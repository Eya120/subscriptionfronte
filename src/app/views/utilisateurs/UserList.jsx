import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
} from "@mui/material";
import MaterialTable from "material-table";
import axios from "axios";
import { SimpleCard } from "app/components";
import UserForm from "./UserForm";
import { Typography } from "@mui/material";

const roleOptions = [
  { value: "admin", label: "Administrateur" },
  { value: "user", label: "Utilisateur" },
  { value: "coach", label: "Coach" },
];

const roleLabel = (role) => {
  const found = roleOptions.find((r) => r.value === role);
  return found ? found.label : role;
};

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:3000/api/utilisateurs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erreur lors du chargement des utilisateurs",
        severity: "error",
      });
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
        await axios.delete(`http://localhost:3000/api/utilisateurs/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsers();
        setSnackbar({
          open: true,
          message: "Utilisateur supprimé avec succès",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Erreur lors de la suppression",
          severity: "error",
        });
      }
    }
  };

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (values.id) {
        await axios.put(`http://localhost:3000/api/utilisateurs/${values.id}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSnackbar({ open: true, message: "Utilisateur modifié avec succès", severity: "success" });
      } else {
        // Plus de création via ce formulaire (ajout supprimé)
        setSnackbar({ open: true, message: "Ajout désactivé", severity: "warning" });
      }
      setOpen(false);
      fetchUsers();
    } catch (error) {
      setSnackbar({ open: true, message: "Erreur lors de la sauvegarde", severity: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box m={-1}>
      <SimpleCard
  title={
    <Typography variant="h4" mb={3} textAlign="center" fontWeight="bold">
      Liste des utilisateurs
    </Typography>
  }
>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <MaterialTable
            title=""
            columns={[
              {
                title: "ID",
                field: "id",
                editable: "never",
                cellStyle: { paddingLeft: "20px" },
                headerStyle: { paddingLeft: "20px" },
              },
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
            ]}
          />
        )}

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editingUser?.id ? "Modifier" : "Créer"} un utilisateur</DialogTitle>
          <DialogContent>
            <UserForm
              initialValues={editingUser || { nom: "", prenom: "", email: "", role: "", password: "" }}
              onSubmit={handleFormSubmit}
              onCancel={() => setOpen(false)}
            />
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
