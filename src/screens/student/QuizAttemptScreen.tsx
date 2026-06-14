// src/screens/student/QuizAttemptScreen.tsx

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import api from "../../services/api";
import { Quiz } from "../../types";

const LETTERS = ["A", "B", "C", "D"];

export default function QuizAttemptScreen({ navigation, route }: any) {
  const { quiz }: { quiz: Quiz } = route.params;

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(quiz.questions.length).fill(null),
  );
  const [timeLeft, setTimeLeft] = useState(quiz.duration * 60);
  const totalTime = quiz.duration * 60;
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          submitQuiz(answers);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const mins = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const secs = (timeLeft % 60).toString().padStart(2, "0");

  // Timer color changes based on time left
  const getTimerColor = () => {
    const percent = (timeLeft / totalTime) * 100;
    if (percent > 50) return "#16a34a"; // green
    if (percent > 25) return "#f59e0b"; // yellow
    return "#dc2626"; // red
  };

  // Progress bar width percentage
  const timerPercent = (timeLeft / totalTime) * 100;

  const currentQuestion = quiz.questions[currentQ];
  const totalQuestions = quiz.questions.length;
  const isLastQuestion = currentQ === totalQuestions - 1;

  const selectAnswer = (optionIndex: number) => {
    const updated = [...answers];
    updated[currentQ] = optionIndex;
    setAnswers(updated);
  };

  const confirmSubmit = () => {
    const unanswered = answers.filter((a) => a === null).length;
    if (unanswered > 0) {
      Alert.alert(
        "Submit Quiz",
        `You have ${unanswered} unanswered question${unanswered > 1 ? "s" : ""}. Submit anyway?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Submit", onPress: () => submitQuiz(answers) },
        ],
      );
    } else {
      Alert.alert("Submit Quiz", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        { text: "Submit", onPress: () => submitQuiz(answers) },
      ]);
    }
  };

  const submitQuiz = async (finalAnswers: (number | null)[]) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitting(true);
    try {
      const res = await api.post("/student/submit", {
        quizId: quiz._id,
        answers: finalAnswers.map((a) => (a === null ? -1 : a)),
      });

      // Now we get result AND questions with correct answers
      const { result, questionsWithAnswers } = res.data;

      navigation.replace("Result", {
        result,
        quizTitle: quiz.title,
        quiz: { ...quiz, questions: questionsWithAnswers },
        answers: finalAnswers,
      });
    } catch (err: any) {
      Alert.alert("Error", "Could not submit quiz. Try again.");
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.submittingText}>Submitting...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.quizHeader}>
        <View style={styles.headerTop}>
          <Text style={styles.quizTitle} numberOfLines={1}>
            {quiz.title}
          </Text>
          <TouchableOpacity style={styles.submitTopBtn} onPress={confirmSubmit}>
            <Text style={styles.submitTopBtnText}>Submit</Text>
          </TouchableOpacity>
        </View>

        {/* Timer with color */}
        <View style={styles.timerRow}>
          <Text style={[styles.timer, { color: getTimerColor() }]}>
            ⏱ {mins}:{secs}
          </Text>
          <Text style={styles.progressText}>
            {currentQ + 1}/{totalQuestions}
          </Text>
        </View>

        {/* Visual timer bar */}
        <View style={styles.timerBarBg}>
          <View
            style={[
              styles.timerBarFill,
              {
                width: `${timerPercent}%` as any,
                backgroundColor: getTimerColor(),
              },
            ]}
          />
        </View>
      </View>

      {/* Question progress dots */}
      <View style={styles.dotsRow}>
        {quiz.questions.map((_, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.dot,
              i === currentQ && styles.dotActive,
              answers[i] !== null && styles.dotAnswered,
            ]}
            onPress={() => setCurrentQ(i)}
          />
        ))}
      </View>

      {/* Question */}
      <ScrollView
        contentContainerStyle={styles.questionArea}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.qNum}>
          Question {currentQ + 1} of {totalQuestions}
        </Text>
        <Text style={styles.qText}>{currentQuestion.questionText}</Text>

        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              answers[currentQ] === index && styles.optionSelected,
            ]}
            onPress={() => selectAnswer(index)}
          >
            <View
              style={[
                styles.optLetter,
                answers[currentQ] === index && styles.optLetterSelected,
              ]}
            >
              <Text
                style={[
                  styles.optLetterText,
                  answers[currentQ] === index && { color: "#fff" },
                ]}
              >
                {LETTERS[index]}
              </Text>
            </View>
            <Text
              style={[
                styles.optText,
                answers[currentQ] === index && styles.optTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={[
            styles.navBtn,
            styles.prevBtn,
            currentQ === 0 && styles.btnDisabled,
          ]}
          onPress={() => setCurrentQ((c) => c - 1)}
          disabled={currentQ === 0}
        >
          <Text style={styles.prevBtnText}>← Prev</Text>
        </TouchableOpacity>

        {isLastQuestion ? (
          <TouchableOpacity
            style={[styles.navBtn, styles.submitBtn]}
            onPress={confirmSubmit}
          >
            <Text style={styles.navBtnText}>Submit ✓</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navBtn, styles.nextBtn]}
            onPress={() => setCurrentQ((c) => c + 1)}
          >
            <Text style={styles.navBtnText}>Next →</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  submittingText: { marginTop: 16, color: "#64748b", fontSize: 15 },

  quizHeader: {
    backgroundColor: "#fff",
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  quizTitle: { fontSize: 14, color: "#64748b", fontWeight: "500", flex: 1 },
  submitTopBtn: {
    backgroundColor: "#fee2e2",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  submitTopBtnText: { color: "#dc2626", fontSize: 13, fontWeight: "600" },

  timerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  timer: { fontSize: 28, fontWeight: "bold" },
  progressText: { fontSize: 13, color: "#94a3b8", fontWeight: "600" },

  // Visual timer bar
  timerBarBg: { height: 8, backgroundColor: "#e2e8f0", borderRadius: 4 },
  timerBarFill: { height: 8, borderRadius: 4 },

  // Question dots navigation
  dotsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    gap: 6,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  dot: { width: 20, height: 20, borderRadius: 10, backgroundColor: "#e2e8f0" },
  dotActive: { backgroundColor: "#2563eb" },
  dotAnswered: { backgroundColor: "#86efac" },

  questionArea: { padding: 20, paddingBottom: 16 },
  qNum: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  qText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    lineHeight: 26,
    marginBottom: 24,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  optionSelected: { borderColor: "#2563eb", backgroundColor: "#eff6ff" },
  optLetter: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  optLetterSelected: { backgroundColor: "#2563eb" },
  optLetterText: { fontSize: 14, fontWeight: "bold", color: "#64748b" },
  optText: { flex: 1, fontSize: 15, color: "#1e293b" },
  optTextSelected: { color: "#2563eb", fontWeight: "600" },

  navRow: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  navBtn: { flex: 1, padding: 14, borderRadius: 12, alignItems: "center" },
  prevBtn: { backgroundColor: "#f1f5f9" },
  nextBtn: { backgroundColor: "#2563eb" },
  submitBtn: { backgroundColor: "#16a34a" },
  btnDisabled: { opacity: 0.4 },
  navBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  prevBtnText: { color: "#64748b", fontWeight: "bold", fontSize: 15 },
});
