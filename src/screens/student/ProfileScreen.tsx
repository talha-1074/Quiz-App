// src/screens/student/ProfileScreen.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { Result } from "../../types";

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/student/history")
      .then((res) => setResults(res.data))
      .finally(() => setLoading(false));
  }, []);

  // Calculate stats
  const totalAttempts = results.length;
  const totalPassed = results.filter((r) => r.passed).length;
  const totalFailed = results.filter((r) => !r.passed).length;
  const avgScore =
    totalAttempts > 0
      ? Math.round(
          results.reduce((sum, r) => sum + r.percent, 0) / totalAttempts,
        )
      : 0;
  const bestScore =
    totalAttempts > 0 ? Math.max(...results.map((r) => r.percent)) : 0;

  // Get avatar initials from name
  const initials = user?.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>My Profile</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar and name */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>🎓 Student</Text>
          </View>
        </View>

        {/* Stats */}
        <Text style={styles.sectionTitle}>My Statistics</Text>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderTopColor: "#2563eb" }]}>
            <Text style={[styles.statNum, { color: "#2563eb" }]}>
              {totalAttempts}
            </Text>
            <Text style={styles.statLabel}>Total Attempts</Text>
          </View>
          <View style={[styles.statCard, { borderTopColor: "#16a34a" }]}>
            <Text style={[styles.statNum, { color: "#16a34a" }]}>
              {totalPassed}
            </Text>
            <Text style={styles.statLabel}>Passed</Text>
          </View>
          <View style={[styles.statCard, { borderTopColor: "#dc2626" }]}>
            <Text style={[styles.statNum, { color: "#dc2626" }]}>
              {totalFailed}
            </Text>
            <Text style={styles.statLabel}>Failed</Text>
          </View>
          <View style={[styles.statCard, { borderTopColor: "#f59e0b" }]}>
            <Text style={[styles.statNum, { color: "#f59e0b" }]}>
              {avgScore}%
            </Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
        </View>

        {/* Best score */}
        {totalAttempts > 0 && (
          <View style={styles.bestScoreCard}>
            <Text style={styles.bestScoreLabel}>🏆 Best Score</Text>
            <Text style={styles.bestScoreNum}>{bestScore}%</Text>
          </View>
        )}

        {/* Action Buttons */}
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <Text style={styles.actionBtnIcon}>🔒</Text>
          <Text style={styles.actionBtnText}>Change Password</Text>
          <Text style={styles.actionBtnArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate("QuizHistory")}
        >
          <Text style={styles.actionBtnIcon}>📊</Text>
          <Text style={styles.actionBtnText}>View Quiz History</Text>
          <Text style={styles.actionBtnArrow}>→</Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  topbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backBtn: { color: "#2563eb", fontSize: 15, fontWeight: "600" },
  topbarTitle: { fontSize: 17, fontWeight: "bold", color: "#1e293b" },

  content: { padding: 20, paddingBottom: 40 },

  profileHeader: { alignItems: "center", marginBottom: 32 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  avatarText: { fontSize: 32, fontWeight: "bold", color: "#fff" },
  name: { fontSize: 22, fontWeight: "bold", color: "#1e293b" },
  email: { fontSize: 14, color: "#94a3b8", marginTop: 4 },
  roleBadge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },
  roleBadgeText: { color: "#2563eb", fontWeight: "600", fontSize: 13 },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderTopWidth: 4,
    elevation: 1,
    alignItems: "center",
  },
  statNum: { fontSize: 28, fontWeight: "bold" },
  statLabel: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 4,
    textAlign: "center",
  },

  bestScoreCard: {
    backgroundColor: "#fef3c7",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#fcd34d",
  },
  bestScoreLabel: { fontSize: 16, fontWeight: "bold", color: "#92400e" },
  bestScoreNum: { fontSize: 28, fontWeight: "bold", color: "#92400e" },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 12,
  },
  actionBtnIcon: { fontSize: 20 },
  actionBtnText: { flex: 1, fontSize: 15, fontWeight: "600", color: "#1e293b" },
  actionBtnArrow: { fontSize: 18, color: "#cbd5e1" },

  logoutBtn: {
    backgroundColor: "#fee2e2",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginTop: 16,
  },
  logoutBtnText: { color: "#dc2626", fontWeight: "bold", fontSize: 15 },
});
