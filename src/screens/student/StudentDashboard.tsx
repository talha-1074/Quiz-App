// src/screens/student/StudentDashboard.tsx

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function StudentDashboard({ navigation }: any) {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.name}>{user?.name}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>Student</Text>
          </View>
        </View>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>What would you like to do?</Text>

        {/* Join Quiz */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("JoinQuiz")}
        >
          <View style={[styles.cardIcon, { backgroundColor: "#dbeafe" }]}>
            <Text style={styles.cardIconText}>🔑</Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>Join a Quiz</Text>
            <Text style={styles.cardSub}>Enter code or search by name</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        {/* My Results */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("QuizHistory")}
        >
          <View style={[styles.cardIcon, { backgroundColor: "#dcfce7" }]}>
            <Text style={styles.cardIconText}>📊</Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>My Results</Text>
            <Text style={styles.cardSub}>View all your past quiz results</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Profile")}
        >
          <View style={[styles.cardIcon, { backgroundColor: "#f3e8ff" }]}>
            <Text style={styles.cardIconText}>👤</Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>My Profile</Text>
            <Text style={styles.cardSub}>View stats and account settings</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        {/* Change Password */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <View style={[styles.cardIcon, { backgroundColor: "#fef9c3" }]}>
            <Text style={styles.cardIconText}>🔒</Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>Change Password</Text>
            <Text style={styles.cardSub}>Update your account password</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "#2563eb",
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  greeting: { fontSize: 13, color: "rgba(255,255,255,0.75)" },
  name: { fontSize: 22, fontWeight: "bold", color: "#fff", marginTop: 2 },
  roleBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  roleBadgeText: { color: "#fff", fontSize: 12 },
  logoutText: { color: "#fca5a5", fontWeight: "bold", fontSize: 14 },

  content: { padding: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    elevation: 2,
    gap: 14,
  },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cardIconText: { fontSize: 26 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#1e293b" },
  cardSub: { fontSize: 13, color: "#94a3b8", marginTop: 2 },
  arrow: { fontSize: 20, color: "#cbd5e1" },
});
