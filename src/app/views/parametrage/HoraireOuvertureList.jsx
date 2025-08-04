import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
} from "@mui/material";
import MaterialTable from "material-table";
import axios from "axios";

const HoraireOuvertureList = () => {
  const [horaires, setHoraires] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingHoraire, setEditingHoraire] = useState(null);

  const fetchHoraires = async () => {
    try {
      const res = await axios.get("http://localhost:3000/horaire-ouverture", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setHoraires(res.data);
    } catch (error) {
      console.error("Erreur de chargement :", error);
    }
  };

  useEffect(() => {
    fetchHoraires();
  }, []);

  const handleSave = async () => {
    try {
      if (editingHoraire?.id) {
        await axios.put(
          `http://localhost:3000/horaire-ouverture/${editingHoraire.id}`,
          editingHoraire,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
      } else {
        await axios.post("http://localhost:3000/horaire-ouverture", editingHoraire, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
      }
      fetchHoraires();
      setOpen(false);
    } catch (error) {
      console.error("Erreur de sauvegarde :", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/horaire-ouverture/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      fetchHoraires();
    } catch (error) {
      console.error("Erreur de suppression :", error);
    }
  };

  return (
    <div className="m-4">
      <MaterialTable
        title="Horaires d’ouverture"
        columns={[
          {
    title: "Jour",
    field: "jour",
    cellStyle: {
      paddingLeft: "20px"  // ajoute un espace à gauche dans la cellule
    },
    headerStyle: {
      paddingLeft: "20px"
    }
  },
          { title: "Heure ouverture", field: "heureOuverture" },
          { title: "Heure fermeture", field: "heureFermeture" },
        ]}
        data={horaires}
        actions={[
          {
            icon: "edit",
            tooltip: "Modifier",
            onClick: (_, rowData) => {
              setEditingHoraire(rowData);
              setOpen(true);
            },
          },
          {
            icon: "delete",
            tooltip: "Supprimer",
            onClick: (_, rowData) => handleDelete(rowData.id),
          },
          {
            icon: "add",
            tooltip: "Ajouter",
            isFreeAction: true,
            onClick: () => {
              setEditingHoraire({
                jour: "",
                heureOuverture: "",
                heureFermeture: "",
              });
              setOpen(true);
            },
          },
        ]}
        options={{ actionsColumnIndex: -1 }}
      />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {editingHoraire?.id ? "Modifier" : "Ajouter"} un horaire
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Jour"
              value={editingHoraire?.jour || ""}
              onChange={(e) =>
                setEditingHoraire({ ...editingHoraire, jour: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Heure ouverture"
              type="time"
              value={editingHoraire?.heureOuverture || ""}
              onChange={(e) =>
                setEditingHoraire({ ...editingHoraire, heureOuverture: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Heure fermeture"
              type="time"
              value={editingHoraire?.heureFermeture || ""}
              onChange={(e) =>
                setEditingHoraire({ ...editingHoraire, heureFermeture: e.target.value })
              }
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleSave}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HoraireOuvertureList;
