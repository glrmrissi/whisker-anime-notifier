import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { NotifierRouter } from "./notifier-router";

@Injectable()
@Processor('notifier-router-queue')
export class NotifierRouterService extends WorkerHost {
    constructor(
        private readonly notifierRouter: NotifierRouter
    ) {
        super();
    }
    async process(job: Job) {
        console.log('Chegou um job!', job.id, job.data);
        await this.notifierRouter.identifyEmailType(job.data);
        return { success: true };
    }
}