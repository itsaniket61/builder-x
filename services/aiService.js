import { AppConstants } from "@/Constants/AppConstants";
import { GoogleGenerativeAI } from "@google/generative-ai";

const sendRequestToGemini = async (prompt, assistant='assitant') => {
    const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.AI_MODEL || 'gemini-pro',
    });
    const result = await model.generateContent(
      `Please act as ${assistant}. ${prompt}`
    );
    const response = await result.response;
    let text = response.text();
    return text;
  }

const sendRequestToOpenAi = async (prompt, assistant = 'assistant') => {
    const url = `https://api.openai.com/v1/chat/completions`;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a ' + assistant,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    };
    const request = await fetch(url, options);
    const json = await request.json();
    if(request.ok){
      return json.choices[0].message.content;
    }else{
      throw new Error(JSON.stringify(json));
    }
  }
export const aiService = {
    sendRequestToAI : (prompt, assistant='assistant') => {
        const aiServer = process.env.AI_SERVER;
        if(!aiServer) throw new Error(`AI server not specified`);
        if(aiServer === AppConstants.AI_SERVERS.OPEN_AI){
            return sendRequestToOpenAi(prompt, assistant);
        }else if(aiServer === AppConstants.AI_SERVERS.GEMINI){
            return sendRequestToGemini(prompt,assistant);
        }
    }
};
