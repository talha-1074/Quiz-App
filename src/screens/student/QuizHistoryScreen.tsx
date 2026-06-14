// src/screens/student/QuizHistoryScreen.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import api from "../../services/api";
import { Result } from "../../types";

export default function QuizHistoryScreen({ navigation }: any) {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/student/history");
      setResults(res.data);
    } catch (error) {
      Alert.alert("Error", "Could not load history");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
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
      {/* Top Bar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>My Results</Text>
        <View style={{ width: 60 }} />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchHistory();
            }}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyText}>
              No quizzes attempted yet.{"\n"}Join a quiz to get started!
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              { borderLeftColor: item.passed ? "#16a34a" : "#dc2626" },
            ]}
          >
            <View style={styles.cardTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.quizTitle}>{item.quiz.title}</Text>
                <Text style={styles.quizSub}>{item.quiz.subject}</Text>
              </View>
              <View style={styles.scoreBox}>
                <Text
                  style={[
                    styles.percent,
                    { color: item.passed ? "#16a34a" : "#dc2626" },
                  ]}
                >
                  {item.percent}%
                </Text>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: item.passed ? "#dcfce7" : "#fee2e2" },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: item.passed ? "#16a34a" : "#dc2626" },
                    ]}
                  >
                    {item.passed ? "PASSED" : "FAILED"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Stats */}
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

  empty: { alignItems: "center", paddingTop: 80 },
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
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    elevation: 1,
  },
  cardTop: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
  quizTitle: { fontSize: 15, fontWeight: "bold", color: "#1e293b" },
  quizSub: { fontSize: 13, color: "#64748b", marginTop: 2 },
  scoreBox: { alignItems: "flex-end", gap: 4 },
  percent: { fontSize: 26, fontWeight: "bold" },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: "bold" },

  cardStats: {
    flexDirection: "row",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 8,
  },
  statGreen: { fontSize: 13, color: "#16a34a", fontWeight: "500" },
  statRed: { fontSize: 13, color: "#dc2626", fontWeight: "500" },
  statGray: { fontSize: 13, color: "#94a3b8" },
});
