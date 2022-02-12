import { Request, Response } from 'express';
import { User } from '../models/User';
import nodemailer from 'nodemailer'
import dotenv from 'dotenv';

dotenv.config();

export const contato = async(req: Request, res: Response) => {

  // Passo 1: config o transporter
  let transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: `${process.env.MAIL_USER}`,
      pass: `${process.env.MAIL_PASS}`,
    }
  });  
  // Passo 2: config a msg
  // let message = {
  //   from: `Alisson ${process.env.MAIL_FROM}`,
  //   to: "teste@mail.com",
  //   subject: "Assunto legal",
  //   html: "Opa <strong>Teste</strong>, como vai?",
  //   text: "Opa teste, como vai?"
  // }
  let message = {
    from: `Alisson ${process.env.MAIL_FROM}`,
    to: req.body.to,
    replyTo: req.body.from,
    subject: req.body.subject,
    html: req.body.email,
    text: req.body.email,
  }
  // PAsso 3: Enviar a mensagem
  let info = await transport.sendMail(message)

  console.log("INFO: ", info);

  res.json({success: true});
}