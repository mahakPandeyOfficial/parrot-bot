import React from 'react'
import './homepage.css';
import {Link} from 'react-router-dom'
import { TypeAnimation } from 'react-type-animation';
import { useState } from 'react';

const Homepage = () => {
  
  //test

  /* const test = async ()=>{
    await fetch("http://localhost:3000/api/test", {
      credentials: "include",
    });
  };
 */

  const [typingStatus, setTypingStatus] = useState("human1")
  return (
    <div className='homepage'>
      
      <img src="/orbital.png" alt="" className='orbital' />
      <div className="left">
        <h1>PARROT BOT</h1>
        <h2>Our connection must be in the cloud because its out of this world</h2>
        <h4>Meet Parrot Bot, your AI-powered chat companion designed to engage, assist, and entertain just like companion. Whether you are looking for insightful conversations, quick answers, or just a bit of fun, Parrot Bot is here to learn from you and adapt to your needs. Lets chat and explore endless possibilities together!</h4>
        <Link to="/dashboard" className="swipe">Get Started<span className="container"><svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"></path></svg></span> </Link>
        
      </div>
      

      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="bot.png" alt="" className='bot'/>
          <div className="chat">
            <img src={typingStatus === "human1" ? "/human1.jpeg" : typingStatus === "human2" ? "/human2.jpeg" : "/bot1.png"} alt="" />
          <TypeAnimation
      sequence={[
        // Same substring at the start will only be typed out once, initially
        'Human: Hey Parrot Bot, what exactly can you do?',
        2000, ()=>{
          setTypingStatus("parrot bot")
        },
        'Parrot Bot: Are you searching for answers? Because I have got everything you have been looking for.',
        2000, ()=>{
          setTypingStatus("human2")
        },
        'Human: Thats intriguing! Whats your favorite thing to talk about?',
        2000, ()=>{
          setTypingStatus("parrot bot")
        },
        'Parrot Bot: Talking with you feels like a perfect algorithm—efficient, engaging',
        2000, ()=>{
          setTypingStatus("human1")
        },
      ]}
      wrapper="span"
      cursor= {true}
      omitDeletionAnimation={true}
      repeat={Infinity}
    />
          </div>
        </div>
      </div>

      <div className="terms">
        <img src="/logo.png" alt="" />
        <div className="links">
        <Link to="/">Terms of Services</Link> <span>|</span>
        <Link to="/">Privacy Policy</Link>
        </div>
        
      </div>
     
    </div>
  )
}

export default Homepage
