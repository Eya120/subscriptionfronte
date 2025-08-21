import React, { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token"); // Récupération du token

    fetch("http://localhost:3000/api/utilisateurs", {
      headers: {
        Authorization: `Bearer ${token}`, // Envoi du token dans l'entête
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Non autorisé - veuillez vous connecter");
          } else {
            throw new Error(`Erreur HTTP ${res.status}`);
          }
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        setError(err.message);
        console.error("Erreur fetch utilisateurs :", err);
      });
  }, []);

  const columns = [
    { header: "ID", field: "id" },
    { header: "Nom", field: "nom" },
    { header: "Prénom", field: "prenom" },
    { header: "Email", field: "email" },
    { header: "Rôle", field: "role" },
    {
      header: "Actions",
      render: (row) => (
        <button onClick={() => console.log("Modifier", row.id)}>Modifier</button>
      ),
    },
  ];

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <GenericTable title="Liste des utilisateurs" columns={columns} data={users} />
    </div>
  );
};

export default UserList;
