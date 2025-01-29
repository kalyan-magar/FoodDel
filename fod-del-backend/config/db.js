import mongoose from "mongoose";
export const connectDB= async () => {
    await mongoose.connect('$YOUR_CONNECTION_STRING').then(()=>{
        console.log("DB Connected");
    })
}