import { MailerService } from "@nestjs-modules/mailer";
export declare class EmailService {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    sendEmailResetPassword(receiverEmail: string, link: string): Promise<{
        data: {
            status: string;
            message: string;
            email: string;
        };
    }>;
    sendEmailAddEmail(receiverEmail: string, link: string): Promise<{
        data: {
            status: string;
            message: string;
            email: string;
        };
    }>;
}
