import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabase";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import CalculatorPage from "./pages/CalculatorPage";
import ProfilePage from "./pages/ProfilePage";
import { fetchProfile } from "./api/profile";
import type { Session } from "@supabase/supabase-js";

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [hasProfile, setHasProfile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setHasProfile(undefined);
      return;
    }
    fetchProfile()
      .then(() => setHasProfile(true))
      .catch(() => setHasProfile(false));
  }, [session]);

  // Wait for both session AND profile check to resolve before rendering
  if (session === undefined) return null;
  if (session && hasProfile === undefined) return null;

  const profileDone = hasProfile === true;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            session
              ? <Navigate to={profileDone ? "/chat" : "/profile"} replace />
              : <LoginPage />
          }
        />
        <Route
          path="/profile"
          element={
            session
              ? <ProfilePage onComplete={() => setHasProfile(true)} />
              : <Navigate to="/" replace />
          }
        />
        <Route
          path="/chat"
          element={
            session
              ? profileDone ? <ChatPage /> : <Navigate to="/profile" replace />
              : <Navigate to="/" replace />
          }
        />
        <Route
          path="/calculator"
          element={session ? <CalculatorPage /> : <Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
