import {RegisterUserSchema} from "../Validation/UserValidation";
import {UserModel} from "../Model/UserModel";
import bcrypt from "bcrypt";
import exp from "node:constants";


const userResolver = {
     Mutation : {
          register : async(args :{
               name : string,
               email : string,
               password: string,
               userType : string,
          }) => {
               try{
                    const {name,email,password,userType }  = RegisterUserSchema.parse({
                         name: args.name,
                         email: args.email,
                         password: args.password,
                         userType : args.userType,
                    })
                    const userExists = await UserModel.findOne({ email });
                    if (userExists) {
                         throw new Error("User already exists");

                    }
                    const hashedPassword = await bcrypt.hash(password, 10);

                    const user = await UserModel.create({
                         name,
                         email,
                         password: hashedPassword,
                         userType,
                    });

                    if (user) {
                         console.log("User Account Created successfully")
                         return user
                    } else {
                        throw new Error("Invalid User Data");
                    }

               }catch(error){

               }
          }

     },
     Query : {

     }
}


export default userResolver;