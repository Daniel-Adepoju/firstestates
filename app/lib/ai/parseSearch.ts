import { gemini } from "./gemini"
import { SEARCH_INSTRUCTION } from "./searchPrompt"

export async function parseSearch(query: string) {
  const response = await gemini.models.generateContent({
    model: "gemini-3.5-flash-lite",
// gemini-3.5-flash-lite
    contents: `
    Convert this real-estate search into structured filters:

    ${query}
  `,

    config: {
      systemInstruction: SEARCH_INSTRUCTION,
      responseMimeType: "application/json",

      // responseSchema: {
      //   type: "object",
      //   properties: {
      //     school: {
      //       type: "string",
      //     },
      //     location: {
      //       type: "string",
      //     },
      //     minPrice: {
      //       type: "number",
      //     },
      //     maxPrice: {
      //       type: "number",
      //     },
      //     bedrooms: {
      //       type: "number",
      //     },
      //     bathrooms: {
      //       type: "number",
      //     },
      //     // toilets: {
      //     //   type: "number",
      //     // },
      //   },
      // },
    },
  })

  return JSON.parse(response.text || "{}")
}
