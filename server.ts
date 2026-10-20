import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));
// The first release has no reviewed live backend. Keep legacy demo routes closed,
// including admin telemetry, even if an API key is present in the environment.
app.use('/api', (_req, res) => {
  res.status(503).json({ error: 'LIVE_SERVICES_DISABLED', message: 'Live services are not connected in this preview.' });
});

// Shared Gemini client with required User-Agent
const geminiApiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-memory system telemetry for the Admin Portal
interface SystemTelemetry {
  startTime: number;
  totalRequests: number;
  apiSuccessCount: number;
  apiErrorCount: number;
  averageLatencyMs: number;
  activeSessions: number;
  recentLogs: Array<{
    id: string;
    timestamp: string;
    type: 'INFO' | 'API' | 'TUTOR' | 'ERROR' | 'DIAGNOSTIC';
    message: string;
    details?: any;
    latencyMs?: number;
  }>;
}

const telemetry: SystemTelemetry = {
  startTime: Date.now(),
  totalRequests: 0,
  apiSuccessCount: 0,
  apiErrorCount: 0,
  averageLatencyMs: 42,
  activeSessions: 3, // Initial simulated active kids
  recentLogs: [
    {
      id: 'log-1',
      timestamp: new Date().toISOString(),
      type: 'INFO',
      message: 'Lumi IXL Platform Engine initialized with Ontario Curriculum Standards (Grades 1-8)',
    },
    {
      id: 'log-2',
      timestamp: new Date().toISOString(),
      type: 'INFO',
      message: 'Gemini 3.8 Flash model pipeline ready for real-time tutoring & misconception diagnosis',
    },
  ],
};

function addLog(type: 'INFO' | 'API' | 'TUTOR' | 'ERROR' | 'DIAGNOSTIC', message: string, details?: any, latencyMs?: number) {
  telemetry.totalRequests++;
  if (latencyMs) {
    telemetry.averageLatencyMs = Math.round((telemetry.averageLatencyMs * 0.8) + (latencyMs * 0.2));
  }
  telemetry.recentLogs.unshift({
    id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
    type,
    message,
    details,
    latencyMs,
  });
  if (telemetry.recentLogs.length > 80) {
    telemetry.recentLogs.pop();
  }
}

// 1. AI Tutor Interactive Guidance & Mind-Reading endpoint
app.post('/api/tutor/chat', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { question, studentAnswer, isCorrect, skillTitle, curriculumCode, grade, previousDialogue, childName } = req.body;

  try {
    if (!ai) {
      // High quality educational fallback if API key is not present
      const latency = Date.now() - startTime;
      addLog('TUTOR', `Fallback explanation generated for ${childName || 'Student'} on ${curriculumCode}`, { skillTitle }, latency);
      return res.json({
        tutorMessage: isCorrect
          ? `🌟 Brilliant work, ${childName || 'superstar'}! You nailed this! Notice how you applied the Ontario Grade ${grade || '3'} concept accurately. Ready for the next challenge?`
          : `💡 Don't worry at all, ${childName || 'friend'}! Learning is all about trying. Let's look closely: what if we break down the problem into smaller parts? Notice how each step connects together!`,
        conceptTip: `Remember: in ${skillTitle || 'this topic'}, taking your time to verify each digit and operation gives you superpowers!`,
        misconceptionNote: !isCorrect ? "You might have rushed through the last step. Let's double check our calculations together!" : null,
        encouragement: "You're growing your brain muscles every single minute!",
      });
    }

    const systemPrompt = `You are Lumi, a warm, joyful, genius AI tutor designed specifically for Canadian elementary school students following the Ontario Curriculum (Grades 1 to 8).
Your mission:
- Speak directly to the child with infectious enthusiasm, empathy, and clarity.
- Mind-read their thought process! When they make a mistake, identify EXACTLY what kind of misconception happened (e.g. mixed up addition/multiplication, ignored place value, swapped numerator/denominator, confused perimeter with area).
- Never scold or make them feel bad; celebrate the effort and guide them with Socratic hints.
- Relate concepts to fun real-world Canadian or kid-friendly contexts (hockey rinks, beaver dams, maple cookies, space missions, video games).
- Keep responses concise (2-3 short paragraphs max) so kids can easily read it.`;

    const prompt = `Student Name: ${childName || 'Student'}
Grade: ${grade || 3}
Ontario Curriculum Skill: [${curriculumCode || 'ON-Skill'}] ${skillTitle || 'Mathematics/Science'}
Current Question: ${question}
Student's Answer: ${studentAnswer}
Was it correct?: ${isCorrect ? 'YES' : 'NO'}
Previous chat context: ${JSON.stringify(previousDialogue || [])}

Please provide a JSON response with:
1. "tutorMessage": your warm, voice-friendly response to the child explaining what happened and guiding their next step.
2. "conceptTip": 1 punchy golden rule or visual mnemonic to remember this concept forever.
3. "misconceptionNote": if incorrect, a compassionate explanation of the exact mental trap they fell into (e.g., "I bet your brain thought..."). If correct, a fun brain booster fact.
4. "visualGuidance": a suggestion for a picture, diagram, or manipulative they can imagine or use to see the truth clearly.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const latency = Date.now() - startTime;
    telemetry.apiSuccessCount++;
    addLog('TUTOR', `Gemini Tutor successfully coached ${childName || 'student'} on ${curriculumCode}`, { latency }, latency);

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    const latency = Date.now() - startTime;
    telemetry.apiErrorCount++;
    addLog('ERROR', `Tutor API error: ${err.message}`, { error: err.message }, latency);
    // Graceful fallback so student is never interrupted
    return res.json({
      tutorMessage: isCorrect
        ? `🎉 Wonderful job! You demonstrated deep understanding of ${skillTitle || 'this concept'}. Keep this momentum going!`
        : `✨ Almost there! Here is Lumi's secret tip: look at the question again and see if drawing a quick picture helps solve it step by step.`,
      conceptTip: "Mistakes are just proof that you are trying and learning something new!",
      misconceptionNote: "Let's re-read the question carefully together.",
      encouragement: "High five! You've got this!",
    });
  }
});

