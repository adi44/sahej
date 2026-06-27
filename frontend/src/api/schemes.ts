import api from "./client";
import type { Scheme } from "../utils/calculator";

export async function fetchSchemeRates(): Promise<Scheme[]> {
  const { data } = await api.get<{ schemes: Scheme[] }>("/schemes/rates");
  return data.schemes;
}
