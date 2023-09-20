import React, {useEffect, useRef, useState} from 'react';
import Avatar from "@/app/chat/avatar";
import Message from "@/app/chat/message";
import AiSuggestion from "@/app/chat/ai-suggestion";
import message from "@/app/chat/message";

type MessageType = {
    author: string,
    content: string
}

function Chat() {

    const [isGenerating, setIsGenerating] = useState(false)
    const [isHelpOpen, setIsHelpOpen] = useState(false)
    const [text, setText] = useState("")
    const [messages, setMessages] = useState([])
    const messagesEndRef = useRef(null)
    const [aiSuggestions, setAiSuggestions] = useState(
        []
    )
    const [isAiTyping,setIsAiTyping] = useState(false)
    useEffect(() => {
        messagesEndRef.current?.['scrollIntoView']({ behavior: "smooth" })
    }, [messages]);

    const restartChat = () => {
        window.location.reload()
    }
    const onSendMessage=() => {
        const newMessages = messages.concat({
            author: 'user',
            content: text
        })
        setMessages(newMessages)
        setText("")
        setIsAiTyping(true)
        fetch('/api/chat', {
            method: "POST",
            body: JSON.stringify({messages: newMessages})
        }).then(res => res.json().then(
            response => {
                if (response.content) {
                    const newerMessages = newMessages.concat({
                        author: "assistant",
                        content: response.content
                    })
                    setMessages(newerMessages)
                    setIsAiTyping(false)

                }
            }
        ))
    }
    const getSuggestions=() => {
        setIsGenerating(true)
        fetch('/api/chat', {
            method: "PUT",
            body: JSON.stringify({messages: messages})
        }).then(res => res.json().then(
            response => {
                if (response.content) {
                    try{
                        const result: { responses:string[] } = JSON.parse(response.content) as any
                        if(result.responses){
                            setAiSuggestions(result.responses.map(x=>({text:x})))
                            setIsGenerating(false)
                        }
                    }
                    catch (e) {
                        // todo set failed
                        console.log('failed',e)
                    }
                }
            }
        ))
    }



    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-100 ">
            <div className="pt-4 w-full flex flex-col justify-between  h-full bg-white rounded-lg shadow-lg">

                <div className="flex items-center justify-between mb-4">
                    <a className="ml-3 flex flex-row items-center cursor-pointer" href={"/select"}>
                        <div className={"text-2xl p-2 "}>ᐊ</div>
                        <div>
                            <p className="text- font-medium text-gray-900">Talking with a stranger</p>
                            <p className="text-sm text-gray-500">talk with 1 person you never met before</p>
                        </div>

                    </a>
                    <div className={"mr-3 p-2 bg-cyan-700 text-white rounded cursor-pointer"}
                    onClick={restartChat}>Restart Chat</div>
                </div>
                <hr />


                <div className=" flex-1 overflow-y-auto w-full py-4 pb-10 px-2">
                    <div className="flex flex-col space-y-4 w-full ">
                        {messages.map((m, i) =>
                            <Message key={i} byUser={m.author == 'user'} body={m.content}/>
                        )}
                        {isAiTyping && <Message byUser={false} body={<div className={"animate-bounce"}>typing...</div>} />}
                        <div ref={messagesEndRef} />
                    </div>

                </div>

                {messages.length > 0 && <div className="relative">
                    <div
                        className={"p-2 bottom-0 absolute w-fit bg-cyan-700 text-center rounded-tr-2xl text-white flex flex-col"}>
                  <span className={"font-bold " + (!isHelpOpen && 'cursor-pointer')}
                        onClick={() => {
                            setIsHelpOpen(true)
                            getSuggestions()
                        }}
                  >Feeling stuck?</span>
                        {isHelpOpen && <div className={"p-2 w-72 "}>
                            {!isGenerating && <div>
                                <span>Try one of these</span>
                                <div className={"flex flex-col max-h-96 overflow-y-auto"}>
                                    {
                                        aiSuggestions.map((suggestion, i) =>
                                            <AiSuggestion key={i}
                                                          onClick={() => {
                                                              setText(suggestion.text)
                                                              setIsHelpOpen(false)
                                                          }} text={suggestion.text}/>)
                                    }

                                </div>
                            </div>}

                            {isGenerating && <div className={"py-8"}>
                                <div className={"animate-spin text-4xl"}>🤔</div>
                                <span>Generating...</span>
                            </div>}
                            <div className={"flex flex-col"}>
                                {!isGenerating &&
                                    <span onClick={getSuggestions} className={"text-4xl cursor-pointer"}>↻</span>}
                                <span className={"text-xs cursor-pointer"}
                                      onClick={() => setIsHelpOpen(false)}>close</span>
                            </div>
                        </div>}

                    </div>
                </div>}

                <div className="p-4 bg-gray-200">

                    <div className="flex items-center">
                        <input type="text" placeholder="Type your message"
                               value={text}
                               onKeyUp={event => {
                                   if (event.key === 'Enter') {
                                      onSendMessage()
                                   }
                               }}
                               onChange={(e) => setText(e.target.value)}
                               className="flex-grow w-full px-4 py-2 mr-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"/>
                        <button
                            className="px-4 py-2 text-sm font-medium text-white bg-cyan-700 rounded-md hover:bg-cyan-800 focus:outline-none"
                            onClick={onSendMessage}
                        >Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;