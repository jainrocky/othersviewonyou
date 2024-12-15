import { User } from "@/model/User";

export default interface ValidUserApiResponse{
    status:boolean,
    message:string,
    statusCode:number,
    user?:User
}