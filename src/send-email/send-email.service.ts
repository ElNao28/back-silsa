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
      subject: "Mensaje desde el formulario contacto",
      html: `<div style="padding: 10px; font-size: large;">
           <h2>Informacion de contacto:</h2>
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
      html: `<body>
    <div style="display: flex; justify-content: center;">
        <h1
            style="text-align: center; font-family:Arial, Helvetica, sans-serif; color:rgb(255, 255, 255);background-color: rgb(76, 111, 252); padding: 10px; border-radius: 2px;width: 60%;">
            Confimacion de sita
        </h1>
    </div>
    <div">
        <strong style="display: flex; justify-content: center; margin-bottom: 20px;">
            <p
                style="text-align: justify; font-size: large; font-family: Arial, Helvetica, sans-serif; color: rgb(134, 130, 130); width: 60%;">
                Has solicitado una sita, si deseas continuar con el proceso de la sita porfavor confirma esta pulsando
                el siguiente boton, una vez lo pulses tu sita quedara agendada.
            </p>
        </strong>
        <div style="display: flex; justify-content: center; margin-bottom: 20px;">
            <strong><a href="http://localhost:4200/confirmar-cita/${code}"
                    style="font-size: large; text-align: center; text-decoration: none; background-color: rgb(41, 143, 232); color: white; padding: 10px; border-radius: 3px;font-family: Arial, Helvetica, sans-serif;">Confirmar
                    sita</a></strong>
        </div>
        <i style="display: flex; justify-content: center;">
            <p
                style="font-size: large; font-family: Arial, Helvetica, sans-serif; color: rgb(134, 130, 130); width: 60%;">
                Si no has realizado algun tramite de cita y desconozces este movimiento, puedes hacer caso omiso a este
                mensaje o ponerte en contacto con nostros al contacto: <span>silsaconsultores88@gmail.com</span></p>
        </i>

        </div>
</body>`
    });
    console.log("Message sent: %s", info.messageId);
    return code;
  }
}
