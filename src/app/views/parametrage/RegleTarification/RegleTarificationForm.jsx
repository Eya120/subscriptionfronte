import React, { useEffect, useState } from "react";
import { Button, DialogActions, DialogContent, Stack, TextField, Typography, Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const RegleTarificationForm = () => {
  const [regle, setRegle] = useState({
    jour: "",
    heureDebut: "",
    heureFin: "",
    tarif: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id && id !== "new") {
      // Chargement des données pour modification
      axios.get(`http://localhost:3000/regle-tarification/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      })
      .then(res => setRegle(res.data))
      .catch(err => console.error("Erreur de chargement :", err));
    }
  }, [id]);

  const handleSave = async () => {
    try {
      if (id && id !== "new") {
        await axios.put(`http://localhost:3000/regle-tarification/${id}`, regle, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
      } else {
        await axios.post("http://localhost:3000/regle-tarification", regle, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
      }
      navigate("/parametrage/regle-tarification");
    } catch (error) {
      console.error("Erreur de sauvegarde :", error);
    }
  };

  return (
    <Box mx="auto" maxWidth={500} p={3}>
      <Typography variant="h5" mb={3}>
        {id && id !== "new" ? "Modifier une règle" : "Ajouter une règle"}
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Jour"
          value={regle.jour}
          onChange={(e) => setRegle({ ...regle, jour: e.target.value })}
          fullWidth
        />
        <TextField
          label="Heure début"
          type="time"
          value={regle.heureDebut}
          onChange={(e) => setRegle({ ...regle, heureDebut: e.target.value })}
          fullWidth
        />
        <TextField
          label="Heure fin"
          type="time"
          value={regle.heureFin}
          onChange={(e) => setRegle({ ...regle, heureFin: e.target.value })}
          fullWidth
        />
        <TextField
          label="Tarif (€)"
          type="number"
          value={regle.tarif}
          onChange={(e) => setRegle({ ...regle, tarif: e.target.value })}
          fullWidth
        />
      </Stack>
      <DialogActions sx={{ mt: 3 }}>
        <Button onClick={() => navigate("/parametrage/regle-tarification")}>Annuler</Button>
        <Button variant="contained" onClick={handleSave}>Enregistrer</Button>
      </DialogActions>
    </Box>
  );
};

export default RegleTarificationForm;
