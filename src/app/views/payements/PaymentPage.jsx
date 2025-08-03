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
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const PaymentPage = () => {
  const [abonnements, setAbonnements] = useState([]);
  const [selectedAbonnement, setSelectedAbonnement] = useState("");
  const [montant, setMontant] = useState("");
  const [moyenPaiement, setMoyenPaiement] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingAbonnements, setLoadingAbonnements] = useState(false);

  useEffect(() => {
    setLoadingAbonnements(true);
    axios
      .get("http://localhost:3000/abonnements")
      .then((res) => {
        setAbonnements(res.data);
      })
      .catch(() => {
        setError("Erreur lors du chargement des abonnements");
      })
      .finally(() => {
        setLoadingAbonnements(false);
      });
  }, []);

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

    setLoading(true);

    // Ici récupérer utilisateurId depuis le contexte/auth si possible
    const payload = {
      abonnementId: selectedAbonnement,
      montant: montant,
      moyenPaiement: moyenPaiement,
      datePaiement: new Date().toISOString(),
      utilisateurId: 1,
    };

    axios
      .post("http://localhost:3000/paiements", payload)
      .then(() => {
        setMessage("Paiement effectué avec succès !");
        setSelectedAbonnement("");
        setMontant("");
        setMoyenPaiement("");
      })
      .catch((error) => {
        const errMsg =
          error.response?.data?.message || "Erreur lors du traitement du paiement";
        setError(errMsg);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Box sx={{ maxWidth: 450, mx: "auto", mt: 6, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom textAlign="center">
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

      {loadingAbonnements ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal" required>
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

          <FormControl fullWidth margin="normal" required>
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
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? "Traitement..." : "Payer"}
          </Button>
        </form>
      )}
    </Box>
  );
};

export default PaymentPage;
