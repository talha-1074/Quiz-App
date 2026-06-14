// src/navigation/AppNavigator.tsx

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";

// Auth Screens
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ChangePasswordScreen from "../screens/auth/ChangePasswordScreen";

// Admin Screens
import AdminDashboard from "../screens/admin/AdminDashboard";

// Teacher Screens
import TeacherDashboard from "../screens/teacher/TeacherDashboard";
import CreateQuizScreen from "../screens/teacher/CreateQuizScreen";
import AddQuestionScreen from "../screens/teacher/AddQuestionScreen";
import QuizResultsScreen from "../screens/teacher/QuizResultsScreen";

// Student Screens
import StudentDashboard from "../screens/student/StudentDashboard";
import JoinQuizScreen from "../screens/student/JoinQuizScreen";
import QuizAttemptScreen from "../screens/student/QuizAttemptScreen";
import ResultScreen from "../screens/student/ResultScreen";
import QuizHistoryScreen from "../screens/student/QuizHistoryScreen";
import QuizReviewScreen from "../screens/student/QuizReviewScreen";
import ProfileScreen from "../screens/student/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#2563eb",
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Not logged in */}
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : /* Admin */
        user.role === "admin" ? (
          <>
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePasswordScreen}
            />
          </>
        ) : /* Teacher */
        user.role === "teacher" ? (
          <>
            <Stack.Screen
              name="TeacherDashboard"
              component={TeacherDashboard}
            />
            <Stack.Screen name="CreateQuiz" component={CreateQuizScreen} />
            <Stack.Screen name="AddQuestion" component={AddQuestionScreen} />
            <Stack.Screen name="QuizResults" component={QuizResultsScreen} />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePasswordScreen}
            />
          </>
        ) : (
          /* Student */
          <>
            <Stack.Screen
              name="StudentDashboard"
              component={StudentDashboard}
            />
            <Stack.Screen name="JoinQuiz" component={JoinQuizScreen} />
            <Stack.Screen name="QuizAttempt" component={QuizAttemptScreen} />
            <Stack.Screen name="Result" component={ResultScreen} />
            <Stack.Screen name="QuizHistory" component={QuizHistoryScreen} />
            <Stack.Screen name="QuizReview" component={QuizReviewScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePasswordScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