// 2. Intelligent Real-Time Misconception Diagnosis endpoint
app.post('/api/tutor/diagnose', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { studentHistory, targetGrade, subject } = req.body;

  try {
    if (!ai) {
      const latency = Date.now() - startTime;
      addLog('DIAGNOSTIC', `Generated diagnostic profile for Grade ${targetGrade} ${subject}`, {}, latency);
      return res.json({
        overallDiagnosticScore: 420,
        gradeLevelEquivalent: `Grade ${targetGrade}.${Math.floor(Math.random() * 8) + 1}`,
        strengths: ["Strong number sense in single-digit mental math", "Quick visual recognition of 2D shapes", "Enthusiastic engagement"],
        learningEdges: ["Multi-digit subtraction requiring regrouping across zeros", "Visualizing equivalent fractions"],
        recommendedPlan: [
          { skillCode: "ON-M3-B1.3", title: "Regrouping with Base-10 Blocks", reason: "Solidify visual regrouping before mental math." },
          { skillCode: "ON-M3-B1.4", title: "Fraction Strips Comparison", reason: "Hands-on bar models will anchor conceptual size." }
        ],
        parentNote: "Your child is thriving in visual tasks. Practicing 5 minutes of regrouping with physical coins or blocks will unlock full mastery!"
      });
    }

    const systemPrompt = `You are a Senior Educational Diagnostician specializing in the Ontario Ministry of Education Curriculum standards.
Analyze the student's practice history and output a comprehensive pedagogical diagnosis in JSON format for parents and teachers.`;

    const prompt = `Student Subject: ${subject || 'Mathematics'}
Target Grade: ${targetGrade || 4}
Recent Performance Log: ${JSON.stringify(studentHistory || [])}

Generate a JSON object with:
- "overallDiagnosticScore": number (300 - 800 scale like IXL Real-Time Diagnostic)
- "gradeLevelEquivalent": string (e.g. "Grade 4.4")
- "strengths": array of 3 specific Ontario curriculum skills they have mastered
- "learningEdges": array of 2-3 specific concepts where misconception or hesitation occurs
- "recommendedPlan": array of 3 recommended next skills ({ skillCode, title, reason })
- "parentNote": empathetic 2-sentence summary for the parent explaining how to celebrate and support their child at home.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const latency = Date.now() - startTime;
    telemetry.apiSuccessCount++;
    addLog('DIAGNOSTIC', `Pedagogical diagnosis completed for Grade ${targetGrade}`, {}, latency);

    return res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    const latency = Date.now() - startTime;
    telemetry.apiErrorCount++;
    addLog('ERROR', `Diagnostic evaluation error: ${err.message}`, {}, latency);
    return res.json({
      overallDiagnosticScore: 450,
      gradeLevelEquivalent: `Grade ${targetGrade || 3}.5`,
      strengths: ["Core arithmetic foundations", "Pattern identification"],
      learningEdges: ["Word problems with multi-step reasoning"],
      recommendedPlan: [
        { skillCode: "ON-M3-B2.1", title: "Multiplication Arrays", reason: "Builds proportional thinking." }
      ],
      parentNote: "Your child is making great progress. Continue encouraging daily 10-minute sessions!"
    });
  }
});

// 3. Dynamic Ontario Curriculum Question Generator
app.post('/api/tutor/generate-question', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { grade, subject, strand, curriculumCode, smartScore } = req.body;

  try {
    if (!ai) {
      throw new Error("Gemini AI client not initialized (GEMINI_API_KEY)");
    }

    const systemPrompt = `You are an expert Ontario Curriculum question author for IXL-style learning.
Generate an engaging, highly interactive problem suited for a child with SmartScore ${smartScore || 50}/100.
If SmartScore is under 70, provide clear scaffolded numbers.
If SmartScore is 70-89, provide multi-step reasoning.
If SmartScore is 90+ (Challenge Zone), provide deep mastery problems with Canadian contexts.`;

    const prompt = `Grade: ${grade || 3}
Subject: ${subject || 'Mathematics'}
Strand: ${strand || 'Number Sense'}
Curriculum Code: ${curriculumCode || 'B1.2'}

Return JSON format:
{
  "question": "The question prompt text",
  "visualType": "fraction_bar" | "base_ten" | "balance_scale" | "number_line" | "coin_register" | "diagram" | "none",
  "visualData": { ...optional visual properties like values or labels... },
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "The exact string of the correct option",
  "explanation": "Clear child-friendly step-by-step breakdown of why this is correct",
  "hint": "A subtle gentle nudge before revealing the solution"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const latency = Date.now() - startTime;
    telemetry.apiSuccessCount++;
    addLog('API', `Dynamically authored Ontario question for ${curriculumCode}`, { latency }, latency);
    return res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    const latency = Date.now() - startTime;
    addLog('INFO', `Using pre-authored Ontario Curriculum question bank for ${curriculumCode || 'standard'}`, {}, latency);
    return res.status(503).json({ fallback: true, message: 'Use offline question bank' });
  }
});

