import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const TypeAbonnementForm = () => {
  const [type, setType] = useState({ nom: "", description: "", duree: "", prix: "" });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id && id !== "new") {
      axios.get(`http://localhost:3000/type-abonnement/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      }).then(res => setType(res.data))
        .catch(err => console.error(err));
    }
  }, [id]);

  const handleSave = async () => {
    try {
      if (id && id !== "new") {
        await axios.put(`http://localhost:3000/type-abonnement/${id}`, type, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        });
      } else {
        await axios.post("http://localhost:3000/type-abonnement", type, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        });
      }
      navigate("/parametrage/type-abonnement");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: "20px auto" }}>
      <Typography variant="h5" gutterBottom>
        {id === "new" ? "Ajouter" : "Modifier"} un type d’abonnement
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Nom"
          value={type.nom}
          onChange={(e) => setType({ ...type, nom: e.target.value })}
          fullWidth
        />
        <TextField
          label="Description"
          value={type.description}
          onChange={(e) => setType({ ...type, description: e.target.value })}
          fullWidth
        />
        <TextField
          label="Durée (jours)"
          type="number"
          value={type.duree}
          onChange={(e) => setType({ ...type, duree: e.target.value })}
          fullWidth
        />
        <TextField
          label="Prix (€)"
          type="number"
          value={type.prix}
          onChange={(e) => setType({ ...type, prix: e.target.value })}
          fullWidth
        />
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={() => navigate("/parametrage/type-abonnement")}>
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

export default TypeAbonnementForm;
