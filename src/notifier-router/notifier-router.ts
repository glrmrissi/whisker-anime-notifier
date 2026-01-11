import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, Logger, Inject } from "@nestjs/common";
import * as dotenv from 'dotenv';
dotenv.config();

const adminEmails = {
    myEmail: process.env.ADMIN_EMAIL || '',
};

interface Notification {
    subject: string;
    message: string;
    recipient: string | undefined;
}

export interface NotifierRouterOptions {
    adminEmails?: boolean;
    clientEmail?: string;
}

@Injectable() 
export class NotifierRouter {
    private logger = new Logger('NotifierRouter');

    constructor(
        @Inject('NOTIFIER_OPTIONS') private options: NotifierRouterOptions,
        private mailerService: MailerService
    ) { }

    async identifyEmailType(jobData: any) {
        try {
            this.logger.log(`Processing notification: ${JSON.stringify(jobData)}`);
            
            const { subject, message, recipient, options } = jobData;

            if (recipient) {
                const notification: Notification = {
                    subject,
                    message,
                    recipient,
                };
                this.logger.log("Sending to recipient...");
                await this.sendNotification(notification);
            }

            if (options?.clientEmail) {
                const notification: Notification = {
                    subject,
                    message,
                    recipient: options.clientEmail,
                };
                this.logger.log("Sending to client...");
                await this.sendNotification(notification);
            }

            if (options?.adminEmails && adminEmails.myEmail) {
                const notification: Notification = {
                    subject,
                    message,
                    recipient: adminEmails.myEmail,
                };
                this.logger.log("Sending to admins...");
                await this.sendNotification(notification);
            } else if (options?.adminEmails) {
                this.logger.warn("Admin email not configured in environment variables");
            }

            this.logger.log("Notification processed successfully");
        } catch (error) {
            this.logger.error(`Error in identifyEmailType: ${error}`);
            throw error;
        }
    }

    private async sendNotification(notification: Notification) {
        if (!notification.recipient) {
            this.logger.warn(`Skipping email - no recipient provided`);
            return;
        }

        this.logger.log(`Sending email to ${notification.recipient} with subject: ${notification.subject}`);
        await this.mailerService.sendMail({
            to: notification.recipient,
            subject: notification.subject || 'No Subject',
            html: String(notification.message || '<b>No Content</b>'),
        });
        return { message: 'E-mail enviado com sucesso!' };
    }
} 