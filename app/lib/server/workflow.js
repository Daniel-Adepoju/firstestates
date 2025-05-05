import {Client as WorkflowClient} from '@upstash/workflow'
import {Client as QStashClient} from '@upstash/qstash'

export const workflowClient = new WorkflowClient({
    url: process.env.QSTASH_URL,
    token: process.env.QSTASH_TOKEN
})

const qstashClient = new QStashClient({token:process.env.QSTASH_TOKEN})

export const sendEmail = async ({email,subject,message})  => {
    await qstashClient.publishJSON({
        url: `${process.env.PROD_BASE_URL}/api/send_emails`,
        body: {
            to: [email],
            subject,
            text: message
        }
    })
}