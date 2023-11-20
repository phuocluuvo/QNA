import { Controller } from "@nestjs/common";
import { EmailService } from "./email.service";

@Controller("email")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  // @Post("send")
  // async sendEmail(@Body("email") email: string) {
  //   await this.emailService.sendEmail(email);
  //   return { message: "Email sent" };
  // }
}
