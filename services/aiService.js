import { AppConstants } from "@/Constants/AppConstants";
import { LoggerUtil } from "@/utils/LoggerUtil";
import { GoogleGenerativeAI } from "@google/generative-ai";

const sendRequestToGemini = async (prompt, assistant='assitant', responseFormat='json') => {
    const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.AI_MODEL || 'gemini-pro',
    });
    const result = await model.generateContent(
      `Please act as ${assistant}. ${prompt} and your response format should be ${responseFormat}`
    );
    const response = await result.response;
    let text = response.text();
    return text;
  }

const sendRequestToOpenAi = async (prompt, assistant = 'assistant', responseFormat='json') => {
    const url = `https://api.openai.com/v1/chat/completions`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'gpt-3.5-turbo',
        response_format: responseFormat,
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
    sendRequestToAI : (prompt, assistant='assistant', responseFormat= { type: "json_object" }) => {
        const aiServer = process.env.AI_SERVER;
        if(!aiServer) throw new Error(`AI server not specified`);
        LoggerUtil.debug("Promt request: " + JSON.stringify(prompt));
        if(aiServer === AppConstants.AI_SERVERS.OPEN_AI){
            return sendRequestToOpenAi(prompt, assistant, responseFormat);
        }else if(aiServer === AppConstants.AI_SERVERS.GEMINI){
            return sendRequestToGemini(prompt,assistant,responseFormat);
        }
    }
};
