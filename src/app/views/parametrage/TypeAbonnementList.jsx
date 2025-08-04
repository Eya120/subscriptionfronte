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

const TypeAbonnementList = () => {
  const [types, setTypes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);

  const fetchTypes = async () => {
    try {
      const res = await axios.get("http://localhost:3000/type-abonnement", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setTypes(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des types :", error);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleSave = async () => {
    try {
      if (editingType.id) {
        await axios.put(`http://localhost:3000/type-abonnement/${editingType.id}`, editingType, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
      } else {
        await axios.post("http://localhost:3000/type-abonnement", editingType, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
      }
      fetchTypes();
      setOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/type-abonnement/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      fetchTypes();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  return (
    <div className="m-4">
      <MaterialTable
        title="Types d'abonnement"
        columns={[
           {
    title: "Nom",
    field: "name",
    cellStyle: {
      paddingLeft: "20px"  // ajoute un espace à gauche dans la cellule
    },
    headerStyle: {
      paddingLeft: "20px"
    }
  },
          { title: "Description", field: "description" },
          { title: "Durée (jours)", field: "duree" },
          { title: "Prix (€)", field: "prix" },
        ]}
        data={types}
        actions={[
          {
            icon: "edit",
            tooltip: "Modifier",
            onClick: (_, rowData) => {
              setEditingType(rowData);
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
              setEditingType({ nom: "", description: "", duree: "", prix: "" });
              setOpen(true);
            },
          },
        ]}
        options={{
          actionsColumnIndex: -1,
        }}
      />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editingType?.id ? "Modifier" : "Ajouter"} un type d’abonnement</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nom"
              value={editingType?.nom || ""}
              onChange={(e) => setEditingType({ ...editingType, nom: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={editingType?.description || ""}
              onChange={(e) => setEditingType({ ...editingType, description: e.target.value })}
              fullWidth
            />
            <TextField
              label="Durée (jours)"
              type="number"
              value={editingType?.duree || ""}
              onChange={(e) => setEditingType({ ...editingType, duree: e.target.value })}
              fullWidth
            />
            <TextField
              label="Prix (€)"
              type="number"
              value={editingType?.prix || ""}
              onChange={(e) => setEditingType({ ...editingType, prix: e.target.value })}
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

export default TypeAbonnementList;
