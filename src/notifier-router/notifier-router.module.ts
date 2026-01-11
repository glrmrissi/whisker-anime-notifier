import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { NotifierRouterService } from "./notifier-router.service";
import { MailerModule } from "@nestjs-modules/mailer/dist/mailer.module";
import { NotifierRouter } from "./notifier-router";

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'notifier-router-queue',
        }),
        MailerModule.forRoot({
            transport: {
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'libby58@ethereal.email',
                    pass: '5ehzR2Pd3vbtj5F2q9'
                }
            },
        }),
    ],
    providers: [
        NotifierRouterService,
        NotifierRouter,
        {
            provide: 'NOTIFIER_OPTIONS',
            useValue: {
                adminEmails: true,
                clientEmail: '',
            },
        },
    ],
})
export class NotifierRouterModule { }