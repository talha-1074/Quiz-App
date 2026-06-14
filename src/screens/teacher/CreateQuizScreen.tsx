// src/screens/teacher/CreateQuizScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import api from "../../services/api";
import { Question } from "../../types";

export default function CreateQuizScreen({ navigation }: any) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState("");
  const [expiryHours, setExpiryHours] = useState("24");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  const addQuestion = (newQuestion: Question) => {
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const handleCreate = async () => {
    if (!title.trim() || !subject.trim() || !duration) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (questions.length === 0) {
      Alert.alert("Error", "Please add at least one question");
      return;
    }
    if (!expiryHours || Number(expiryHours) < 1) {
      Alert.alert("Error", "Please set a valid expiry time");
      return;
    }

    setLoading(true);
    try {
      await api.post("/teacher/quiz", {
        title: title.trim(),
        subject: subject.trim(),
        duration: Number(duration),
        expiryHours: Number(expiryHours),
        questions,
      });
      Alert.alert("Success 🎉", "Quiz created successfully!", [
        { text: "OK", onPress: () => navigation.navigate("TeacherDashboard") },
      ]);
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Could not create quiz",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>Create Quiz</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Quiz Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Midterm Exam 2024"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Subject</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Mathematics"
          value={subject}
          onChangeText={setSubject}
        />

        <Text style={styles.label}>Duration (minutes)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 30"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />

        {/* Expiry time — NEW */}
        <Text style={styles.label}>Quiz Available For (hours)</Text>
        <Text style={styles.labelSub}>
          After this time, students cannot join the quiz
        </Text>

        {/* Quick select buttons */}
        <View style={styles.expiryRow}>
          {["1", "6", "12", "24", "48"].map((h) => (
            <TouchableOpacity
              key={h}
              style={[
                styles.expiryBtn,
                expiryHours === h && styles.expiryBtnActive,
              ]}
              onPress={() => setExpiryHours(h)}
            >
              <Text
                style={[
                  styles.expiryBtnText,
                  expiryHours === h && styles.expiryBtnTextActive,
                ]}
              >
                {h}h
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Custom hours e.g. 3"
          value={expiryHours}
          onChangeText={setExpiryHours}
          keyboardType="numeric"
        />

        {expiryHours ? (
          <View style={styles.expiryInfo}>
            <Text style={styles.expiryInfoText}>
              ⏰ Quiz will expire in {expiryHours} hour
              {Number(expiryHours) > 1 ? "s" : ""} after creation
            </Text>
          </View>
        ) : null}

        {/* Questions Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Questions</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{questions.length} added</Text>
          </View>
        </View>

        {questions.map((q, index) => (
          <View key={index} style={styles.qItem}>
            <View style={styles.qNum}>
              <Text style={styles.qNumText}>{index + 1}</Text>
            </View>
            <Text style={styles.qText} numberOfLines={2}>
              {q.questionText}
            </Text>
          </View>
        ))}

        <TouchableOpacity
          style={styles.addQBtn}
          onPress={() => navigation.navigate("AddQuestion", { addQuestion })}
        >
          <Text style={styles.addQBtnText}>+ Add Question</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.createBtn, loading && { opacity: 0.6 }]}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.createBtnText}>Create Quiz</Text>
          )}
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

  content: { padding: 16, paddingBottom: 40 },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 6,
    marginTop: 4,
  },
  labelSub: { fontSize: 12, color: "#94a3b8", marginBottom: 8, marginTop: -4 },
  input: {
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#1e293b",
    marginBottom: 16,
    backgroundColor: "#fff",
  },

  expiryRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  expiryBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  expiryBtnActive: { borderColor: "#2563eb", backgroundColor: "#dbeafe" },
  expiryBtnText: { fontSize: 13, color: "#64748b", fontWeight: "600" },
  expiryBtnTextActive: { color: "#2563eb" },

  expiryInfo: {
    backgroundColor: "#fef3c7",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#fcd34d",
  },
  expiryInfoText: { color: "#92400e", fontSize: 13, fontWeight: "500" },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: { fontSize: 15, fontWeight: "bold", color: "#1e293b" },
  countBadge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  countBadgeText: { fontSize: 12, color: "#2563eb", fontWeight: "600" },

  qItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#eff6ff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  qNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  qNumText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  qText: { flex: 1, fontSize: 14, color: "#1e293b", lineHeight: 20 },

  addQBtn: {
    borderWidth: 2,
    borderColor: "#2563eb",
    borderStyle: "dashed",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginBottom: 14,
  },
  addQBtnText: { color: "#2563eb", fontWeight: "bold", fontSize: 15 },

  createBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  createBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
