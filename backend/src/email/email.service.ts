import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailResetPassword(receiverEmail: string, link: string) {
    console.log("Sending email...");
    console.log(link);
    const mailOptions = {
      to: receiverEmail,
      subject: "Đặt lại mật khẩu",
      text: "Content of your email",
      html: `
      <h5> Chào bạn </h5>
      <p> Bạn vừa yêu cầu đặt lại mật khẩu tại website QNA </p>
      <p> Vui lòng nhấn vào <a href="${link}">đây</a> để đặt lại mật khẩu </p>
      <p> Liên kết sẽ hết hạn sau 5 phút </p>
      <p> Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này </p>
      <p>Trân trọng.</p>
      <p>QNA</p>
    `,
    };

    try {
      await this.mailerService.sendMail(mailOptions);
      console.log("Email sent successfully!");
      return {
        data: {
          status: "success",
          message: "Email sent successfully!",
          email: receiverEmail,
        },
      };
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  async sendEmailAddEmail(receiverEmail: string, link: string) {
    console.log("Sending email...");
    console.log(link);
    const mailOptions = {
      to: receiverEmail,
      subject: "Liên kết địa chỉ email",
      text: "Content of your email",
      html: `
      <h5> Chào bạn </h5>
      <p> Bạn vừa yêu liên kết địa chỉ email tại website QNA </p>
      <p> Vui lòng nhấn vào <a href="${link}">đây</a> để xác nhận </p>
      <p> Liên kết sẽ hết hạn sau 5 phút </p>
      <p> Nếu bạn không yêu cầu, vui lòng bỏ qua email này </p>
      <p>Trân trọng.</p>
      <p>QNA</p>
    `,
    };

    try {
      await this.mailerService.sendMail(mailOptions);
      console.log("Email sent successfully!");
      return {
        data: {
          status: "success",
          message: "Email sent successfully!",
          email: receiverEmail,
        },
      };
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  async sendEmailVerify(receiverEmail: string, opt: string) {
    console.log("Sending email...");
    const mailOptions = {
      to: receiverEmail,
      subject: "Xác thực địa chỉ email",
      text: "Verify of your email",
      html: `
      <h5> Chào bạn </h5>
      <p> Bạn vừa yêu xác thực địa chỉ email tại website QNA </p>
      <h1> ${opt} </h1>
      <p> Mã này sẽ hết hạn sau 5 phút </p>
      <p> Nếu bạn không yêu cầu, vui lòng bỏ qua email này </p>
      <p>Trân trọng.</p>
      <p>QNA</p>
    `,
    };

    try {
      await this.mailerService.sendMail(mailOptions);
      console.log("Email sent successfully!");
      return {
        data: {
          status: "success",
          message: "Email sent successfully!",
          email: receiverEmail,
        },
      };
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}
