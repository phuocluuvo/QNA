"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
let EmailService = class EmailService {
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async sendEmailResetPassword(receiverEmail, link) {
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
        }
        catch (error) {
            console.error("Error sending email:", error);
        }
    }
    async sendEmailAddEmail(receiverEmail, link) {
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
        }
        catch (error) {
            console.error("Error sending email:", error);
        }
    }
    async sendEmailVerify(receiverEmail, opt) {
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
        }
        catch (error) {
            console.error("Error sending email:", error);
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], EmailService);
//# sourceMappingURL=email.service.js.map