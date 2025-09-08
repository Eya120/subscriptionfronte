import React, { useEffect, useState } from "react";
import { Button, Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import GenericTable from "../../components/GenericTable";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/api/utilisateurs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Non autorisé - veuillez vous connecter");
        } else {
          throw new Error(`Erreur HTTP ${res.status}`);
        }
      }
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      console.error("Erreur fetch utilisateurs :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { header: "ID", field: "id" },
    { header: "Nom", field: "nom" },
    { header: "Prénom", field: "prenom" },
    { header: "Email", field: "email" },
    { header: "Rôle", field: "role" },
    {
      header: "Actions",
      render: (row) => (
        <Box display="flex" justifyContent="center">
          <IconButton onClick={() => navigate(`/utilisateurs/edit/${row.id}`)}>
            <Edit />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight="bold">
          Liste des utilisateurs
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/utilisateurs/new")}>
          Ajouter un utilisateur
        </Button>
      </Box>

      {error && <Typography color="error" mb={2}>{error}</Typography>}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <GenericTable columns={columns} data={users} />
      )}
    </Box>
  );
};

export default UserList;
