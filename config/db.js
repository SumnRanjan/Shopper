const mongoose=require("mongoose")
const dotenv=require("dotenv")

dotenv.config()


const dbConnect=async()=>{
    // console.l
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        console.log("Connection Successfull")
        
    } catch (error) {
        console.log(error)
        
    }
}

module.exports={
    dbConnect
}
