// src/screens/teacher/AddQuestionScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

const LETTERS = ["A", "B", "C", "D"];

export default function AddQuestionScreen({ navigation, route }: any) {
  // Get the addQuestion function passed from CreateQuizScreen
  const { addQuestion } = route.params;

  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState<number | null>(null);

  // Update one option at a time
  const updateOption = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSave = () => {
    if (!questionText.trim()) {
      Alert.alert("Error", "Please enter the question text");
      return;
    }
    if (options.some((o) => !o.trim())) {
      Alert.alert("Error", "Please fill in all 4 options");
      return;
    }
    if (correct === null) {
      Alert.alert("Error", "Please select the correct answer");
      return;
    }

    // Send question back to CreateQuizScreen
    addQuestion({
      questionText: questionText.trim(),
      options: options.map((o) => o.trim()),
      correctAnswer: correct,
    });

    // Go back to CreateQuizScreen
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>Add Question</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Question Text */}
        <Text style={styles.label}>Question Text</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Type your question here..."
          value={questionText}
          onChangeText={setQuestionText}
          multiline
          numberOfLines={3}
        />

        {/* Options */}
        <Text style={styles.label}>
          Options — Tap the circle to mark correct answer
        </Text>

        {options.map((opt, index) => (
          <View key={index} style={styles.optRow}>
            {/* Circle to select correct answer */}
            <TouchableOpacity
              style={[styles.radio, correct === index && styles.radioActive]}
              onPress={() => setCorrect(index)}
            >
              {correct === index && <View style={styles.radioDot} />}
            </TouchableOpacity>

            {/* Letter label A B C D */}
            <View style={styles.optLetter}>
              <Text style={styles.optLetterText}>{LETTERS[index]}</Text>
            </View>

            {/* Option input */}
            <TextInput
              style={styles.optInput}
              placeholder={`Option ${LETTERS[index]}`}
              value={opt}
              onChangeText={(value) => updateOption(index, value)}
            />
          </View>
        ))}

        {/* Show which answer is correct */}
        {correct !== null && (
          <View style={styles.correctHint}>
            <Text style={styles.correctHintText}>
              ✓ Correct answer: Option {LETTERS[correct]}
            </Text>
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Question</Text>
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
    marginBottom: 8,
    marginTop: 4,
  },
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
  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
  },

  optRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: {
    borderColor: "#16a34a",
    backgroundColor: "#16a34a",
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  optLetter: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  optLetterText: { fontSize: 13, fontWeight: "bold", color: "#64748b" },
  optInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 11,
    fontSize: 14,
    color: "#1e293b",
    backgroundColor: "#fff",
  },

  correctHint: {
    backgroundColor: "#dcfce7",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  correctHintText: { color: "#16a34a", fontWeight: "600", fontSize: 14 },

  saveBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
