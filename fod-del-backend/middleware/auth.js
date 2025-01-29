import jwt from "jsonwebtoken";
// if user send item id, we add one entry in their cart 
// there will need token auth?
// to decode token we need middleware
const authMiddleware = async (req,res,next) =>{
    const {token} = req.headers;
    if(!token){
        return res.json({success:false,message:"Not Authorized Login again"})
    }
    try{
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();
    }catch(error){
       console.log(error);
       res.json({success:false,message:"Error"})
    }
}


export default authMiddleware;