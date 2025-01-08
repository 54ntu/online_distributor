import nodemailer from "nodemailer";
import { envConfig } from "../config/config.js";

const sendMail = async (data) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: envConfig.email,
      pass: envConfig.password,
    },
  });

  const mailOptions = {
    from: envConfig.email,
    to: data.to,
    subject: data.subject,
    text: data.text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

export default sendMail;
