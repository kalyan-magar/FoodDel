import axios from "axios";
import { createContext, useState } from "react";

import { useEffect } from "react";

//context api
//two component 
// every react context object comes with
//provider AND consumer react component 

// 1) create context object
// const UserContext = React.createContext()
//2)
// userProvider=UserContxt.provider
// userConsumer=userContext.consumer
// 3)
// export {UserProvider, UserConsumer}

export const StoreContext=createContext(null);
const StoreContextProvider =(props)=>{
    // we are creating Entries here 
    //{[itemId:10],...}
    const [cartItems,setCartItems]=useState({});
    const url = "http://localhost:400";
    const [token,setToken]=useState("");
    const [food_list,setFoodList]= useState([])
     
    const addToCart=async (itemId)=>{
        // mutate state then saving
     if(!cartItems[itemId]){
        // if new entry
        setCartItems((prev)=>({...prev,[itemId]:1}))   
    }else{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
    }

    if(token){
        await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
    }
    }
    const removeFromCart= async (itemId)=>{
        
        setCartItems((prev)=>{
            if(prev[itemId]<=0){
                return {...prev,[itemId]:0}
            }
        return  ({...prev,[itemId]:prev[itemId]-1})
        })

        if(token){
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
        }
    }
   
 const getTotalCartAmount=()=>{
    let totalAmount=0;
    // quantity price (we need)
    //only get the items that is present in the cart how=> find it
    for( const item in cartItems){
       if(cartItems[item]>0){
        let itemInfo = food_list.find((product)=>product._id===item);
        totalAmount= totalAmount + (itemInfo.price* cartItems[item]);
       }
    }
     return totalAmount;
 }

  const fetchFoodList=async ()=>{
     const  response= await axios.get(url+"/api/food/list");
     setFoodList(response.data.data)
}

const loadCartData = async (token) => {
    const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
    setCartItems(response.data.cartData);
}

 useEffect(()=>{
    async function loadData(){
        await fetchFoodList();
         // to solve refresh page problem
    if(localStorage.getItem("token")){
        setToken(localStorage.getItem("token"));
       await loadCartData(localStorage.getItem("token"));
    }
    }

    loadData();
 },[]);

    // here added element accessed in any component
    const contextValue={
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        setToken,
        token,
     }

    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;