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

const RegleTarificationList = () => {
  const [regles, setRegles] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingRegle, setEditingRegle] = useState(null);

  const fetchRegles = async () => {
    try {
      const res = await axios.get("http://localhost:3000/regle-tarification", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setRegles(res.data);
    } catch (error) {
      console.error("Erreur de chargement :", error);
    }
  };

  useEffect(() => {
    fetchRegles();
  }, []);

  const handleSave = async () => {
    try {
      if (editingRegle?.id) {
        await axios.put(`http://localhost:3000/regle-tarification/${editingRegle.id}`, editingRegle, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
      } else {
        await axios.post("http://localhost:3000/regle-tarification", editingRegle, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
      }
      fetchRegles();
      setOpen(false);
    } catch (error) {
      console.error("Erreur de sauvegarde :", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/regle-tarification/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      fetchRegles();
    } catch (error) {
      console.error("Erreur de suppression :", error);
    }
  };

  return (
    <div className="m-4">
      <MaterialTable
        title="Règles de tarification"
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
          { title: "Heure début", field: "heureDebut" },
          { title: "Heure fin", field: "heureFin" },
          { title: "Tarif (€)", field: "tarif" },
        ]}
        data={regles}
        actions={[
          {
            icon: "edit",
            tooltip: "Modifier",
            onClick: (_, rowData) => {
              setEditingRegle(rowData);
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
              setEditingRegle({
                jour: "",
                heureDebut: "",
                heureFin: "",
                tarif: "",
              });
              setOpen(true);
            },
          },
        ]}
        options={{ actionsColumnIndex: -1 }}
      />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {editingRegle?.id ? "Modifier" : "Ajouter"} une règle
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Jour"
              value={editingRegle?.jour || ""}
              onChange={(e) =>
                setEditingRegle({ ...editingRegle, jour: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Heure début"
              type="time"
              value={editingRegle?.heureDebut || ""}
              onChange={(e) =>
                setEditingRegle({ ...editingRegle, heureDebut: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Heure fin"
              type="time"
              value={editingRegle?.heureFin || ""}
              onChange={(e) =>
                setEditingRegle({ ...editingRegle, heureFin: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Tarif (€)"
              type="number"
              value={editingRegle?.tarif || ""}
              onChange={(e) =>
                setEditingRegle({ ...editingRegle, tarif: e.target.value })
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

export default RegleTarificationList;
