import React, { createContext, ReactNode } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { LoginPage } from "./pages/Login";
import { WeatherPage } from "./pages/WeatherPage";

const AuthContext = createContext<null>(null);

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  return localStorage.getItem("token") ? children : <Navigate to="/login" replace />;
};

const App: React.FC = () => {

  return (
    <div className="h-screen">
      <AuthContext.Provider value={null}>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/weather" element={<ProtectedRoute><WeatherPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
};

export default App;
