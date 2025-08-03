import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress, Typography, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, TextField, IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const API_URL = "http://localhost:3000/api/acces";

const AccessList = () => {
  const [accesses, setAccesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAccess, setNewAccess] = useState({
    utilisateurId: "",
    abonnementId: "",
    typeAcces: "QR_CODE",
    codeAcces: "",
    dateExpiration: "",
  });

  const fetchAccesses = () => {
    setLoading(true);
    axios.get(API_URL)
      .then((res) => {
        setAccesses(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API accès:", err);
        setError("Erreur lors du chargement des accès");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAccesses();
  }, []);

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => {
    setNewAccess({ utilisateurId: "", abonnementId: "", typeAcces: "QR_CODE", codeAcces: "", dateExpiration: "" });
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    setNewAccess({ ...newAccess, [e.target.name]: e.target.value });
  };

  const handleCreateAccess = () => {
    axios.post(API_URL, newAccess)
      .then(() => {
        fetchAccesses();
        handleDialogClose();
      })
      .catch((err) => {
        console.error("Erreur création:", err);
        alert("Erreur lors de la création");
      });
  };

  const handleDelete = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => fetchAccesses())
      .catch((err) => {
        console.error("Erreur suppression:", err);
        alert("Erreur lors de la suppression");
      });
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleDialogOpen}
        sx={{ mb: 2 }}
      >
        Ajouter un accès
      </Button>

      <TableContainer component={Paper}>
        <Table aria-label="Liste des accès">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Utilisateur ID</TableCell>
              <TableCell>Abonnement ID</TableCell>
              <TableCell>Type d'accès</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Date d'expiration</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accesses.map((acc) => (
              <TableRow key={acc.id}>
                <TableCell>{acc.id}</TableCell>
                <TableCell>{acc.utilisateurId}</TableCell>
                <TableCell>{acc.abonnementId}</TableCell>
                <TableCell>{acc.typeAcces}</TableCell>
                <TableCell>{acc.codeAcces}</TableCell>
                <TableCell>{new Date(acc.dateExpiration).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDelete(acc.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Créer un accès</DialogTitle>
        <DialogContent>
          <TextField label="Utilisateur ID" name="utilisateurId" fullWidth margin="dense" value={newAccess.utilisateurId} onChange={handleInputChange} />
          <TextField label="Abonnement ID" name="abonnementId" fullWidth margin="dense" value={newAccess.abonnementId} onChange={handleInputChange} />
          <TextField label="Code d'accès" name="codeAcces" fullWidth margin="dense" value={newAccess.codeAcces} onChange={handleInputChange} />
          <TextField label="Date expiration" type="datetime-local" name="dateExpiration" fullWidth margin="dense" value={newAccess.dateExpiration} onChange={handleInputChange} InputLabelProps={{ shrink: true }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Annuler</Button>
          <Button variant="contained" onClick={handleCreateAccess}>Créer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AccessList;
