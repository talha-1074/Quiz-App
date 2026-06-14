// App.tsx
// This is the root file of the app
// It wraps everything inside AuthProvider

import React from "react";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    // AuthProvider makes user/token available to all screens
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
