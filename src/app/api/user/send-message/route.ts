import dbConnect from "@/lib/dbConnect";
import { createResponse } from "@/lib/helpers";
import UserModel from "@/model/User";
import {Message} from "@/model/Message"
import { messageSchema } from "@/schemas/messageSchema";
import { NextRequest } from "next/server";
import { z } from "zod";

//This api do not required authentication, since sender will be anonymous
export async function POST(request: NextRequest) {
    try {
        const data = await request.json()
        const parsedData = messageSchema.parse(data)
        const { username } = data
        const { content } = parsedData

        await dbConnect()
        const user = await UserModel.findOne({username:username})
        if(!user || !user.isVerified){
            return createResponse(false, 'User is not found.', 404)
        }
        if(!user.isAcceptingMessage){
            return createResponse(false, 'User is not accepting messages.', 400)
        }
        const newMessage = {content: content, createdAt: new Date()}

        user.messages.push(newMessage as Message)

        user.save()
        return createResponse(true, 'Message sent successfully.', 201)
    }
    catch(error){
        if(error instanceof z.ZodError){
            console.error('Zod validation error for sending message', error)
            const errorFlat = error.flatten()
            return createResponse(false, 'Request Paramaters are incorrect.', 400, errorFlat.fieldErrors)
        }
        console.error('Error in sending message', error)
        return createResponse(false, 'Unable to send message, please try again later', 500)
    }finally{

    }
    

}