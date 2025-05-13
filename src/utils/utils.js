import { logger } from "../logger.js";

const BACKOFF = 180000; // 3 minutes in ms

export function getDate() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const yesterday = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  return yesterday.toISOString().split("T")[0];
}

export async function withRetry(fn, args = [], retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn(...args);
    } catch (error) {
      const rateLimitError =
        error.response?.status === 429 ||
        (error.response?.status === 400 &&
          error.response?.data?.message?.includes("rate"));
      if (!rateLimitError) {
        logger.error(error.message);
        throw error;
      }
      logger.warn(`Rate limit error.`);
      await new Promise((resolve) => setTimeout(resolve, BACKOFF));
    }
  }
  throw new Error("Failed after 5 retries");
}
