import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

async function main() {
    try{
        await dbConnect()
        await UserModel.updateMany(
            
        )
    }
    catch{

    }finally{

    }
}