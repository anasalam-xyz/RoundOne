// lib/ai/gemini.ts
// import this in any API route that needs AI

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI1 = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_CH!);
const genAI2 = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_AN!);

// Key 1 — used for question generation (many small requests)
export const geminiQuestion = genAI1.getGenerativeModel({ model: "gemini-2.5-flash" });
export const geminiQuestionFallback = genAI2.getGenerativeModel({ model: "gemini-2.5-flash" });

// Key 2 — used for evaluation (one large request per session)
export const geminiEval = genAI1.getGenerativeModel({ model: "gemini-2.5-flash" });
export const geminiEvalFallback = genAI2.getGenerativeModel({ model: "gemini-2.5-flash" });
