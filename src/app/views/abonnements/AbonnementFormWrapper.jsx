import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AbonnementForm from "./AbonnementForm"; // Le formulaire d’abonnement à créer aussi
import { CircularProgress, Box } from "@mui/material";

const AbonnementFormWrapper = ({ mode }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [abonnement, setAbonnement] = useState(null);
  const [loading, setLoading] = useState(mode === "edit");

  useEffect(() => {
    if (mode === "edit" && id) {
      const fetchAbonnement = async () => {
        try {
          const res = await fetch(`http://localhost:3000/api/abonnements/${id}`);
          if (!res.ok) throw new Error("Erreur lors du chargement");
          const data = await res.json();
          setAbonnement(data);
        } catch (error) {
          console.error(error);
          // Optionnel : afficher message d’erreur ou rediriger
        } finally {
          setLoading(false);
        }
      };
      fetchAbonnement();
    }
  }, [id, mode]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AbonnementForm
      mode={mode}
      abonnement={mode === "edit" ? abonnement : null}
      onClose={() => navigate("/abonnements")}
    />
  );
};

export default AbonnementFormWrapper;
