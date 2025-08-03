import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import axios from "axios";

const PaymentHistory = () => {
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMethod, setFilterMethod] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/paiements")
      .then((res) => setPaiements(res.data))
      .catch((err) => console.error("Erreur chargement paiements", err))
      .finally(() => setLoading(false));
  }, []);

  // 🔎 Appliquer filtres
  const filteredPaiements = paiements
    .filter((p) =>
      filterMethod ? p.moyenPaiement === filterMethod : true
    )
    .filter((p) =>
      p.abonnement?.nom?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.datePaiement) - new Date(a.datePaiement)); // Tri du plus récent au plus ancien

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Historique des paiements
      </Typography>

      {/* Filtres */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="moyen-label">Filtrer par paiement</InputLabel>
          <Select
            labelId="moyen-label"
            value={filterMethod}
            label="Filtrer par paiement"
            onChange={(e) => setFilterMethod(e.target.value)}
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="carte">Carte</MenuItem>
            <MenuItem value="paypal">PayPal</MenuItem>
            <MenuItem value="espece">Espèces</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Rechercher abonnement"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {/* Tableau */}
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Abonnement</TableCell>
                <TableCell>Montant (€)</TableCell>
                <TableCell>Moyen de Paiement</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPaiements.map((paiement) => (
                <TableRow key={paiement.id}>
                  <TableCell>{paiement.abonnement?.nom || paiement.abonnementId}</TableCell>
                  <TableCell>{paiement.montant}</TableCell>
                  <TableCell>{paiement.moyenPaiement}</TableCell>
                  <TableCell>{new Date(paiement.datePaiement).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default PaymentHistory;
