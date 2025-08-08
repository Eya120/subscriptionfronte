import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const PaiementsForm = ({ initialData = {}, onSubmit }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    utilisateurId: initialData.utilisateurId || "",
    abonnementId: initialData.abonnementId || "",
    montant: initialData.montant || "",
    modePaiement: initialData.modePaiement || "ESPECES",
    datePaiement: initialData.datePaiement || new Date().toISOString().slice(0, 10),
    referenceTransaction: initialData.referenceTransaction || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleCancel = () => {
    navigate("/payements/historique");
  };

  return (
    <Card>
      <CardContent>
        {/* Titre centré */}
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          fontWeight="bold"
          sx={{ mb: 3 }}
        >
          {initialData.id ? "Modifier un paiement" : "Nouveau paiement"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* ... les autres champs ... */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="ID Utilisateur"
                name="utilisateurId"
                value={formData.utilisateurId}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="ID Abonnement"
                name="abonnementId"
                value={formData.abonnementId}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Montant"
                type="number"
                name="montant"
                value={formData.montant}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Mode de Paiement"
                name="modePaiement"
                value={formData.modePaiement}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="ESPECES">Espèces</MenuItem>
                <MenuItem value="CARTE">Carte Bancaire</MenuItem>
                <MenuItem value="VIREMENT">Virement</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Date du Paiement"
                type="date"
                name="datePaiement"
                value={formData.datePaiement}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Référence Transaction"
                name="referenceTransaction"
                value={formData.referenceTransaction}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            {/* Boutons agrandis et espacés */}
            <Grid
              item
              xs={12}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={1}
            >
              <Button
  type="submit"
  variant="contained"
  color="primary"
  fullWidth
  sx={{ py: 1, fontSize: "1rem", width: 200}} // padding vertical un peu réduit, taille texte normale
>
  {initialData.id ? "Mettre à jour" : "Enregistrer"}
</Button>
<Button
  variant="outlined"
  color="primary"
  fullWidth
  onClick={handleCancel}
  sx={{ py: 1.2, fontSize: "1rem",width: 200 }}
>
  Annuler
</Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaiementsForm;
