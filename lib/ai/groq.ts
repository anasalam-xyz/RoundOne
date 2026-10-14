// lib/ai/groq.ts
import Groq from "groq-sdk";

const primary = new Groq({
    apiKey: process.env.GROQ_API_KEY_EVAL,
    maxRetries: 1,
});
const fallback = new Groq({
    apiKey: process.env.GROQ_API_KEY_QUES,
    maxRetries: 1,
});

const MODEL = "openai/gpt-oss-20b";

async function complete(client: Groq, prompt: string, json = false): Promise<string> {
  const t0 = Date.now();
  const res = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    reasoning_effort: "low",
    ...(json && { response_format: { type: "json_object" as const } }),
  });
  console.log("groq wall ms:", Date.now() - t0, "usage:", res.usage);
  return res.choices[0]?.message?.content ?? "";
}

export async function askGroq(prompt: string): Promise<string> {
    try {
        return await complete(primary, prompt);
    } catch (err) {
        if (err instanceof Groq.APIError && (err.status === 429 || err.status === 503)) {
            return await complete(fallback, prompt);
        }
        throw err;
    }
}