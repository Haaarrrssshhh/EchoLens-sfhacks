
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
console.log("Generative AI initialized", genAI);
// Converts local file information to base64
function fileToGenerativePart(path: string, mimeType: string) {
    const fs = require("fs");
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType
        },
    };
}


async function run() {


    try {

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const prompt = "Transcribe this webpage for a blind user. Include all the web page text and descriptions of all image content in the order thet appear.";
        const pageTextPrompt = "This is a test article on AI and images.";
        const images = [
            {
                src: "assets/gemini.png",
                mimeType: "image/png"
            }
        ]
        const imageParts = [
            ...images.map((image: any, index: number) => ({
                ...fileToGenerativePart(image.src, image.mimeType),
            })),
        ];

        const result = await model.generateContent([prompt, pageTextPrompt, ...imageParts]);
        const text = await result.response.text();

        console.log({ transcription: text });
    } catch (error) {
        console.error("Error in /transcribe endpoint:", error);

    }
}

run();