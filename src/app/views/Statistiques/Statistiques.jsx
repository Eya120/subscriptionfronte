import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  useTheme,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

import CardMembershipIcon from "@mui/icons-material/CardMembership";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#eb546aff"];

export default function Statistiques() {
  const [resume, setResume] = useState({});
  const [revenusMensuels, setRevenusMensuels] = useState([]);
  const [repartitionAbonnements, setRepartitionAbonnements] = useState([]);
  const [reservationsParService, setReservationsParService] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get("http://localhost:3000/api/statistiques"),
      axios.get("http://localhost:3000/api/statistiques/abonnements-types"),
      axios.get("http://localhost:3000/api/statistiques/reservations-par-service"),
      axios.get("http://localhost:3000/api/statistiques/revenus?periode=annee"),
    ])
      .then(([resResume, resAbonnements, resReservations, resRevenus]) => {
        setResume(resResume.data);
        setRepartitionAbonnements(resAbonnements.data);
        setReservationsParService(resReservations.data);
        setRevenusMensuels(resRevenus.data);
      })
      .catch(() => {
        setResume({});
        setRepartitionAbonnements([]);
        setReservationsParService([]);
        setRevenusMensuels([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Box sx={{ p: 3 }}>
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <img
            src="/logo192.png" // Remplace par le chemin de mon logo
            alt="Logo"
            style={{ width: 120, height: "auto" }}
          />
        </Box>

        <Typography variant="h4" gutterBottom>
          Tableau de bord - Statistiques
        </Typography>

        {/* Cartes de résumé */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: "#e3f2fd",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: theme.shadows[6],
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                 <CardMembershipIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h6">Abonnements</Typography>
                </Box>
                <Typography variant="body2">
                  Actifs: {resume.abonnementsActifs || 0} <br />
                  Expirés: {resume.abonnementsExpires || 0} <br />
                  Suspendus: {resume.abonnementsSuspendus || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: "#fce4ec",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: theme.shadows[6],
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <EventAvailableIcon
                    sx={{ mr: 1, color: theme.palette.secondary.main }}
                  />
                  <Typography variant="h6">Réservations</Typography>
                </Box>
                <Typography variant="body2">
                  Aujourd’hui: {resume.reservationsJour || 0} <br />
                  Ce mois: {resume.reservationsMois || 0} <br />
                  Total: {resume.reservationsTotal || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: "#e8f5e9",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: theme.shadows[6],
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <MonetizationOnIcon
                    sx={{ mr: 1, color: theme.palette.success.main }}
                  />
                  <Typography variant="h6">Revenus</Typography>
                </Box>
                <Typography variant="body2">
                  Aujourd’hui: {resume.revenusJour || 0} € <br />
                  Ce mois: {resume.revenusMois || 0} € <br />
                  Cette année: {resume.revenusAnnee || 0} €
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Graphe des revenus mensuels */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Évolution des revenus mensuels (€)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenusMensuels}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="montant"
                      stroke={theme.palette.primary.main}
                      strokeWidth={2}
                      isAnimationActive={true}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Répartition des abonnements */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Répartition des abonnements
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={repartitionAbonnements}
                      dataKey="value"
                      nameKey="label"
                      outerRadius={80}
                      label
                      isAnimationActive={true}
                      animationDuration={1500}
                    >
                      {repartitionAbonnements.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Répartition des réservations par service */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Réservations par service
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={reservationsParService}
                      dataKey="value"
                      nameKey="label"
                      outerRadius={80}
                      label
                      isAnimationActive={true}
                      animationDuration={1500}
                    >
                      {reservationsParService.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[(index + 2) % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
}
