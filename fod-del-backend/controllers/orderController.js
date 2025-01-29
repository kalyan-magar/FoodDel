import validator from "validator"; // Import the default export from validator
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const { isCurrency } = validator; // Destructure isCurrency from the validator object

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL || "http://localhost:5174";

  try {
    // Create new order
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    await newOrder.save();

    // Clear the user's cart
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Generate line items for Stripe Checkout
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "usd", // Set currency to USD
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100, // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Add delivery charges as a separate line item
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 200, // Delivery charge in cents
      },
      quantity: 1,
    });

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    // Respond with the session URL
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to place order. Please try again.",
      error: error.message,
    });
  }
};


const verifyOrder = async (req,res)=>{
   const {orderId,success} = req.body;
   try{
    if(success=="true"){
        await orderModel.findByIdAndUpdate(orderId,{payment:true});
        res.json({success:true,message:"Paid"})
    }else{
      await orderModel.findByIdAndDelete(orderId);
      res.json({success:false,message:"Not Paid"})
    }
   }catch(error){
      console.log(error);
      res.json({success:false,message:"Error"});
   }
}

// user orders for frontend (user orders using api)
const userOrders = async (req,res) =>{
       try {
        // we are providing filters 
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success:true,data:orders});
        
       } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
       }
}

// Listing orders for admin panel 
const listOrders = async (req,res) =>{
         try {
        const orders= await orderModel.find({});
        res.json({success:true,data:orders})
         } catch (error) {
             console.log(error);
             res.json({success:false,message:"Error"});
         }
      
}

//api for updating order status
const updateStatus = async (req,res) =>{
  try {
    // find the order first here 
    //get the status req
      await orderModel.findByIdAndUpdate(req.body.orderId, {
        status:req.body.status
      });
      res.json({success:true,message:"Status Updated"})
  } catch (error) {
      console.log(error);
      res.json({success:false,message:"Error"});
  }

}


export { placeOrder, verifyOrder, userOrders,listOrders,updateStatus};
