import React, { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/utilisateurs")
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error);
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
    <GenericTable
      title="Liste des utilisateurs"
      columns={columns}
      data={users}
    />
  );
};

export default UserList;
