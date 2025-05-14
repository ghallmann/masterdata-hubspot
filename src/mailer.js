import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { logger } from "./logger.js";
import { generateSyncedContactsReport } from "./utils/utils.js";

dotenv.config();

const USER = process.env.EMAIL_USER;
const PASS = process.env.EMAIL_PASS;
const HOST = process.env.EMAIL_HOST;
const PORT = process.env.EMAIL_PORT;
const RECIPIENT = process.env.EMAIL_RECIPIENT;
const ADMIN_RECIPIENT = process.env.EMAIL_ADMIN_RECIPIENT;

const transporter = nodemailer.createTransport({
  host: HOST,
  port: PORT,
  secure: false,
  auth: {
    user: USER,
    pass: PASS,
  },
});

export async function sendEmail(syncedContacts) {
  const date = new Date().toISOString().split("T")[0];
  const filename = generateSyncedContactsReport(syncedContacts);
  try {
    transporter.sendMail({
      from: `SAC Madesa <${USER}>`,
      to: RECIPIENT,
      subject: "Relação de Contatos Criados/Atualizados na Hubspot",
      text: "Segue em anexo a relação de contatos criados/atualizados na Hubspot.",
      attachments: [
        {
          filename: `contatos_sincronizados_${date}.txt`,
          path: filename,
        },
      ],
    });
    logger.info("Email sent successfully");
  } catch (error) {
    logger.error("Error sending email: ", error);
  }
}

export async function sendErrorEmail(err) {
  try {
    transporter.sendMail({
      from: `SAC Madesa <${USER}>`,
      to: ADMIN_RECIPIENT,
      subject: "Erro na sincronização dos contatos na Hubspot",
      text: `Erro: ${err}`,
    });
    logger.info("Error email sent successfully");
  } catch (error) {
    logger.error("Error sending error log email: ", error);
  }
}
