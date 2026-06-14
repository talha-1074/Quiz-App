// src/screens/student/ResultScreen.tsx

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function ResultScreen({ navigation, route }: any) {
  const { result, quizTitle, quiz, answers } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Result Circle */}
        <View
          style={[
            styles.circle,
            result.passed ? styles.circlePass : styles.circleFail,
          ]}
        >
          <Text style={styles.circleEmoji}>{result.passed ? "🎉" : "😔"}</Text>
        </View>

        {/* Score */}
        <Text
          style={[
            styles.percent,
            { color: result.passed ? "#16a34a" : "#dc2626" },
          ]}
        >
          {result.percent}%
        </Text>

        {/* Pass / Fail */}
        <View
          style={[
            styles.verdictBadge,
            { backgroundColor: result.passed ? "#dcfce7" : "#fee2e2" },
          ]}
        >
          <Text
            style={[
              styles.verdictText,
              { color: result.passed ? "#16a34a" : "#dc2626" },
            ]}
          >
            {result.passed ? "PASSED" : "FAILED"}
          </Text>
        </View>

        <Text style={styles.message}>
          {result.passed
            ? "Congratulations, you passed!"
            : "Better luck next time!"}
        </Text>

        <Text style={styles.quizName}>{quizTitle}</Text>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: "#16a34a" }]}>
              {result.correct}
            </Text>
            <Text style={styles.statLabel}>Correct</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: "#dc2626" }]}>
              {result.wrong}
            </Text>
            <Text style={styles.statLabel}>Wrong</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: "#2563eb" }]}>
              {result.total}
            </Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        <Text style={styles.passNote}>Pass mark: 50%</Text>

        {/* Review Button — NEW */}
        {quiz && (
          <TouchableOpacity
            style={styles.reviewBtn}
            onPress={() =>
              navigation.navigate("QuizReview", {
                quiz,
                answers,
                result,
              })
            }
          >
            <Text style={styles.reviewBtnText}>📋 Review Answers</Text>
          </TouchableOpacity>
        )}

        {/* History Button */}
        <TouchableOpacity
          style={styles.historyBtn}
          onPress={() => navigation.navigate("QuizHistory")}
        >
          <Text style={styles.historyBtnText}>View My History</Text>
        </TouchableOpacity>

        {/* Home Button */}
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate("StudentDashboard")}
        >
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 4,
  },
  circlePass: { backgroundColor: "#dcfce7", borderColor: "#16a34a" },
  circleFail: { backgroundColor: "#fee2e2", borderColor: "#dc2626" },
  circleEmoji: { fontSize: 48 },

  percent: { fontSize: 56, fontWeight: "bold" },

  verdictBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  verdictText: { fontWeight: "bold", fontSize: 16 },

  message: {
    fontSize: 16,
    color: "#475569",
    marginTop: 12,
    textAlign: "center",
  },
  quizName: { fontSize: 14, color: "#94a3b8", marginTop: 6, marginBottom: 32 },

  statsRow: { flexDirection: "row", gap: 12, width: "100%", marginBottom: 12 },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  statNum: { fontSize: 30, fontWeight: "bold" },
  statLabel: { fontSize: 12, color: "#94a3b8", marginTop: 4 },

  passNote: { fontSize: 13, color: "#94a3b8", marginBottom: 24 },

  reviewBtn: {
    width: "100%",
    backgroundColor: "#fef3c7",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#fcd34d",
  },
  reviewBtnText: { color: "#92400e", fontWeight: "bold", fontSize: 15 },

  historyBtn: {
    width: "100%",
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 12,
  },
  historyBtnText: { color: "#2563eb", fontWeight: "bold", fontSize: 15 },

  homeBtn: {
    width: "100%",
    backgroundColor: "#2563eb",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
  },
  homeBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
