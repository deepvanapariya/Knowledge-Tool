import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

const app = express();

dotenv.config();
const API_KEY = process.env.API_KEY;

app.use(cors());
app.use(bodyParser.json());

app.post("/demo", (req, res) => {
    console.log(req.body)
    res.send("hello")
})

app.post('/search', async (req, res) => {

    try {
        const query = req.body.query;
        console.log("query=>", query)
        const apiKey = API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain",
        };

        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ];
        run(query);
        async function run(promt) {
            const chatSession = model.startChat({
                generationConfig,
                safetySettings,
                history: [
                ],
            });

            const result = await chatSession.sendMessage(promt);
            let response = result.response.text();
            let responseArray = response.split("**");
            let newResponse = "";
            for (let i = 0; i < responseArray.length; i++) {
                if (i === 0 || i % 2 !== 1) {
                    newResponse += responseArray[i];
                } else {
                    newResponse += "<b>" + responseArray[i] + "<b>";
                }
            }
            let newResponse2 = newResponse.split("*").join("<br>");
            return res.send(newResponse2);
        }

    } catch (err) {
        console.log("error", err)
    }
});


app.listen(8080, () => console.log("server started"))



