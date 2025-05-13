import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { logger } from "./logger.js";

dotenv.config();

const USER = process.env.EMAIL_USER;
const PASS = process.env.EMAIL_PASS;
const HOST = process.env.EMAIL_HOST;
const PORT = process.env.EMAIL_PORT;
const RECIPIENT = process.env.EMAIL_RECIPIENT;

const transporter = nodemailer.createTransport({
  host: HOST,
  port: PORT,
  secure: false,
  auth: {
    user: USER,
    pass: PASS,
  },
});

export async function sendEmail() {
  try {
    transporter.sendMail({
      from: `SAC Madesa <${USER}>`,
      to: RECIPIENT,
      subject: "Relação de Contatos Criados/Atualizados na Hubspot",
      text: "Segue em anexo a relação de contatos criados/atualizados na Hubspot.",
    });
    logger.info("Email sent successfully");
  } catch (error) {
    logger.error("Error sending email: ", error);
  }
}

await sendEmail();
