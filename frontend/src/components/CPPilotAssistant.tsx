import React, { useMemo, useState } from 'react';
import { Bot, Send, Sparkles, User } from 'lucide-react';
import { askCPPilot, type PilotMessage } from '../api/cpPilotApi';

const starterPrompts = [
  'How do I find available lecture halls quickly?',
  'Where can I open SLIIT EduScope?',
  'How can I use the Virtual Lab?',
];

export const CPPilotAssistant: React.FC = () => {
  const [messages, setMessages] = useState<PilotMessage[]>([
    {
      role: 'assistant',
      content:
        'Hi, I am CP-Pilot. Ask me about resources, catalogue filters, admin actions, EduScope, or the SLIIT Virtual Lab.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  const submitQuestion = async (question: string) => {
    const clean = question.trim();
    if (!clean) return;

    const nextMessages: PilotMessage[] = [...messages, { role: 'user', content: clean }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    const reply = await askCPPilot(clean, nextMessages);

    setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    setLoading(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await submitQuestion(input);
  };

  return (
    <section className="border border-border/70 bg-surface/80 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-8">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#F27D26]">AI assistant</p>
        <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">CP-Pilot</h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-secondary sm:text-base">
          Ask quick questions and get instant support for using SLIIT campus resource services.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {starterPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => submitQuestion(prompt)}
            className="border border-border/70 bg-background/70 px-4 py-3 text-left text-sm text-secondary transition hover:border-[#F27D26]/40 hover:text-primary"
          >
            <Sparkles className="mb-2 h-4 w-4 text-[#F27D26]" />
            {prompt}
          </button>
        ))}
      </div>

      <div className="mt-5 border border-border/70 bg-background/70 p-4">
        <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
          {messages.map((msg, idx) => (
            <div key={`${msg.role}-${idx}`} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center border border-border/70 bg-input/80 text-muted">
                {msg.role === 'assistant' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              <p className="text-sm leading-6 text-secondary">{msg.content}</p>
            </div>
          ))}
          {loading && <p className="text-sm text-secondary">CP-Pilot is thinking...</p>}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask CP-Pilot something..."
            className="flex-1 border border-border/70 bg-input/90 px-4 py-3 text-sm text-primary outline-none transition focus:border-[#F27D26]"
          />
          <button
            type="submit"
            disabled={!canSend}
            className="inline-flex items-center gap-2 bg-[#F27D26] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#ff9548] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  );
};