import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = process.env.VTEX_BASE_URL;
const HEADERS = {
  "X-VTEX-API-AppKey": process.env.VTEX_APP_KEY,
  "X-VTEX-API-AppToken": process.env.VTEX_APP_TOKEN,
};

export async function getFirstBatch() {
  const url = `${BASE_URL}/scroll?_size=100&_fields=email,lista,lastInteractionIn&_where=lastInteractionIn>2020-01-01`;
  const response = await axios.get(url, { headers: HEADERS });

  return {
    token: response.headers["x-vtex-md-token"],
    data: response.data,
  };
}

export async function getNextBatch(token) {
  const url = `${BASE_URL}/scroll?_token=${token}`;
  const response = await axios.get(url, { headers: HEADERS });
  return {
    token: response.headers["x-vtex-md-token"],
    data: response.data,
  };
}
