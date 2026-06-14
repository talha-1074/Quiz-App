// src/screens/student/QuizReviewScreen.tsx
// Shows correct and wrong answers after quiz attempt

import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const LETTERS = ["A", "B", "C", "D"];

export default function QuizReviewScreen({ navigation, route }: any) {
  const { quiz, answers, result } = route.params;

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>Quiz Review</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Score summary */}
      <View style={styles.scoreBanner}>
        <Text style={styles.scoreText}>Your Score: {result.percent}%</Text>
        <View style={styles.scoreStats}>
          <Text style={styles.correct}>✓ {result.correct} Correct</Text>
          <Text style={styles.wrong}>✗ {result.wrong} Wrong</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {quiz.questions.map((q: any, index: number) => {
          const studentAnswer = answers[index];
          const correctAnswer = q.correctAnswer;
          const isCorrect = studentAnswer === correctAnswer;
          const notAnswered = studentAnswer === null || studentAnswer === -1;

          return (
            <View
              key={index}
              style={[
                styles.questionCard,
                isCorrect ? styles.cardCorrect : styles.cardWrong,
              ]}
            >
              {/* Question number and status */}
              <View style={styles.qHeader}>
                <View style={styles.qNumBadge}>
                  <Text style={styles.qNumText}>Q{index + 1}</Text>
                </View>
                <Text
                  style={[
                    styles.qStatus,
                    { color: isCorrect ? "#16a34a" : "#dc2626" },
                  ]}
                >
                  {notAnswered
                    ? "⚠ Not Answered"
                    : isCorrect
                      ? "✓ Correct"
                      : "✗ Wrong"}
                </Text>
              </View>

              {/* Question text */}
              <Text style={styles.qText}>{q.questionText}</Text>

              {/* Options */}
              {q.options.map((opt: string, i: number) => {
                const isCorrectOpt = i === correctAnswer;
                const isStudentOpt = i === studentAnswer;

                let optStyle = styles.optNormal;
                let optTextStyle = styles.optTextNormal;
                let icon = "";

                if (isCorrectOpt) {
                  optStyle = styles.optCorrect;
                  optTextStyle = styles.optTextCorrect;
                  icon = "✓";
                } else if (isStudentOpt && !isCorrect) {
                  optStyle = styles.optWrong;
                  optTextStyle = styles.optTextWrong;
                  icon = "✗";
                }

                return (
                  <View key={i} style={[styles.option, optStyle]}>
                    <Text style={[styles.optLetter, optTextStyle]}>
                      {LETTERS[i]}
                    </Text>
                    <Text style={[styles.optText, optTextStyle]}>{opt}</Text>
                    {icon ? <Text style={optTextStyle}>{icon}</Text> : null}
                  </View>
                );
              })}
            </View>
          );
        })}

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

  scoreBanner: {
    backgroundColor: "#2563eb",
    padding: 16,
    alignItems: "center",
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  scoreStats: { flexDirection: "row", gap: 20 },
  correct: { color: "#86efac", fontWeight: "600", fontSize: 14 },
  wrong: { color: "#fca5a5", fontWeight: "600", fontSize: 14 },

  content: { padding: 16, paddingBottom: 40 },

  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardCorrect: { borderLeftColor: "#16a34a" },
  cardWrong: { borderLeftColor: "#dc2626" },

  qHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  qNumBadge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  qNumText: { fontSize: 12, fontWeight: "bold", color: "#64748b" },
  qStatus: { fontSize: 13, fontWeight: "bold" },

  qText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 14,
    lineHeight: 22,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1.5,
  },
  optNormal: { backgroundColor: "#f8fafc", borderColor: "#e2e8f0" },
  optCorrect: { backgroundColor: "#dcfce7", borderColor: "#16a34a" },
  optWrong: { backgroundColor: "#fee2e2", borderColor: "#dc2626" },
  optLetter: { fontSize: 13, fontWeight: "bold", width: 20 },
  optText: { flex: 1, fontSize: 14 },
  optTextNormal: { color: "#64748b" },
  optTextCorrect: { color: "#16a34a", fontWeight: "600" },
  optTextWrong: { color: "#dc2626", fontWeight: "600" },

  homeBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginTop: 8,
  },
  homeBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
