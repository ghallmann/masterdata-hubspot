import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { getDate } from "./utils/utils.js";
import { logger } from "./logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const BASE_URL = process.env.VTEX_BASE_URL;
const HEADERS = {
  "X-VTEX-API-AppKey": process.env.VTEX_APP_KEY,
  "X-VTEX-API-AppToken": process.env.VTEX_APP_TOKEN,
};

export async function getFirstBatch() {
  const date = getDate();
  const url = `${BASE_URL}/scroll?_size=100&_fields=email,lista,lastInteractionIn&_where=lastInteractionIn>${date}`;
  const response = await axios.get(url, { headers: HEADERS });

  if (response.status === 200)
    logger.info(
      `First batch retrieved successfully: ${JSON.stringify(response.data)}`
    );

  return {
    token: response.headers["x-vtex-md-token"],
    data: response.data,
  };
}

export async function getNextBatch(token) {
  const url = `${BASE_URL}/scroll?_token=${token}`;
  const response = await axios.get(url, { headers: HEADERS });
  if (response.status === 200)
    logger.info(
      `Next batch retrieved successfully: ${JSON.stringify(response.data)}`
    );
  return {
    token: response.headers["x-vtex-md-token"],
    data: response.data,
  };
}
