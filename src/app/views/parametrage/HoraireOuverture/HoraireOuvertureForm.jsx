import React, { useEffect, useState } from "react";
import { Button, TextField, Stack, Typography, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { horaireOuvertureService } from "../../services/horaireOuvertureService";

const HoraireOuvertureForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [horaire, setHoraire] = useState({ jour: "", heureOuverture: "", heureFermeture: "" });
  const isEdit = Boolean(id && id !== "new");

  useEffect(() => {
    if (isEdit) {
      horaireOuvertureService.getById(id)
        .then(res => setHoraire(res.data))
        .catch(err => console.error(err));
    }
  }, [id, isEdit]);

  const handleSave = async () => {
    try {
      if (isEdit) {
        await horaireOuvertureService.update(id, horaire);
      } else {
        await horaireOuvertureService.create(horaire);
      }
      navigate("/parametrage/horaire-ouverture");
    } catch (error) {
      console.error("Erreur de sauvegarde :", error);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: "20px auto" }}>
      <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
        {isEdit ? "Modifier" : "Ajouter"} un horaire d’ouverture
      </Typography>
      <Stack spacing={2}>
        <TextField label="Jour" value={horaire.jour} onChange={(e) => setHoraire({ ...horaire, jour: e.target.value })} fullWidth />
        <TextField label="Heure ouverture" type="time" value={horaire.heureOuverture} onChange={(e) => setHoraire({ ...horaire, heureOuverture: e.target.value })} fullWidth />
        <TextField label="Heure fermeture" type="time" value={horaire.heureFermeture} onChange={(e) => setHoraire({ ...horaire, heureFermeture: e.target.value })} fullWidth />
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={() => navigate("/parametrage/horaire-ouverture")}>Annuler</Button>
          <Button variant="contained" onClick={handleSave}>Enregistrer</Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default HoraireOuvertureForm;
