// src/screens/teacher/TeacherDashboard.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { Quiz } from "../../types";

export default function TeacherDashboard({ navigation }: any) {
  const { user, logout } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Refresh when screen comes back into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchQuizzes();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchQuizzes = async () => {
    try {
      const res = await api.get("/teacher/quizzes");
      setQuizzes(res.data);
    } catch (error) {
      Alert.alert("Error", "Could not load quizzes");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const deleteQuiz = (id: string) => {
    Alert.alert("Delete Quiz", "This will permanently delete the quiz.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/teacher/quiz/${id}`);
            setQuizzes((prev) => prev.filter((q) => q._id !== id));
          } catch {
            Alert.alert("Error", "Could not delete quiz");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{user?.name}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>Teacher</Text>
          </View>
        </View>
        <View style={styles.headerBtns}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ChangePassword")}
            style={styles.changePwdBtn}
          >
            <Text style={styles.changePwdText}>🔒</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={quizzes}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchQuizzes();
            }}
          />
        }
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>My Quizzes</Text>
            <TouchableOpacity
              style={styles.createBtn}
              onPress={() => navigation.navigate("CreateQuiz")}
            >
              <Text style={styles.createBtnText}>+ Create Quiz</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>
              No quizzes yet.{"\n"}Create your first quiz!
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Quiz title and duration */}
            <View style={styles.cardTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSub}>{item.subject}</Text>
              </View>
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{item.duration} min</Text>
              </View>
            </View>

            {/* Questions count */}
            <Text style={styles.qCount}>{item.questions.length} Questions</Text>

            {/* Join Code */}
            <View style={styles.codeBox}>
              <Text style={styles.codeLabel}>JOIN CODE</Text>
              <Text style={styles.codeText}>{item.code}</Text>
            </View>

            {/* Expiry info */}
            {item.expiresAt && (
              <View
                style={[
                  styles.expiryBox,
                  new Date() > new Date(item.expiresAt)
                    ? styles.expiryBoxExpired
                    : styles.expiryBoxActive,
                ]}
              >
                <Text
                  style={[
                    styles.expiryText,
                    new Date() > new Date(item.expiresAt)
                      ? styles.expiryTextExpired
                      : styles.expiryTextActive,
                  ]}
                >
                  {new Date() > new Date(item.expiresAt)
                    ? "❌ Expired"
                    : `⏰ Expires: ${new Date(item.expiresAt).toLocaleString()}`}
                </Text>
              </View>
            )}

            {/* Action buttons */}
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.resultsBtn}
                onPress={() =>
                  navigation.navigate("QuizResults", {
                    quizId: item._id,
                    quizTitle: item.title,
                  })
                }
              >
                <Text style={styles.resultsBtnText}>📊 Results</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => deleteQuiz(item._id)}
              >
                <Text style={styles.deleteBtnText}>🗑 Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "#2563eb",
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 24,
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
  logoutText: {
    color: "#fca5a5",
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 4,
  },

  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#1e293b" },
  createBtn: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  createBtnText: { color: "#fff", fontWeight: "bold", fontSize: 14 },

  empty: { alignItems: "center", paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: {
    fontSize: 15,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 22,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    elevation: 2,
  },
  cardTop: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#1e293b" },
  cardSub: { fontSize: 13, color: "#64748b", marginTop: 2 },
  durationBadge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  durationText: { fontSize: 12, color: "#2563eb", fontWeight: "600" },
  qCount: { fontSize: 13, color: "#64748b", marginBottom: 12 },

  codeBox: {
    backgroundColor: "#eff6ff",
    borderWidth: 2,
    borderColor: "#bfdbfe",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  codeLabel: {
    fontSize: 10,
    color: "#60a5fa",
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 4,
  },
  codeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563eb",
    letterSpacing: 6,
  },

  cardActions: { flexDirection: "row", gap: 10 },
  resultsBtn: {
    flex: 1,
    backgroundColor: "#eff6ff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  resultsBtnText: { color: "#2563eb", fontWeight: "bold", fontSize: 13 },
  deleteBtn: {
    flex: 1,
    backgroundColor: "#fff1f2",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteBtnText: { color: "#dc2626", fontWeight: "bold", fontSize: 13 },
  headerBtns: { alignItems: "flex-end", gap: 8 },
  changePwdBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 20,
  },
  changePwdText: { fontSize: 16 },
  expiryBox: { padding: 8, borderRadius: 8, marginBottom: 12 },
  expiryBoxActive: { backgroundColor: "#dcfce7" },
  expiryBoxExpired: { backgroundColor: "#fee2e2" },
  expiryText: { fontSize: 12, fontWeight: "600", textAlign: "center" },
  expiryTextActive: { color: "#16a34a" },
  expiryTextExpired: { color: "#dc2626" },
});
