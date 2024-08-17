import express from "express";
import cors from "cors";
import path from "path";
import url, { fileURLToPath } from "url";
import ImageKit from "imagekit";
import mongoose from "mongoose";
import UserChats from "./models/userChats.js";
import Chat from "./models/chats.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const port = process.env.PORT || 3000;
const app = express();

//DIRECTORY
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

//mongo connection
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.log(error);
  }
};

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

//for uploding image to bot
app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

//test

/* app.get("/api/test", ClerkExpressRequireAuth() , async(req, res) =>{
    const userId = req.auth.userId;
    console.log(userId);
    res.send("Success!!");
}) */

//for chats history
//// Use the strict middleware that raises an error when unauthenticated (clerk express used for it).
app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { text } = req.body;

  try {
    //CREATE A NEW CHAT
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });

    const saveChat = await newChat.save();

    //Check IF THE USER CHATS ALREDY EXIST
    const userChats = await UserChats.find({ userId: userId });

    //IF DOESN'T EXIST CREATE A NEW ONE ANDS ADD THE CHAT IN THE CHATS ARRAY.
    if (!userChats.length) {
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            _id: saveChat._id,
            title: text.substring(0, 40), //to prevent that extra too long input text only subtring will seen.
          },
        ],
      });
      await newUserChats.save();
    } else {
      //IF EXIST, PUSH THE CHAT TO THE ARRAY.
      await UserChats.updateOne(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: saveChat._id,
              title: text.substring(0, 40),
            },
          },
        }
      );

      res.status(201).send(newChat._id);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating chat!");
  }
});

//Chats in Menu bar
app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const userChats = await UserChats.find({ userId });

    res.status(200).send(userChats[0].chats);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching userchat!");
  }
});

app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    //using userId here so that we can fetch the usersid not others.
    const chat = await Chat.findOne({ _id: req.params.id, userId });

    res.status(200).send(chat);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching chat!");
  }
});

app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  const { question, answer, img } = req.body;

  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const updatedChat = await Chat.updateOne(
      { _id: req.params.id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );
    res.status(200).send(updatedChat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding conversation!");
  }
});

//IF ANY ERROR IN AUTH
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthenticated!");
});

app.use(express.static(path.join(__dirname, "../client")))

app.get("*", (req, res) =>{
  res.sendFile(path.join(__dirname, "../client", "index.html"))
})


app.listen(port, () => {
  connect();
  console.log(`server is running on ${port}`);
});
