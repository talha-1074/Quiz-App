// src/screens/student/LeaderboardScreen.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function LeaderboardScreen({ navigation }: any) {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/student/leaderboard")
      .then((res) => setLeaderboard(res.data))
      .catch(() => Alert.alert("Error", "Could not load leaderboard"))
      .finally(() => setLoading(false));
  }, []);

  // Medal for top 3
  const getMedal = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  // Get rank color for top 3
  const getRankColor = (index: number) => {
    if (index === 0) return "#f59e0b";
    if (index === 1) return "#94a3b8";
    if (index === 2) return "#92400e";
    return "#64748b";
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
        <Text style={styles.topbarTitle}>🏆 Leaderboard</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Header Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Top Students</Text>
        <Text style={styles.bannerSub}>Ranked by average score</Text>
      </View>

      <FlatList
        data={leaderboard}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>
              No data yet.{"\n"}Be the first to attempt a quiz!
            </Text>
          </View>
        }
        renderItem={({ item, index }) => {
          // Check if this is the logged in student
          const isMe =
            item.student?._id === user?._id ||
            item.student?.email === user?.email;

          return (
            <View
              style={[
                styles.card,
                isMe && styles.cardHighlight,
                index < 3 && styles.cardTop,
              ]}
            >
              {/* Rank */}
              <View
                style={[styles.rankBox, { borderColor: getRankColor(index) }]}
              >
                <Text style={[styles.rankText, { color: getRankColor(index) }]}>
                  {getMedal(index)}
                </Text>
              </View>

              {/* Avatar */}
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: isMe ? "#2563eb" : "#64748b" },
                ]}
              >
                <Text style={styles.avatarText}>
                  {item.student?.name?.charAt(0).toUpperCase() || "S"}
                </Text>
              </View>

              {/* Student info */}
              <View style={styles.info}>
                <Text style={styles.studentName}>
                  {item.student?.name || "Student"}
                  {isMe && <Text style={styles.youTag}> (You)</Text>}
                </Text>
                <Text style={styles.studentStats}>
                  {item.totalAttempts} attempts · {item.passed} passed
                </Text>
              </View>

              {/* Score */}
              <View style={styles.scoreBox}>
                <Text style={[styles.avgScore, { color: getRankColor(index) }]}>
                  {item.avgScore}%
                </Text>
                <Text style={styles.scoreLabel}>avg</Text>
              </View>
            </View>
          );
        }}
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

  banner: {
    backgroundColor: "#2563eb",
    padding: 20,
    alignItems: "center",
  },
  bannerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  bannerSub: { fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 4 },

  empty: { alignItems: "center", paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: {
    fontSize: 15,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 22,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 12,
    elevation: 1,
  },
  cardHighlight: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff",
  },
  cardTop: {
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  rankBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: { fontSize: 14, fontWeight: "bold" },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  info: { flex: 1 },
  studentName: { fontSize: 15, fontWeight: "bold", color: "#1e293b" },
  youTag: { color: "#2563eb", fontSize: 13, fontWeight: "600" },
  studentStats: { fontSize: 12, color: "#94a3b8", marginTop: 2 },

  scoreBox: { alignItems: "center" },
  avgScore: { fontSize: 22, fontWeight: "bold" },
  scoreLabel: { fontSize: 11, color: "#94a3b8", marginTop: 1 },
});
