import React, { useEffect, useState } from "react";
import { Button, TextField, Stack, Typography, Paper, MenuItem } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { regleTarificationService } from "../../services/regleTarificationService";

const jours = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
const typesAbonnement = [
  { id: 1, nom: "Abonnement Mensuel" },
  { id: 2, nom: "Abonnement Annuel" },
  { id: 3, nom: "Abonnement Hebdomadaire" }
];

const RegleTarificationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [regle, setRegle] = useState({
    typeAbonnementId: "",
    jour: "",
    heureDebut: "",
    heureFin: "",
    tarif: ""
  });

  const isEdit = Boolean(id && id !== "new");

  useEffect(() => {
    if (isEdit) {
      regleTarificationService.getById(id)
        .then(res => {
          if(res.data){
            const r = res.data;
            setRegle({
              typeAbonnementId: r.typeAbonnement?.id || "",
              jour: r.jour || "",
              heureDebut: r.heureDebut || "",
              heureFin: r.heureFin || "",
              tarif: r.tarif || ""
            });
          }
        })
        .catch(err => console.error(err));
    }
  }, [id, isEdit]);

  const handleSave = async () => {
    try {
      const payload = {
        typeAbonnementId: regle.typeAbonnementId,
        jour: regle.jour,
        heureDebut: regle.heureDebut,
        heureFin: regle.heureFin,
        tarif: Number(regle.tarif)
      };

      if (isEdit) {
        await regleTarificationService.update(id, payload);
      } else {
        await regleTarificationService.create(payload);
      }
      navigate("/parametrage/regle-tarification");
    } catch (error) {
      console.error("Erreur de sauvegarde :", error);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: "20px auto" }}>
      <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
        {isEdit ? "Modifier" : "Ajouter"} une règle de tarification
      </Typography>

      <Stack spacing={2}>
        <TextField
          select
          label="Type d'abonnement"
          value={regle.typeAbonnementId}
          onChange={(e) => setRegle({ ...regle, typeAbonnementId: e.target.value })}
          fullWidth
        >
          {typesAbonnement.map(t => <MenuItem key={t.id} value={t.id}>{t.nom}</MenuItem>)}
        </TextField>

        <TextField
          select
          label="Jour"
          value={regle.jour}
          onChange={(e) => setRegle({ ...regle, jour: e.target.value })}
          fullWidth
        >
          {jours.map(j => <MenuItem key={j} value={j}>{j}</MenuItem>)}
        </TextField>

        <TextField
          label="Heure début"
          type="time"
          value={regle.heureDebut}
          onChange={(e) => setRegle({ ...regle, heureDebut: e.target.value })}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Heure fin"
          type="time"
          value={regle.heureFin}
          onChange={(e) => setRegle({ ...regle, heureFin: e.target.value })}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Tarif (€)"
          type="number"
          value={regle.tarif}
          onChange={(e) => setRegle({ ...regle, tarif: e.target.value })}
          fullWidth
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={() => navigate("/parametrage/regle-tarification")}>
            Annuler
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Enregistrer
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default RegleTarificationForm;
