import { NextResponse } from 'next/server';
import {config} from "dotenv";
import {Configuration, CreateChatCompletionRequest, OpenAIApi} from "openai";
import {ChatCompletionRequestMessage} from "openai/api";

const convContext =`
A conversation between a woman and a man inside of a dating app.
neither the woman nor the man have any pictures or have written anything in their bio.
`
const aiCharacter = `
Kat, the girl in the conversation, a quiet and timid girl. she will avoid leading conversations and will answer in the most minimal possible way
`
const aiCharacterName='Kat'
config();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getResponse(messages: ChatCompletionRequestMessage[])  {
    // const messages = [];
    // messages.push({role:"system",content:"Your job is to talk with people, try to be friendly, lead the conversation"})
    // messages.push({role:"user",content:"hello"})
    const systemMessage: ChatCompletionRequestMessage = {role:"system",content:`
    Your job is to simulate a conversation. you will take the role of: ${aiCharacter}
    the conversation context is: ${convContext}
    `}
    messages.unshift(systemMessage)
    try {
        const flagged = ((await openai.createModeration({input: messages.map(m => m.content)})).data).results.some(x=>x.flagged);
        if(flagged) return undefined;
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
        });
        const completion_text = completion.data.choices[0].message.content;
        return completion_text

    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
    }

}
async function getSuggestions(conversation: ChatCompletionRequestMessage[])  {
    const messages = [];
    const systemMessage: ChatCompletionRequestMessage = {role:"system",content:`
    Your job is to offer example responses to a conversation, you would be given a conversation by the user and your job is to return 3 potential responses. use the following json format:
     {"responses":["example response 1","example response 2","example response 3"]}
     only respond with the the json and add no additional context
     the chat context is ${convContext}, the user is talking with ${aiCharacter}.
     help the user lead the conversation with the example responses
     `}
    messages.push(systemMessage)

    messages.push({
        role:'user',
        content:`give me potential responses to this chat:\n"${conversation.map(msg=>`${msg.role == 'user'?'user':aiCharacterName}
: ${msg.content}
    `).join('\n')}"\n I am the user, and I want to lead the conversation, how should I respond to ${aiCharacterName}`
    })
    try{
        const flagged = ((await openai.createModeration({input: messages.map(m => m.content)})).data).results.some(x=>x.flagged);
        if(flagged) return undefined;
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
        });
        const completion_text = completion.data.choices[0].message.content;
        return completion_text

    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
    }

}



export async function POST(request: Request) {
    const data = await request.json();
    console.log(data)
    // Validate messages
    const messages = data.messages.map(m=>({
        role: m.author=='user'?'user':'assistant',
        content: m.content
    })).filter(m=>m.role&&m.content)
    if(!messages.length)  throw "invalid message"
    const response =await getResponse(messages)

    return NextResponse.json({ content:response });
}


export async function PUT(request: Request) {
    const data = await request.json();
    console.log(data)
    // Validate messages
    const messages = data.messages.map(m=>({
        role: m.author=='user'?'user':'assistant',
        content: m.content
    })).filter(m=>m.role&&m.content)
    if(!messages.length)  throw "invalid message"
    const response =await getSuggestions(messages)

    return NextResponse.json({ content:response });
}

