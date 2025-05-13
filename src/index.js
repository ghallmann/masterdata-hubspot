import { getFirstBatch, getNextBatch } from "./vtexClient.js";
import { upsertContacts } from "./hubspotClient.js";

const { token, data: firstBatch } = await getFirstBatch();

let currentToken = token;
let currentBatch = firstBatch;

while (currentBatch.length > 0) {
  try {
    const response = await upsertContacts(currentBatch);
    if (response.status === 200) console.log("Batch upserted successfully");
  } catch (error) {
    console.error("Error upserting contacts: ", error);
  }

  try {
    const nextBatch = await getNextBatch(currentToken);
    currentToken = nextBatch.token;
    currentBatch = nextBatch.data;
    if (currentBatch.length === 0) {
      console.log("No more data to process");
      break;
    }
  } catch (error) {
    console.error("Error requesting next contacts batch: ", error);
  }
}
