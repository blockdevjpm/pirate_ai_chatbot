import React, { useState } from 'react';
import "./chatbot.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react"

const API_KEY = "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";
const systemMessage = {
  role: "system",
  content: "Explain all concepts like a pirate."
}

const Chatbot = () => {

  const [typing, setTyping] = useState(false)
  const [message, setMessage] = useState({
      message: "Hi, I am your AI friend.",
      sender: "ChatGPT"
    })
  const [messages, setMessages] = useState([message])

  const handleSend = async (userMessage) => {

    const newMessage = {
      message: userMessage,
      sender: "user",
      direction: "outgoing"
    }
    const newMessages = [ ...messages, newMessage]

    setMessage(newMessage);
    setMessages(newMessages);
    setTyping(true);

    await processMessageToChatGPT(newMessages);
  }

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role= messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return {
        role: role,
        content: messageObject.message
      }
    })

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      setMessages(
        [
          ...chatMessages, {
            message: data.choices[0].message.content,
            sender: "ChatGPT"
          }
        ]
      )
      setTyping(false);
    })
  }

  return (
    <div className='bot'>
      <MainContainer>
        <ChatContainer>
          <MessageList
          scrollBehavior='smooth'
            typingIndicator={typing ? <TypingIndicator content="AI is typing" /> : null}
          >
            {messages.map((message, i) => {
              return <Message key={i} model={message} />
            })}
          </MessageList>
          <MessageInput placeholder='Type message here...' onSend={handleSend} />
        </ChatContainer>
      </MainContainer>
    </div>
  )
}

export default Chatbot