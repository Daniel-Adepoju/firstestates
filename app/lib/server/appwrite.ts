import {Client} from 'appwrite'

export const client = new Client()
.setEndpoint('https://cloud.appwrite.io/v1')
.setProject(process.env.NEXT_PUBLIC_APPWRITE_ID!)