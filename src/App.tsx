import React, { createContext } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/Login";
import { WeatherPage } from "./pages/WeatherPage";

const AuthContext = createContext<null>(null);

const App: React.FC = () => (
  <div className="h-screen">
    <AuthContext.Provider value={null}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/weather" element={
            <ProtectedRoute>
              <WeatherPage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  </div>
);

export default App;
