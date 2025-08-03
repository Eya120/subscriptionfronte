import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";


const API_BASE = "http://localhost:3000/api"; // adapte selon ton backend

const validationSchema = Yup.object({
  utilisateurId: Yup.number().required("Utilisateur requis"),
  typeAbonnementId: Yup.number().required("Type d'abonnement requis"),
  dateDebut: Yup.date().required("Date début requise"),
  dateFin: Yup.date()
    .min(Yup.ref("dateDebut"), "La date fin doit être après la date début")
    .required("Date fin requise"),
  tarifApplique: Yup.number()
    .positive("Le tarif doit être positif")
    .required("Tarif requis"),
});

export default function Abonnements() {
  const [abonnements, setAbonnements] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [typesAbonnement, setTypesAbonnement] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Chargement données
  useEffect(() => {
    Promise.all([
      axios.get(`${API_BASE}/abonnements`),
      axios.get(`${API_BASE}/utilisateurs`),
      axios.get(`${API_BASE}/type-abonnements`),
    ])
      .then(([abRes, uRes, tRes]) => {
        setAbonnements(abRes.data);
        setUtilisateurs(uRes.data);
        setTypesAbonnement(tRes.data);
      })
      .catch((e) => {
        console.error("Erreur chargement données", e);
        alert("Erreur chargement données");
      })
      .finally(() => setLoading(false));
  }, []);

  // Formik pour formulaire création/modification
  const formik = useFormik({
    initialValues: {
      utilisateurId: "",
      typeAbonnementId: "",
      dateDebut: "",
      dateFin: "",
      tarifApplique: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (editingId) {
          await axios.put(`${API_BASE}/abonnements/${editingId}`, values);
        } else {
          await axios.post(`${API_BASE}/abonnements`, values);
        }
        // Refresh liste
        const res = await axios.get(`${API_BASE}/abonnements`);
        setAbonnements(res.data);
        handleCloseDialog();
      } catch (error) {
        console.error("Erreur sauvegarde", error);
        alert("Erreur lors de la sauvegarde");
      }
    },
    enableReinitialize: true,
  });

  const handleOpenDialog = (abonnement) => {
    if (abonnement) {
      setEditingId(abonnement.id);
      formik.setValues({
        utilisateurId: abonnement.utilisateurId,
        typeAbonnementId: abonnement.typeAbonnementId,
        dateDebut: abonnement.dateDebut.split("T")[0],
        dateFin: abonnement.dateFin.split("T")[0],
        tarifApplique: abonnement.tarifApplique,
      });
    } else {
      setEditingId(null);
      formik.resetForm();
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    formik.resetForm();
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet abonnement ?")) {
      try {
        await axios.delete(`${API_BASE}/abonnements/${id}`);
        setAbonnements((prev) => prev.filter((ab) => ab.id !== id));
      } catch (error) {
        console.error("Erreur suppression", error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Gestion des abonnements
      </Typography>
      <Button variant="contained" onClick={() => handleOpenDialog(null)} sx={{ mb: 2 }}>
        + Ajouter un abonnement
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Utilisateur</TableCell>
              <TableCell>Type abonnement</TableCell>
              <TableCell>Date début</TableCell>
              <TableCell>Date fin</TableCell>
              <TableCell>Tarif (€)</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {abonnements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Aucun abonnement trouvé
                </TableCell>
              </TableRow>
            ) : (
              abonnements.map((ab) => {
                const utilisateur = utilisateurs.find((u) => u.id === ab.utilisateurId);
                const typeAb = typesAbonnement.find((t) => t.id === ab.typeAbonnementId);
                return (
                  <TableRow key={ab.id}>
                    <TableCell>{utilisateur ? `${utilisateur.nom} ${utilisateur.prenom}` : "-"}</TableCell>
                    <TableCell>{typeAb ? typeAb.nom : "-"}</TableCell>
                    <TableCell>{ab.dateDebut.split("T")[0]}</TableCell>
                    <TableCell>{ab.dateFin.split("T")[0]}</TableCell>
                    <TableCell>{ab.tarifApplique.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleOpenDialog(ab)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(ab.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog formulaire */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? "Modifier un abonnement" : "Ajouter un abonnement"}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <TextField
              select
              fullWidth
              margin="normal"
              label="Utilisateur"
              name="utilisateurId"
              value={formik.values.utilisateurId}
              onChange={formik.handleChange}
              error={formik.touched.utilisateurId && Boolean(formik.errors.utilisateurId)}
              helperText={formik.touched.utilisateurId && formik.errors.utilisateurId}
              required
            >
              {utilisateurs.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.nom} {u.prenom}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              margin="normal"
              label="Type d'abonnement"
              name="typeAbonnementId"
              value={formik.values.typeAbonnementId}
              onChange={formik.handleChange}
              error={formik.touched.typeAbonnementId && Boolean(formik.errors.typeAbonnementId)}
              helperText={formik.touched.typeAbonnementId && formik.errors.typeAbonnementId}
              required
            >
              {typesAbonnement.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.nom}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              margin="normal"
              label="Date début"
              type="date"
              name="dateDebut"
              InputLabelProps={{ shrink: true }}
              value={formik.values.dateDebut}
              onChange={formik.handleChange}
              error={formik.touched.dateDebut && Boolean(formik.errors.dateDebut)}
              helperText={formik.touched.dateDebut && formik.errors.dateDebut}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              label="Date fin"
              type="date"
              name="dateFin"
              InputLabelProps={{ shrink: true }}
              value={formik.values.dateFin}
              onChange={formik.handleChange}
              error={formik.touched.dateFin && Boolean(formik.errors.dateFin)}
              helperText={formik.touched.dateFin && formik.errors.dateFin}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              label="Tarif (€)"
              type="number"
              inputProps={{ step: "0.01", min: "0" }}
              name="tarifApplique"
              value={formik.values.tarifApplique}
              onChange={formik.handleChange}
              error={formik.touched.tarifApplique && Boolean(formik.errors.tarifApplique)}
              helperText={formik.touched.tarifApplique && formik.errors.tarifApplique}
              required
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingId ? "Modifier" : "Ajouter"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
