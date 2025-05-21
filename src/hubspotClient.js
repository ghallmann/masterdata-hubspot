import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const BASE_URL = process.env.HUBSPOT_API_URL;
const HEADERS = {
  Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
  "Content-Type": "application/json",
};

export async function upsertContacts(batch) {
  const payload = {
    inputs: batch.map((contact) => ({
      id: contact.email,
      idProperty: "email",
      properties: {
        lista_de_desejos: contact.lista.join(", "),
      },
    })),
  };
  const response = await axios.post(BASE_URL, payload, { headers: HEADERS });
  return response;
}