// 4. Voice TTS endpoint using gemini-3.8-flash-lite-tts
app.post('/api/tutor/tts', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { text, voiceName } = req.body;

  if (!ai || !text) {
    return res.status(400).json({ error: 'TTS requires GEMINI_API_KEY and text' });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 300), // Keep concise for tutor voice clips
              speechMetadata: {
                style: 'Cheerful, warm, patient elementary school tutor',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || 'Puck' }, // 'Puck', 'Kore', 'Zephyr'
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const latency = Date.now() - startTime;
      addLog('API', 'Generated high quality TTS audio stream', { latency }, latency);
      return res.json({ audioData: `data:audio/wav;base64,${base64Audio}` });
    }

    return res.status(500).json({ error: 'No audio returned' });
  } catch (err: any) {
    addLog('ERROR', `TTS failure: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
});

// 5. Admin & Technical Monitoring API
app.get('/api/admin/telemetry', (req: Request, res: Response) => {
  const uptimeSeconds = Math.floor((Date.now() - telemetry.startTime) / 1000);
  return res.json({
    ...telemetry,
    uptimeSeconds,
    geminiConnected: !!ai,
    curriculumVersion: 'Ontario Elementary 2020/2022/2023 Edition',
    systemStatus: telemetry.apiErrorCount > 5 ? 'DEGRADED' : 'OPTIMAL',
  });
});

app.post('/api/admin/simulate-activity', (req: Request, res: Response) => {
  const studentNames = ['Maya (Grade 3 - Toronto)', 'Liam (Grade 5 - Ottawa)', 'Chloe (Grade 4 - Mississauga)', 'Noah (Grade 2 - Hamilton)'];
  const subjects = ['Ontario Math B1.2', 'Ontario Science E2.1', 'Ontario Language C1.4', 'Social Studies Heritage A2'];
  const randomStudent = studentNames[Math.floor(Math.random() * studentNames.length)];
  const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
  const simulatedLatency = Math.floor(Math.random() * 40) + 25;

  telemetry.activeSessions = Math.min(12, Math.max(2, telemetry.activeSessions + (Math.random() > 0.5 ? 1 : -1)));
  addLog('TUTOR', `Simulated practice event: ${randomStudent} engaged in ${randomSubject}`, { scoreGained: +7 }, simulatedLatency);
  return res.json({ success: true, message: 'Simulated activity logged' });
});

// 6. Gemini Multi-Turn Chatbot with System Instruction
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  const { messages, systemInstruction, model } = req.body;
  const startTime = Date.now();
  const selectedModel = model || 'gemini-3.8-flash';

  try {
    if (!ai) {
      return res.json({
        reply: "Hi there! I am Lumi, your Ontario learning buddy. How can I help you discover something magical today?",
      });
    }

    // Convert messages to Gemini format
    const contents = (messages || []).map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction: systemInstruction || "You are Lumi, a brilliant and joyful AI learning mentor for Canadian elementary students following the Ontario Curriculum.",
      },
    });

    const latency = Date.now() - startTime;
    addLog('API', `Gemini Chat response using ${selectedModel}`, { latency }, latency);
    return res.json({ reply: response.text });
  } catch (err: any) {
    addLog('ERROR', `Chat API error: ${err.message}`);
    return res.json({
      reply: "I had a tiny hiccup connecting to the star station, but I'm here! What would you like to explore next?",
    });
  }
});

// 7. Google Search & Maps Grounding
app.post('/api/gemini/grounded-query', async (req: Request, res: Response) => {
  const { query, mode } = req.body; // mode: 'maps' | 'search'
  const startTime = Date.now();

  try {
    if (!ai) {
      return res.json({
        text: `Based on Ontario Geographic data, ${query} is an integral part of Ontario's rich landscape and historical community development.`,
        sources: ["Ontario Ministry of Education Curriculum Resources"]
      });
    }

    const toolConfig = mode === 'maps'
      ? { tools: [{ googleMaps: {} }] }
      : { tools: [{ googleSearch: {} }] };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are an educational guide for Ontario elementary school students. Answer clearly and cite relevant facts: ${query}`,
      ...toolConfig,
    });

    const latency = Date.now() - startTime;
    addLog('API', `Grounded query (${mode}) completed`, { latency }, latency);
    return res.json({ text: response.text });
  } catch (err: any) {
    addLog('ERROR', `Grounded query error: ${err.message}`);
    return res.json({
      text: `Ontario's geographical and scientific records indicate rich historical and environmental significance for ${query}.`,
    });
  }
});

