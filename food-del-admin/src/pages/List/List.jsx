import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({url}) => {
  const [list, setList] = useState([]);


  const fetchList = async () => {
    try {
      const { data } = await axios.get(`${url}/api/food/list`);
      if (data.success) {
        setList(data.data);
      } else {
        toast.error("Failed to fetch food list.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching the list.");
      console.error("Fetch error:", error);
    }
  };

  const removeFood = async (foodId) => {
    try {
      const { data } = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (data.success) {
        toast.success(data.message);
        await fetchList();
      } else {
        toast.error("Failed to remove the food item.");
      }
    } catch (error) {
      toast.error("An error occurred while removing the food item.");
      console.error("Remove error:", error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>All Food List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Actions</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className="list-table-format">
            <img 
              src={`${url}/images/${item.image}`} 
              alt={item.name || "Food Item"} 
            />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>${item.price}</p>
            <p 
              onClick={() => removeFood(item._id)} 
              className="cursor"
              style={{ color: "red", cursor: "pointer" }}
            >
              X
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
