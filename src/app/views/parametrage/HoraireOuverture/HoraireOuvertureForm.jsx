import React, { useEffect, useState } from "react";
import {
  Button,
  Stack,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const HoraireOuvertureForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [horaire, setHoraire] = useState({
    jour: "",
    heureOuverture: "",
    heureFermeture: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id && id !== "new") {
      setLoading(true);
      axios
        .get(`http://localhost:3000/horaire-ouverture/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((res) => setHoraire(res.data))
        .catch((err) => console.error("Erreur de chargement :", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSave = async () => {
    try {
      if (id && id !== "new") {
        await axios.put(
          `http://localhost:3000/horaire-ouverture/${id}`,
          horaire,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
      } else {
        await axios.post(
          "http://localhost:3000/horaire-ouverture",
          horaire,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
      }
      navigate("/horaire-ouverture");
    } catch (error) {
      console.error("Erreur de sauvegarde :", error);
    }
  };

  return (
    <Box mx="auto" maxWidth={600} mt={5} p={3}>
      <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
        {id && id !== "new" ? "Modifier un horaire" : "Ajouter un horaire"}
      </Typography>
      <Stack spacing={3}>
        <TextField
          label="Jour"
          value={horaire.jour}
          onChange={(e) => setHoraire({ ...horaire, jour: e.target.value })}
          fullWidth
        />
        <TextField
          label="Heure ouverture"
          type="time"
          value={horaire.heureOuverture}
          onChange={(e) => setHoraire({ ...horaire, heureOuverture: e.target.value })}
          fullWidth
        />
        <TextField
          label="Heure fermeture"
          type="time"
          value={horaire.heureFermeture}
          onChange={(e) => setHoraire({ ...horaire, heureFermeture: e.target.value })}
          fullWidth
        />
        <Box display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={() => navigate("/parametrage/horaire-ouverture")}>
            Annuler
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={loading}>
            Enregistrer
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default HoraireOuvertureForm;
