// src/screens/auth/RegisterScreen.tsx

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
  Dimensions,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const { height } = Dimensions.get("window");

type Role = "student" | "teacher";

export default function RegisterScreen({ navigation }: any) {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });
      await login(res.data.user, res.data.token);
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}></Text>
          <Text style={styles.appName}>QuizMaster</Text>
          <Text style={styles.tagline}>Create your account</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Register</Text>
          <Text style={styles.cardSub}>Join the platform today</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John Smith"
            value={name}
            onChangeText={setName}
            returnKeyType="next"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordBox}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Min. 8 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIcon}>{showPassword ? "🙈" : "👁️"}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>I am a...</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[
                styles.rolePill,
                role === "student" && styles.rolePillActive,
              ]}
              onPress={() => setRole("student")}
            >
              <Text
                style={[
                  styles.rolePillText,
                  role === "student" && styles.rolePillTextActive,
                ]}
              >
                🎓 Student
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.rolePill,
                role === "teacher" && styles.rolePillActive,
              ]}
              onPress={() => setRole("teacher")}
            >
              <Text
                style={[
                  styles.rolePillText,
                  role === "teacher" && styles.rolePillTextActive,
                ]}
              >
                👩‍🏫 Teacher
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.btn, loading && { opacity: 0.6 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.linkText}>
              Already have an account?{" "}
              <Text style={styles.linkBold}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Space for keyboard */}
        <View style={{ height: height * 0.4 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#2563eb",
  },
  scroll: {
    flex: 1,
    backgroundColor: "#2563eb",
  },
  container: {
    backgroundColor: "#2563eb",
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 28,
  },
  emoji: { fontSize: 50, marginBottom: 12 },
  appName: { fontSize: 30, fontWeight: "bold", color: "#fff" },
  tagline: { fontSize: 14, color: "rgba(255,255,255,0.75)", marginTop: 6 },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  cardSub: { fontSize: 14, color: "#94a3b8", marginBottom: 20 },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#1e293b",
    marginBottom: 14,
    backgroundColor: "#f8fafc",
  },

  passwordBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    backgroundColor: "#f8fafc",
    marginBottom: 14,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 15,
    color: "#1e293b",
  },
  eyeBtn: { paddingHorizontal: 12 },
  eyeIcon: { fontSize: 18 },

  roleRow: { flexDirection: "row", gap: 10, marginBottom: 18 },
  rolePill: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  rolePillActive: { borderColor: "#2563eb", backgroundColor: "#dbeafe" },
  rolePillText: { fontSize: 14, color: "#64748b", fontWeight: "500" },
  rolePillTextActive: { color: "#2563eb", fontWeight: "bold" },

  btn: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 4,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  linkBtn: { marginTop: 16, alignItems: "center" },
  linkText: { fontSize: 14, color: "#64748b" },
  linkBold: { color: "#2563eb", fontWeight: "bold" },
});
