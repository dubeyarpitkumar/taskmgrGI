import { GoogleGenAI, Type } from '@google/genai';

export async function generateTasksFromGoal(goal: string): Promise<{ title: string; notes: string }[]> {
  if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using mock data.");
    // Return mock data if API key is not available
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                { title: `Setup project for '${goal}'`, notes: "Initialize repository, setup build tools." },
                { title: `Create core components`, notes: "Build out the main UI elements needed." },
                { title: `Implement logic for '${goal}'`, notes: "Write the business logic and state management." },
                { title: `Write tests`, notes: "Ensure everything works as expected with unit and integration tests." },
            ]);
        }, 1500);
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the following goal, generate 3 to 5 actionable to-do list tasks. For each task, provide a concise title and a brief one-sentence note describing it. Goal: "${goal}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              description: "List of generated tasks.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: 'The concise title of the task.',
                  },
                  notes: {
                    type: Type.STRING,
                    description: 'A brief, one-sentence description of the task.',
                  },
                },
                required: ["title", "notes"]
              },
            },
          },
          required: ["tasks"]
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (result && result.tasks && Array.isArray(result.tasks)) {
      return result.tasks;
    } else {
      console.error("AI response format is incorrect:", result);
      return [];
    }
  } catch (error) {
    console.error("Error generating tasks from AI:", error);
    throw new Error("Failed to generate tasks. Please check your API key and try again.");
  }
}
