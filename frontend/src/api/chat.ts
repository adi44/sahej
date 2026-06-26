import api from "./client";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  agent_metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages?: ChatMessage[];
}

export async function sendMessage(message: string, sessionId?: string) {
  const { data } = await api.post<{ session_id: string; message: string }>("/chat/", {
    message,
    session_id: sessionId ?? null,
  });
  return data;
}

export async function getSessions(): Promise<ChatSession[]> {
  const { data } = await api.get<ChatSession[]>("/chat/sessions");
  return data;
}

export async function getSession(sessionId: string): Promise<ChatSession> {
  const { data } = await api.get<ChatSession>(`/chat/sessions/${sessionId}`);
  return data;
}
