import userModel from "../models/userModel.js"


// add items to user cart
const addToCart= async (req,res)=>{
    try {
         let userData= await userModel.findOne({_id:req.body.userId})
         let cartData= await userData.cartData;
         if(!cartData[req.body.itemId]){
            cartData[req.body.itemId]=1
         }else{
            cartData[req.body.itemId] +=1;
         }
         await userModel.findByIdAndUpdate(req.body.userId,{cartData});
         res.json({success:true,message:"Added To Cart "});
    } catch (error) {
         console.log(error);
         res.json({success:false,message:"Error"})
    }
}


// remove items form user Cart
const removeFromCart= async (req,res)=>{
   try{
      let userData = await userModel.findById(req.body.userId);
      let cartData= await userData.cartData;
      if(cartData[req.body.itemId]>0){
         cartData[req.body.itemId] -=1;
      }
      await userModel.findByIdAndUpdate(req.body.userId,{cartData});
      res.json({success:true,message:"Removed From Cart"});
   }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
   }
}

// fetch user cart data
const getCart = async (req, res) => {
   try {
     // Ensure userId is being correctly fetched
     let userData = await userModel.findById(req.body.userId);
     
     // Handle case where user is not found
     if (!userData) {
       return res.json({ success: false, message: "User not found" });
     }
 
     // Extract cartData from the user document
     let cartData = userData.cartData || {}; // Default to an empty object if cartData is undefined
 
     // Respond with cart data
     res.json({ success: true, cartData });
   } catch (error) {
     console.log(error);
     res.json({ success: false, message: "Error" });
   }
 };
 

export  {addToCart,removeFromCart,getCart};