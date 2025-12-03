/* eslint-env node */
/* global process */
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

// Read .env manually since we can't rely on vite/dotenv here easily without installing more deps
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const apiKeyMatch = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
const API_KEY = apiKeyMatch ? apiKeyMatch[1].trim() : null;

if (!API_KEY) {
    console.error("API Key not found in .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        console.log("Fetching available models...");
        // There isn't a direct listModels method exposed easily in the high-level SDK for client-side, 
        // but we can try a simple generation with a known model to test connectivity,
        // or use the model-listing endpoint via fetch if the SDK doesn't support it directly in this version.

        // Actually, let's just try to generate content with a few common model names and see which one works.
        const candidates = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-001",
            "gemini-1.5-pro",
            "gemini-1.5-pro-001",
            "gemini-pro",
            "gemini-1.0-pro"
        ];

        for (const modelName of candidates) {
            console.log(`Testing model: ${modelName}...`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                const response = await result.response;
                console.log(`✅ SUCCESS: ${modelName} is working.`);
                console.log(`Response: ${response.text()}`);
                return; // Stop after finding a working one
            } catch (error) {
                console.log(`❌ FAILED: ${modelName}`);
                console.log(`Error: ${error.message.split('\n')[0]}`); // Print first line of error
            }
        }

        console.log("All common models failed.");

    } catch (error) {
        console.error("Fatal Error:", error);
    }
}

listModels();
