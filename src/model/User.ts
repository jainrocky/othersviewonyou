
import mongoose, { Schema, Document } from "mongoose";
import { Message, MessageSchema } from "./Message";

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verificationCode:string;
    codeExpiry:Date;
    acceptingMessage:boolean;
    message: Message[]
    createdAt:Date;
}

export const UserSchema: Schema<User> = new Schema({
    username:{
        type: String,
        required: [true, "Username is required."],
        trim: true,
        unique: true,
    },
    email:{
        type: String,
        required: [true, "Email is required."],
        unique: true,
        match: [/.+\@.+\..+/, 'please use a valid email address.'],
    },
    password: {
        type: String,
        required: [true, "Password is required."],
    },
    verificationCode: {
        type: String,
        required: [true, 'Verification code is required.'],
    },
    codeExpiry: {
        type: Date,
        required: [true, 'Code expiry is required.'],
    },
    acceptingMessage: {
        type: Boolean,
        required: [true, 'Accepting message is required.'],
    },
    message: [MessageSchema],
    createdAt: {
        type: Date,
        required: [true, 'Created at is required.'],
        default: Date.now,
    }
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema))

export default UserModel;