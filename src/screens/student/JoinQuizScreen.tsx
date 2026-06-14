// src/screens/student/JoinQuizScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal,
} from "react-native";
import api from "../../services/api";

export default function JoinQuizScreen({ navigation }: any) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  // Modal state for student info
  const [showModal, setShowModal] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [agNumber, setAgNumber] = useState("");
  const [pendingQuiz, setPendingQuiz] = useState<any>(null);

  // Step 1 — fetch quiz
  const fetchQuiz = async (quizCode: string) => {
    const trimmed = quizCode.trim().toUpperCase();
    if (!trimmed) {
      Alert.alert("Error", "Please enter a quiz code");
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/student/quiz/${trimmed}`);
      // Save quiz and show info modal
      setPendingQuiz(res.data);
      setShowModal(true);
    } catch (err: any) {
      Alert.alert(
        "Not Found",
        err.response?.data?.message || "Invalid quiz code",
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — confirm name and AG number then start quiz
  const handleConfirm = () => {
    if (!studentName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return;
    }
    if (!agNumber.trim()) {
      Alert.alert("Error", "Please enter your AG number");
      return;
    }
    setShowModal(false);
    // Navigate to quiz with student info
    navigation.navigate("QuizAttempt", {
      quiz: pendingQuiz,
      studentName: studentName.trim(),
      agNumber: agNumber.trim(),
    });
    // Reset fields
    setStudentName("");
    setAgNumber("");
    setPendingQuiz(null);
  };

  // Search quizzes
  const handleSearch = async () => {
    if (!searchText.trim()) {
      Alert.alert("Error", "Enter a quiz title or subject to search");
      return;
    }
    setSearching(true);
    try {
      const res = await api.get(`/student/search?q=${searchText.trim()}`);
      setSearchResults(res.data);
      if (res.data.length === 0) {
        Alert.alert("No Results", "No quizzes found for your search");
      }
    } catch {
      Alert.alert("Error", "Could not search quizzes");
    } finally {
      setSearching(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>Join Quiz</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Join by Code */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔑 Join by Code</Text>
          <Text style={styles.sectionSub}>
            Enter the 6-character code from your teacher
          </Text>
          <TextInput
            style={styles.codeInput}
            placeholder="ABC123"
            value={code}
            onChangeText={(t) => setCode(t.toUpperCase())}
            autoCapitalize="characters"
            maxLength={6}
          />
          <TouchableOpacity
            style={[styles.joinBtn, loading && { opacity: 0.6 }]}
            onPress={() => fetchQuiz(code)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.joinBtnText}>Join Quiz →</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Search */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔍 Search Quiz</Text>
          <Text style={styles.sectionSub}>Search by quiz title or subject</Text>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="e.g. Mathematics..."
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity
              style={[styles.searchBtn, searching && { opacity: 0.6 }]}
              onPress={handleSearch}
              disabled={searching}
            >
              {searching ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.searchBtnText}>Search</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Search Results */}
          {searchResults.map((quiz: any) => (
            <View key={quiz._id} style={styles.resultCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.resultTitle}>{quiz.title}</Text>
                <Text style={styles.resultSub}>
                  {quiz.subject} · {quiz.duration} min
                </Text>
                <Text style={styles.resultQ}>
                  {quiz.questions.length} Questions
                </Text>
              </View>
              <TouchableOpacity
                style={styles.joinSmallBtn}
                onPress={() => fetchQuiz(quiz.code)}
              >
                <Text style={styles.joinSmallBtnText}>Join</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Student Info Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Enter Your Details</Text>
            <Text style={styles.modalSub}>
              Please enter your info before starting the quiz
            </Text>

            {/* Quiz info */}
            {pendingQuiz && (
              <View style={styles.quizInfoBox}>
                <Text style={styles.quizInfoTitle}>{pendingQuiz.title}</Text>
                <Text style={styles.quizInfoSub}>
                  {pendingQuiz.subject} · {pendingQuiz.duration} min ·{" "}
                  {pendingQuiz.questions.length} Questions
                </Text>
              </View>
            )}

            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your full name"
              value={studentName}
              onChangeText={setStudentName}
            />

            <Text style={styles.inputLabel}>AG Number / Roll Number</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. AG-12345"
              value={agNumber}
              onChangeText={setAgNumber}
              autoCapitalize="characters"
            />

            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Text style={styles.confirmBtnText}>Start Quiz →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setShowModal(false);
                setPendingQuiz(null);
              }}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  section: { marginBottom: 8 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  sectionSub: { fontSize: 13, color: "#94a3b8", marginBottom: 16 },

  codeInput: {
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    padding: 18,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 10,
    color: "#1e293b",
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  joinBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
  },
  joinBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 24,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#e2e8f0" },
  dividerText: { color: "#94a3b8", fontWeight: "600", fontSize: 13 },

  searchRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  searchInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#1e293b",
    backgroundColor: "#fff",
  },
  searchBtn: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: "center",
  },
  searchBtnText: { color: "#fff", fontWeight: "bold", fontSize: 14 },

  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  resultTitle: { fontSize: 15, fontWeight: "bold", color: "#1e293b" },
  resultSub: { fontSize: 13, color: "#64748b", marginTop: 2 },
  resultQ: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  joinSmallBtn: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinSmallBtnText: { color: "#fff", fontWeight: "bold", fontSize: 13 },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  modalSub: { fontSize: 13, color: "#94a3b8", marginBottom: 16 },

  quizInfoBox: {
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  quizInfoTitle: { fontSize: 15, fontWeight: "bold", color: "#1e293b" },
  quizInfoSub: { fontSize: 13, color: "#64748b", marginTop: 4 },

  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 6,
    marginTop: 4,
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#1e293b",
    marginBottom: 16,
    backgroundColor: "#f8fafc",
  },

  confirmBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  confirmBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cancelBtn: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
  },
  cancelBtnText: { color: "#64748b", fontWeight: "bold", fontSize: 15 },
});
