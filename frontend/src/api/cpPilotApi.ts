type PilotRole = 'user' | 'assistant';

export interface PilotMessage {
  role: PilotRole;
  content: string;
}

const FALLBACK_RESPONSE = 'CP-Pilot is ready, but no API key is configured yet. Add VITE_GEMINI_API_KEY in your frontend env to enable live AI answers.';

function getFallbackReply(question: string): string {
  const lower = question.toLowerCase();

  if (lower.includes('eduscope') || lower.includes('lecture capture')) {
    return 'You can access SLIIT EduScope here: https://lecturecapture.sliit.lk';
  }

  if (lower.includes('virtual lab') || lower.includes('courseweb')) {
    return 'You can access the SLIIT Virtual Lab here: https://courseweb.sliit.lk/course/view.php?id=1204';
  }

  if (lower.includes('catalogue') || lower.includes('resource')) {
    return 'Use the Catalogue tab to search resources by name, location, type, and minimum capacity.';
  }

  if (lower.includes('admin')) {
    return 'Use the Admin tab to add, edit, and remove resources. You can also manage status and metadata there.';
  }

  return FALLBACK_RESPONSE;
}

export async function askCPPilot(question: string, messages: PilotMessage[]): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  if (!apiKey) {
    return getFallbackReply(question);
  }

  try {
    const contextText = messages
      .slice(-6)
      .map((msg) => `${msg.role === 'assistant' ? 'Assistant' : 'User'}: ${msg.content}`)
      .join('\n');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: [
                    'You are CP-Pilot for SLIIT Smart Campus Operations Hub.',
                    'Give concise, practical, friendly answers about campus resources, catalogue, admin workflows, EduScope, and Virtual Lab.',
                    contextText ? `Conversation so far:\n${contextText}` : '',
                    `Current user question: ${question}`,
                  ]
                    .filter(Boolean)
                    .join('\n\n'),
                },
              ],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      return getFallbackReply(question);
    }

    const payload = await response.json();
    const content = payload?.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined;

    return content?.trim() || getFallbackReply(question);
  } catch {
    return getFallbackReply(question);
  }
}