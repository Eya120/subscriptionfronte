import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserForm from "./UserForm";

const UserFormWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3000/api/utilisateurs/${id}`)
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(() => {
          alert("Erreur lors du chargement de l'utilisateur");
          navigate("/utilisateurs");
        });
    }
  }, [id, navigate]);

  const handleClose = () => {
    navigate("/utilisateurs");
  };

  if (id && !user) return <div>Chargement...</div>;

  return <UserForm mode={id ? "edit" : "create"} user={user} onClose={handleClose} />;
};

export default UserFormWrapper;
