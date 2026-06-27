import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabase";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import CalculatorPage from "./pages/CalculatorPage";
import type { Session } from "@supabase/supabase-js";

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) return null; // loading

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={session ? <Navigate to="/chat" replace /> : <LoginPage />} />
        <Route path="/chat" element={session ? <ChatPage /> : <Navigate to="/" replace />} />
        <Route path="/calculator" element={session ? <CalculatorPage /> : <Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
