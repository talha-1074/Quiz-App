// src/screens/teacher/QuizResultsScreen.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import api from "../../services/api";
import { Result } from "../../types";

export default function QuizResultsScreen({ navigation, route }: any) {
  // Get quizId and quizTitle passed from TeacherDashboard
  const { quizId, quizTitle } = route.params;

  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await api.get(`/teacher/results/${quizId}`);
      setResults(res.data);
    } catch (error) {
      Alert.alert("Error", "Could not load results");
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary numbers
  const totalAttempts = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const avgScore =
    totalAttempts > 0
      ? Math.round(
          results.reduce((sum, r) => sum + r.percent, 0) / totalAttempts,
        )
      : 0;

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
        <Text style={styles.topbarTitle}>Results</Text>
        <View style={{ width: 60 }} />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <View>
            {/* Quiz name */}
            <View style={styles.quizInfo}>
              <Text style={styles.quizTitle}>{quizTitle}</Text>
              <Text style={styles.quizSub}>
                {totalAttempts} submission{totalAttempts !== 1 ? "s" : ""}
              </Text>
            </View>

            {/* Summary cards */}
            {totalAttempts > 0 && (
              <View style={styles.summaryRow}>
                <View style={[styles.sumCard, { borderTopColor: "#16a34a" }]}>
                  <Text style={[styles.sumNum, { color: "#16a34a" }]}>
                    {passed}
                  </Text>
                  <Text style={styles.sumLabel}>Passed</Text>
                </View>
                <View style={[styles.sumCard, { borderTopColor: "#dc2626" }]}>
                  <Text style={[styles.sumNum, { color: "#dc2626" }]}>
                    {failed}
                  </Text>
                  <Text style={styles.sumLabel}>Failed</Text>
                </View>
                <View style={[styles.sumCard, { borderTopColor: "#2563eb" }]}>
                  <Text style={[styles.sumNum, { color: "#2563eb" }]}>
                    {avgScore}%
                  </Text>
                  <Text style={styles.sumLabel}>Avg Score</Text>
                </View>
              </View>
            )}

            <Text style={styles.sectionTitle}>Student Results</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No submissions yet</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              {/* Student avatar */}
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.student.name.charAt(0).toUpperCase()}
                </Text>
              </View>

              {/* Student info */}
              <View style={{ flex: 1 }}>
                <Text style={styles.studentName}>{item.student.name}</Text>
                <Text style={styles.studentEmail}>{item.student.email}</Text>
              </View>

              {/* Score */}
              <View style={styles.scoreBox}>
                <Text
                  style={[
                    styles.scoreNum,
                    { color: item.passed ? "#16a34a" : "#dc2626" },
                  ]}
                >
                  {item.percent}%
                </Text>
                <View
                  style={[
                    styles.verdict,
                    { backgroundColor: item.passed ? "#dcfce7" : "#fee2e2" },
                  ]}
                >
                  <Text
                    style={[
                      styles.verdictText,
                      { color: item.passed ? "#16a34a" : "#dc2626" },
                    ]}
                  >
                    {item.passed ? "PASSED" : "FAILED"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Stats row */}
            <View style={styles.cardStats}>
              <Text style={styles.statGreen}>✓ {item.correct} correct</Text>
              <Text style={styles.statRed}>✗ {item.wrong} wrong</Text>
              <Text style={styles.statGray}>{item.total} total</Text>
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

  quizInfo: { marginBottom: 14 },
  quizTitle: { fontSize: 18, fontWeight: "bold", color: "#1e293b" },
  quizSub: { fontSize: 13, color: "#94a3b8", marginTop: 2 },

  summaryRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  sumCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderTopWidth: 4,
    elevation: 1,
    alignItems: "center",
  },
  sumNum: { fontSize: 22, fontWeight: "bold" },
  sumLabel: { fontSize: 11, color: "#94a3b8", marginTop: 2 },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },

  empty: { alignItems: "center", paddingTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 15, color: "#94a3b8" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  studentName: { fontSize: 14, fontWeight: "600", color: "#1e293b" },
  studentEmail: { fontSize: 12, color: "#94a3b8", marginTop: 2 },

  scoreBox: { alignItems: "flex-end" },
  scoreNum: { fontSize: 22, fontWeight: "bold" },
  verdict: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    marginTop: 4,
  },
  verdictText: { fontSize: 11, fontWeight: "bold" },

  cardStats: {
    flexDirection: "row",
    gap: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  statGreen: { fontSize: 13, color: "#16a34a", fontWeight: "500" },
  statRed: { fontSize: 13, color: "#dc2626", fontWeight: "500" },
  statGray: { fontSize: 13, color: "#94a3b8" },
});
