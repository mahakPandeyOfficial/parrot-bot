import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";


//used for limiting the request and question......
const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ];

// Access your API key as an environment variable (see "Set up your API key" above)

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_PUBLIC_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings});

//we can use model: gemini-1.5-pro also but flash version is fastest one....

export default model;