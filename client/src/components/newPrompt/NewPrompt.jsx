import { useEffect, useRef, useState } from "react";
import "./newPrompt.css";
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import model from "../../lib/gemini";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewPrompt = ({ data }) => {
  //for new question
  const [question, setQuestion] = useState("");
  //for answer
  const [answer, setAnswer] = useState("");

  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  const chat = model.startChat({
    history: [
      data?.history.map(({role, parts}) => ({
        role,
        parts: [{text: parts[0].text}],
      })),
    ],
    generationConfig: {
      //maxOutputTokens: 1000,
    },
  });

  const endRef = useRef(null);
  const formRef = useRef(null);  //it is used for reseting the input text from the form.

  //for scroll effect of chats
  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer, img.dbData]);

  // Access the client
  const queryClient = useQueryClient();

  // Mutations
  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          formRef.current.reset()
          setQuestion(""),
            setAnswer(""),
            setImg({
              isLoading: false,
              error: "",
              dbData: {},
              aiData: {},
            });
        });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  //add chat ka option by using gemini api is here ---
  const add = async (text, isInitial) => {
    if (!isInitial) setQuestion(text);

    try {
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, text] : [text]
      );
      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        console.log(chunkText);
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }
      mutation.mutate();
    } catch (error) {
      console.log(error);
    }
  };

  //handeling submit
  const handleSubmit = async (e) => {
    //don't want to refresh the page so use default
    e.preventDefault();

    const text = e.target.text.value;

    if (!text) return;

    add(text, false);   //here initial is false bcz we are not having initial or first value.
  };

  //to prevent the new chat answer or getting answer in new chat --- this is the useEffect used here


  //IN PRODUCTION WE DONT NEED IT
  const hasRun = useRef(false)     //this make sure to run only once.
  useEffect(()=>{
    if(!hasRun.current) {
      if(data?.history?.length === 1){
        add(data.history[0].parts[0].text , true);   //adding to the DB
      }
    }
    hasRun.current = true;
  }, []);

  return (
    <>
      {/**ADD NEW CHAT */}
      {img.isLoading && <div>Loading...</div>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width={"380px"}
          transformation={[{ width: 380 }]}
        />
      )}
      {question && <div className="message user">{question}</div>}

      {answer && (
        <div className="message">
          <Markdown>{answer}</Markdown>
        </div>
      )}
      <div className="endChat" ref={endRef}></div>

      <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
        <Upload setImg={setImg} />
        <input type="file" id="file" multiple={false} hidden />
        <input type="text" name="text" placeholder="Ask anything..." />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
