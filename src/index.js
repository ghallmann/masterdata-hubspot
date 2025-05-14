import { getFirstBatch, getNextBatch } from "./vtexClient.js";
import { upsertContacts } from "./hubspotClient.js";
import { withRetry } from "./utils/utils.js";
import { logger } from "./logger.js";
import { sendEmail } from "./mailer.js";

console.log("✨ Starting process");

const { token, data: firstBatch } = await withRetry(getFirstBatch, [], 5);

let syncedContacts = [];
let currentToken = token;
let currentBatch = firstBatch;

while (currentBatch.length > 0) {
  try {
    const response = await withRetry(upsertContacts, [currentBatch], 5);
    if (response.status === 200) {
      syncedContacts.push(...currentBatch.map((c) => c.email));
      logger.info("Batch upserted successfully");
    }
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

if (syncedContacts.length > 0) await sendEmail(syncedContacts);

console.log("✅ Process finished");
