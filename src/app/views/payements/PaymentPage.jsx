import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import axios from "axios";

const PaymentPage = () => {
  const [abonnements, setAbonnements] = useState([]);
  const [selectedAbonnement, setSelectedAbonnement] = useState("");
  const [montant, setMontant] = useState("");
  const [moyenPaiement, setMoyenPaiement] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Charger les abonnements (mock ou backend)
  useEffect(() => {
    axios
      .get("http://localhost:3000/abonnements") // Change l’URL si besoin
      .then((res) => {
        setAbonnements(res.data);
      })
      .catch(() => {
        setError("Erreur lors du chargement des abonnements");
      });
  }, []);

  // Met à jour le montant quand abonnement change
  useEffect(() => {
    if (selectedAbonnement) {
      const abo = abonnements.find((a) => a.id === selectedAbonnement);
      setMontant(abo ? abo.prix : "");
    } else {
      setMontant("");
    }
  }, [selectedAbonnement, abonnements]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!selectedAbonnement || !moyenPaiement) {
      setError("Veuillez sélectionner un abonnement et un moyen de paiement");
      return;
    }

    // Exemple payload
    const payload = {
      abonnementId: selectedAbonnement,
      montant: montant,
      moyenPaiement: moyenPaiement,
      datePaiement: new Date().toISOString(),
      utilisateurId: 1, // Id utilisateur mocké ou récupéré du contexte/auth
    };

    axios
      .post("http://localhost:3000/paiements", payload)
      .then(() => {
        setMessage("Paiement effectué avec succès !");
        setSelectedAbonnement("");
        setMontant("");
        setMoyenPaiement("");
      })
      .catch(() => {
        setError("Erreur lors du traitement du paiement");
      });
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Effectuer un Paiement
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="abonnement-label">Abonnement</InputLabel>
          <Select
            labelId="abonnement-label"
            value={selectedAbonnement}
            label="Abonnement"
            onChange={(e) => setSelectedAbonnement(e.target.value)}
          >
            {abonnements.map((abo) => (
              <MenuItem key={abo.id} value={abo.id}>
                {abo.nom} - {abo.prix} €
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Montant"
          variant="outlined"
          value={montant}
          disabled
          fullWidth
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="moyen-label">Moyen de paiement</InputLabel>
          <Select
            labelId="moyen-label"
            value={moyenPaiement}
            label="Moyen de paiement"
            onChange={(e) => setMoyenPaiement(e.target.value)}
          >
            <MenuItem value="carte">Carte bancaire</MenuItem>
            <MenuItem value="paypal">PayPal</MenuItem>
            <MenuItem value="espece">Espèces</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          sx={{ mt: 2 }}
        >
          Payer
        </Button>
      </form>
    </Box>
  );
};

export default PaymentPage;
