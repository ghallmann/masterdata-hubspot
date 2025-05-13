import fs from "fs";
import path from "path";

const logsDir = "./logs";
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}
const date = new Date().toISOString().split("T")[0];
const logFilePath = path.join(logsDir, `${date}.log`);

function logToFile(type, message) {
  const line = `[${new Date().toISOString()}] [${type}] ${message}\n`;
  fs.appendFileSync(logFilePath, line);
}

export const logger = {
  info: (msg) => logToFile("INFO", msg),
  warn: (msg) => logToFile("WARN", msg),
  error: (msg) => logToFile("ERROR", msg),
};
