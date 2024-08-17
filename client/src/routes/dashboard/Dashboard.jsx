import React from 'react'
import './dashboard.css'
import {useAuth} from '@clerk/clerk-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

  // Access the client
  const queryClient = useQueryClient()

  const navigate = useNavigate()
   // Mutations
   const mutation = useMutation({
    mutationFn: (text) =>{
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        credentials:"include",
        headers: {
          "Content-Type":"application/json"
        },
        body:JSON.stringify({text})
      }).then((res)=> res.json());
    },
    onSuccess: (id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["userChats"] }); 
      navigate(`/dashboard/chats/${id}`);
    },
  })


  const handleSubmit = async (e) =>{
    e.preventDefault()
    const  text = e.target.text.value;

    if(!text) return;

    mutation.mutate(text);
    
  }
  return (
    <div className='dashboard'>
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="" />
        </div>
        <div className="options">
          <div className="option">
            <img src="/chat.png" alt="" />
            <span>Create a New Chat</span>
          </div>
          <div className="option">
            <img src="/image.png" alt="" />
            <span>Genrate Image by prompt</span>
          </div>
          <div className="option">
            <img src="/code.png" alt="" />
            <span>Your Coding partner</span>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input type="text" name="text" placeholder='Ask me anything....' id="" />
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default Dashboard