
import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document{
    content: string
    createdAt:Date;
}

export const MessageSchema: Schema<Message> = new Schema({
    content:{
        type: String,
        required: [true, "Content is required."],
    },
    createdAt: {
        type: Date,
        required: [true, 'Created at is required.'],
        default: Date.now,
    }
});