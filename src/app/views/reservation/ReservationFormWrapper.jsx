import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReservationForm from "./ReservationForm";

const ReservationFormWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dataSources, setDataSources] = useState({
    abonnements: [],
    services: [],
    utilisateurs: [],
  });
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resAbonnements, resServices, resUsers] = await Promise.all([
          fetch("http://localhost:3000/api/abonnements"),
          fetch("http://localhost:3000/api/services"),
          fetch("http://localhost:3000/api/utilisateurs"),
        ]);
        const abonnementsData = await resAbonnements.json();
        const servicesData = await resServices.json();
        const utilisateursData = await resUsers.json();

        setDataSources({ abonnements: abonnementsData, services: servicesData, utilisateurs: utilisateursData });

        if (id) {
          const resReservation = await fetch(`http://localhost:3000/api/reservations/${id}`);
          const reservationData = await resReservation.json();
          setReservation(reservationData);
        }
        setLoading(false);
      } catch (error) {
        setErrorMessage("Erreur lors du chargement des données");
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (values, formikHelpers) => {
    setSubmitLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const url = id
        ? `http://localhost:3000/api/reservations/${id}`
        : "http://localhost:3000/api/reservations";
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erreur lors de la sauvegarde");
      }

      setSuccessMessage(id ? "Réservation mise à jour avec succès !" : "Réservation créée avec succès !");
      formikHelpers.resetForm();
      setTimeout(() => navigate("/reservations"), 1000);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setSubmitLoading(false);
  };

  return (
    <ReservationForm
      mode={id ? "edit" : "create"}
      reservation={reservation}
      dataSources={dataSources}
      onSubmit={handleSubmit}
      onClose={() => navigate("/reservations")}
      loading={loading}
      submitLoading={submitLoading}
      errorMessage={errorMessage}
      successMessage={successMessage}
    />
  );
};

export default ReservationFormWrapper;
