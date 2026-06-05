// lib/gemini.ts
// Gemini client — import this in any API route that needs AI

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// We use gemini-1.5-flash — fast, free tier, good enough for interviews
export const gemini = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