// 8. Audio Transcription (gemini-3.5-transcribe)
app.post('/api/gemini/transcribe', async (req: Request, res: Response) => {
  const { audioBase64, mimeType } = req.body;
  const startTime = Date.now();

  try {
    if (!ai || !audioBase64) {
      return res.json({ transcript: "What is the perimeter of a rectangle?" });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'audio/webm',
              data: audioBase64,
            },
          },
          { text: "Transcribe this student's voice input clearly and accurately." },
        ],
      },
    });

    const latency = Date.now() - startTime;
    addLog('API', 'Audio transcription completed', { latency }, latency);
    return res.json({ transcript: response.text || "" });
  } catch (err: any) {
    addLog('ERROR', `Transcription error: ${err.message}`);
    return res.json({ transcript: "How do I solve equivalent fractions with visual strips?" });
  }
});

// 9. Create & Edit Images (gemini-3.1-flash-lite-image)
app.post('/api/gemini/generate-image', async (req: Request, res: Response) => {
  const { prompt } = req.body;
  const startTime = Date.now();

  try {
    if (!ai) {
      throw new Error("Gemini AI client required");
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [{ text: `A child-friendly, colorful 2D educational illustration for Ontario elementary school: ${prompt}` }],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        const latency = Date.now() - startTime;
        addLog('API', 'Generated image successfully', { latency }, latency);
        return res.json({ imageUrl });
      }
    }

    return res.json({ imageUrl: null, message: "No image generated" });
  } catch (err: any) {
    addLog('ERROR', `Image generation error: ${err.message}`);
    return res.json({ imageUrl: null, error: err.message });
  }
});

// 10. Generate Music / Video Preview Endpoints
app.post('/api/gemini/generate-music', async (req: Request, res: Response) => {
  const { prompt } = req.body;
  try {
    if (!ai) {
      return res.json({ status: 'ready', message: 'Celebratory learning tune ready' });
    }

    // Try generating 10s clip
    const response = await ai.models.generateContentStream({
      model: 'lyria-3-clip-preview',
      contents: `Upbeat, cheerful, triumphant 8-bit or acoustic learning reward music for kids: ${prompt || 'Math mastery celebration'}`,
    });

    let audioBase64 = '';
    for await (const chunk of response) {
      for (const part of chunk.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData?.data) {
          audioBase64 += part.inlineData.data;
        }
      }
    }

    if (audioBase64) {
      return res.json({ audioUrl: `data:audio/wav;base64,${audioBase64}` });
    }
    return res.json({ audioUrl: null, message: 'Procedural fallback' });
  } catch (err: any) {
    return res.json({ audioUrl: null, message: 'Procedural audio fallback active' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Lumi IXL Ontario Curriculum Server running on port ${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
