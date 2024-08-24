import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSendEmailDto } from './dto/create-send-email.dto';
const nodemailer = require("nodemailer");
//esta variable seria como tu token
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "silsaconsultores88@gmail.com",
    pass: "afwf zqbd shlc raan",
  },
});

@Injectable()
export class SendEmailService {
  //esta es la funcion que se encarga de enviar el email a la empresa, cuando el usario manda su informacion mediante el formulario de contacto
  async sendEmailByContact(data: CreateSendEmailDto) {
    const info = await transporter.sendMail({
      from: '"Contacto Silsa Consultores" <silsaconsultores88@gmail.com>',
      to: "luis28jair5@gmail.com",
      subject: "Se a recibido un email del formulario contacto",
      html: `<div style="padding: 10px; font-size: large;">
      <h2>El contenido es el siguiente:</h2>
      <p><strong>Nombre:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Telefono:</strong> ${data.cellphone}</p>
      <p><strong>Asunto: <br></strong> <i>${data.message}</i></p>
  </div>`
    });
    console.log("Message sent: %s", info.messageId);
    return {
      message: 'Email enviado correctamente',
      status: HttpStatus.OK
    }
  }
  //Envia al correo el link para confirmar la sita
  async sendCodeConfirmation(to: string) {
    let code: string = "";
    for (var i = 0; i < 8; i++) {
      code += Math.floor(Math.random() * 10);
    }
    const info = await transporter.sendMail({
      from: '"Contacto Silsa Consultores" <silsaconsultores88@gmail.com>',
      to: to,
      subject: "Confirmacion de cita",
      html: `<section style="display: flex; justify-content: center;">
        <div
            style="font-size: 20px; width: 80%; border-radius: 5px;background-color: rgb(245, 245, 245); padding-bottom: 10px; padding: 20px;">
            <h1
                style="background-color: rgb(187, 187, 187);border-radius: 5px; text-align: center; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
                Confirmacion de Cita
            </h1>
            <div style="font-size: 20px;">
                <p>Para confirmar la solicitud de su cita, porfavor abra el siguiente enlace:</p>
                <a href="http://localhost:4200/confirmar-cita/${code}"
                    style="text-decoration: none; color: rgb(2, 2, 207);">Click aqui para confirmar su
                    cita</a>
                <p>Si no haz realizado algun tramite de cita y desconozcas este movimiento, puedes hacer caso omiso a
                    este mensaje o ponerte en contacto con nostros al contacto:</p> <span
                    style="color: rgb(2, 2, 207);">silsaconsultores88@gmail.com</span>
            </div>
        </div>
    </section>`
    });
    console.log("Message sent: %s", info.messageId);
    return code;
  }
}
