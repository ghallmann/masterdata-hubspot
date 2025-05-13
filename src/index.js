import { getFirstBatch, getNextBatch } from "./vtexClient.js";
import { upsertContacts } from "./hubspotClient.js";
import { withRetry } from "./utils/utils.js";
import { logger } from "./logger.js";

console.log("✨ Starting process");

const { token, data: firstBatch } = await withRetry(getFirstBatch, [], 5);

let currentToken = token;
let currentBatch = firstBatch;

while (currentBatch.length > 0) {
  try {
    const response = await withRetry(upsertContacts, [currentBatch], 5);
    if (response.status === 200) logger.info("Batch upserted successfully");
  } catch (error) {
    logger.error("Error upserting contacts: ", error);
  }

  try {
    const nextBatch = await withRetry(getNextBatch, [currentToken], 5);
    currentToken = nextBatch.token;
    currentBatch = nextBatch.data;
    if (currentBatch.length === 0) {
      logger.info("No more contacts to process");
      break;
    }
  } catch (error) {
    logger.error("Error requesting next contacts batch: ", error);
  }
}

console.log("✅ Process finished");
