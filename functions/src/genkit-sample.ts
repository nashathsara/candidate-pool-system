// import {genkit, z} from "genkit";


// Cloud Functions for Firebase supports Genkit natively. The onCallGenkit function creates a callable
// function from a Genkit action. It automatically implements streaming if your flow does.
// The https library also has other utility methods such as hasClaim, which verifies that
// a caller's token has a specific claim (optionally matching a specific value)
// import { onCallGenkit, hasClaim } from "firebase-functions/https";

// Gemini Developer API models and Vertex Express Mode models depend on an API key.
// API keys should be stored in Cloud Secret Manager so that access to these
// sensitive values can be controlled. defineSecret does this for you automatically.
// If you are using Google Developer API (googleAI) you can get an API key at https://aistudio.google.com/app/apikey
// If you are using Vertex Express Mode (vertexAI with apiKey) you can get an API key
// from the Vertex AI Studio Express Mode setup.
// import { defineSecret } from "firebase-functions/params";
// const apiKey = defineSecret("GOOGLE_GENAI_API_KEY");

// The Firebase telemetry plugin exports a combination of metrics, traces, and logs to Google Cloud
// Observability. See https://firebase.google.com/docs/genkit/observability/telemetry-collection.
// import {enableFirebaseTelemetry} from "@genkit-ai/firebase";
// enableFirebaseTelemetry();

// const ai = genkit({
//   plugins: [
//     /* Add your plugins here. */
//   ],
// });

// Sample Genkit flow - commented out until genkit dependencies are installed
// const menuSuggestionFlow = ai.defineFlow({
//     name: "menuSuggestionFlow",
//     inputSchema: z.string().describe("A restaurant theme").default("seafood"),
//     outputSchema: z.string(),
//     streamSchema: z.string(),
//   }, async (subject, { sendChunk }) => {
//     const prompt = `Suggest an item for the menu of a ${subject} themed restaurant`;
//     const { response, stream } = ai.generateStream({
//       model: '',
//       prompt: prompt,
//       config: { temperature: 1 },
//     });
//
//     for await (const chunk of stream) {
//       sendChunk(chunk.text);
//     }
//     return (await response).text;
//   }
// );
//
// export const menuSuggestion = onCallGenkit({
//   secrets: [apiKey],
// }, menuSuggestionFlow);
