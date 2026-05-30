# Integration Guide: Puter.js for Client-Side AI Communication

This guide explains how **Puter.js** is configured and utilized in this project for client-side AI communication (including text chat, vision analysis, and customized assistants). You can use these patterns to easily integrate Puter AI into your other projects without managing complex server-side environments or API keys.

---

## 1. What is Puter.js?
[Puter.js](https://js.puter.com/) is a client-side JavaScript SDK developed by Puter. It allows frontend applications to access backend services—such as Cloud Storage, Key-Value databases, Hosting, and **Artificial Intelligence models (LLMs/Vision)**—directly from the browser. It eliminates the need for a dedicated backend, middleware, or client-side exposure of private API keys.

---

## 2. Importing Puter.js

### A. Vanilla HTML/JavaScript Setup
In a static HTML webpage (like `legacy/chaty.html`), import the Puter.js CDN script within the `<head>` block:

```html
<!-- Load Puter.js SDK -->
<script src="https://js.puter.com/v2/"></script>
```

Once loaded, the library exposes a global `puter` object directly on the `window` namespace.

---

### B. React & TypeScript Setup
In a modern project built with React/Vite/Next.js (like `src/pages/Chat.tsx`), add the script tag to your main `index.html`:

```html
<!-- index.html -->
<script src="https://js.puter.com/v2/"></script>
```

#### TypeScript Global Declaration
To prevent compiler warnings when accessing `window.puter`, declare `puter` on the global `Window` interface. You can place this in a declaration file (e.g., `src/global.d.ts` or directly within the component/wrapper file):

```typescript
declare global {
  interface Window {
    puter: any;
  }
}
```

---

## 3. Core Text Generation API (`puter.ai.chat`)

To communicate with text models, use the `puter.ai.chat` function. It supports single prompts as well as multi-turn conversational contexts.

### API Signature
```javascript
puter.ai.chat(messages, options)
```

### Parameters
1. **`messages`**: An array of message objects containing `role` and `content`.
   - `role`: `'system'` (instructions/persona), `'user'` (user input), or `'assistant'` (previous AI responses).
   - `content`: The text content of the message.
   - *Alternative:* You can pass a plain string (e.g., `"Explain photosynthesis in one sentence"`) instead of an array.
2. **`options`** (Optional configuration object):
   - `model`: The LLM model to query. The standard lightweight model used in this codebase is `'gpt-4o-mini'`.
   - `temperature`: A decimal value between `0` and `1` (e.g., `0.7`). Higher values make the output more creative; lower values make it more focused and deterministic.
   - `max_tokens`: The maximum length of the generated response (e.g., `500`).

---

### Implementation Examples

#### Vanilla JavaScript Implementation
Here is how text chat is invoked in `legacy/chaty.html`:

```javascript
async function getAIResponse(userQuery) {
    const messages = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: userQuery }
    ];

    try {
        // Call Puter AI
        const response = await puter.ai.chat(messages, { 
            model: 'gpt-4o-mini', 
            temperature: 0.7, 
            max_tokens: 500 
        });

        // Safely extract text content
        let responseText = '';
        if (typeof response === 'string') responseText = response;
        else if (response?.message?.content) responseText = response.message.content;
        else if (response?.content) responseText = response.content;
        else if (response?.choices?.[0]?.message?.content) responseText = response.choices[0].message.content;
        else responseText = String(response);

        return responseText.trim();
    } catch (error) {
        console.error('Puter AI Error:', error);
        throw error;
    }
}
```

#### React & TypeScript Encapsulated Service
In this codebase, a shared utility function (`src/utils/puterAiService.ts`) is used to wrap and normalize Puter calls:

```typescript
// src/utils/puterAiService.ts

export interface PuterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const callPuterAI = async (
  messages: PuterMessage[],
  model: string = 'gpt-4o-mini'
): Promise<string | null> => {
  // Safety check for browser runtime environment & script load status
  if (typeof window === 'undefined' || !window.puter) {
    console.warn("Puter AI is not available on the window object.");
    return null;
  }

  try {
    const response = await window.puter.ai.chat(messages, { model });
    return response?.message?.content || response?.content || null;
  } catch (error) {
    console.error("Failed to generate response from Puter AI:", error);
    return null;
  }
};
```

---

## 4. Vision AI (Multimodal Image Analysis)

Puter.js supports visual inputs, allowing you to upload images and ask questions about them.

### How Vision Works:
1. Load the user's image files locally as base64 Data URLs using the browser's `FileReader` API.
2. Pass the base64 string inside the `images` option array during the `puter.ai.chat` call.

### Vision Code Example (`PhotoView.tsx`)
```typescript
const handleAnalyzeImage = async (photoBase64String: string) => {
  if (!window.puter) return;

  const promptMessages = [
    { role: 'system', content: 'You are an expert safety inspector. Inspect the photo.' },
    { role: 'user', content: 'Inspect the uploaded room and list any physical safety hazards.' }
  ];

  try {
    const response = await window.puter.ai.chat(promptMessages, {
      model: 'gpt-4o-mini',
      images: [photoBase64String] // Send the base64 image data URL here
    });

    const resultText = response?.message?.content || response?.content;
    console.log("Analysis Result:", resultText);
  } catch (error) {
    console.error("Vision AI Analysis failed:", error);
  }
};
```

---

## 5. UI Best Practice: Simulated Streaming Response

Because Puter's client-side SDK returns a standard Promise that resolves once the entire generation completes, you can simulate a word-by-word streaming effect in React to enhance user experience (as done in `AIChatView.tsx`):

```typescript
const [streamingText, setStreamingText] = useState('');

const streamResponse = async (fullText: string) => {
  const words = fullText.split(' ');
  let currentText = '';
  
  for (let i = 0; i < words.length; i++) {
    currentText += (i === 0 ? '' : ' ') + words[i];
    setStreamingText(currentText);
    
    // Custom delay (20ms to 50ms) to look natural
    await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 30));
  }
  
  return currentText;
};
```

---

## Summary Checklist for Other Projects

To use Puter.js in another project:
1. Include `<script src="https://js.puter.com/v2/"></script>` in your main HTML file.
2. Access Puter AI calls via `window.puter.ai.chat(...)` (checking if `window.puter` is defined first).
3. Extract generated text safely via `response?.message?.content || response?.content`.
4. For Vision, read target image files as base64 Data URLs and pass them inside the `images: [base64_data]` array option.
