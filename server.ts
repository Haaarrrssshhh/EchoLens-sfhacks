import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';
import prompt from "./prompt";
import text from "./test";

async function fileToGenerativePart(path: string, mimeType: string) {
    const fs = require("fs");
    try {
        const fileData = fs.readFileSync(path);
        return {
            inlineData: {
                data: Buffer.from(fileData).toString("base64"),
                mimeType
            },
        };
    } catch (error) {
        console.error("Error reading file:", path, error);
        throw error; // Re-throw the error to be caught by the caller
    }
}

async function runGemini() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        console.log("Generative AI initialized", genAI);

        // Check if prompt is defined and has the necessary properties
        if (!prompt || !prompt.task || !prompt.input || !prompt.output) {
            console.error("Prompt object is not properly defined:", prompt);
            return; // Exit the function if the prompt is invalid
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const promptAI = prompt.task + '\\n\\n' + prompt.input + '\\n\\n' + prompt.output;
        const pageTextPrompt = text;
        const images = [
            {
                src: "assets/gemini.png",
                mimeType: "image/png"
            }
        ];

        const imageParts = await Promise.all(images.map(async (image: any) => {
            try {
                return await fileToGenerativePart(image.src, image.mimeType);
            } catch (error) {
                console.error("Failed to convert image to generative part:", image.src, error);
                return null; // Or handle the error as needed
            }
        }));

        // Filter out any null image parts in case of errors
        const validImageParts = imageParts.filter(part => part !== null);

        const result = await model.generateContent([promptAI, pageTextPrompt, ...validImageParts]);
        const transcript = await result.response.text();

        console.log({ transcription: transcript });
    } catch (error) {
        console.error("Error in runGemini:", error);
    }
}

runGemini();