// // components/AIChatbot.jsx
// import { useState } from "react";
// import { askCRM } from "../api/aiApi";
// import AIAskBar from "./AIAskBar";
// import AIInsightCard from "./AIInsightCard";
// import { MessageCircle } from "lucide-react";

// export default function AIChatbot() {
//   const [open, setOpen] = useState(false);
//   const [answer, setAnswer] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleAsk = async (question) => {
//     if (loading) return;

//     try {
//       setLoading(true);
//       setAnswer("Analyzing your CRM data...");

//       const res = await askCRM(question);
//       setAnswer(res || "No insights available.");
//     } catch (e) {
//       setAnswer("AI service unavailable. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* Floating Chat Button */}
//       <button
//         onClick={() => setOpen(true)}
//         className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition"
//         title="Ask AI"
//       >
//         <MessageCircle className="w-6 h-6" />
//       </button>

//       {/* Chat Drawer */}
//       {open && (
//         <div className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[70vh] rounded-xl bg-white shadow-2xl border flex flex-col overflow-hidden">
//           {/* Header */}
//           <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
//             <h3 className="text-sm font-semibold">
//               Sales AI Assistant
//             </h3>
//             <button
//               onClick={() => setOpen(false)}
//               className="text-white/80 hover:text-white text-sm"
//             >
//               ✕
//             </button>
//           </div>

//           {/* Content */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             <AIInsightCard answer={answer} />
//           </div>

//           {/* Ask Bar */}
//           <div className="border-t p-3">
//             <AIAskBar onAsk={handleAsk} loading={loading} />
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// components/AIChatbot.jsx
import React, { useState, useRef, useEffect } from "react";
import { askCRM } from "../api/aiApi";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Bot,
  User,
  Sparkles,
} from "lucide-react";

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const panelRef = useRef(null);

  useEffect(() => {
    if (open) {
      const el = document.querySelector("#ai-input");
      if (el) el.focus();
    }
  }, [open]);

  const handleAsk = async (question) => {
    if (loading || !question || !question.trim()) return;

    setHistory((h) => [...h, { role: "user", text: question, ts: Date.now() }]);

    try {
      setLoading(true);
      setHistory((h) => [
        ...h,
        {
          role: "assistant",
          text: "Analyzing your CRM data...",
          loading: true,
          ts: Date.now(),
        },
      ]);
      setAnswer("Analyzing your CRM data...");

      const res = await askCRM(question);
      const final = res || "No insights available.";

      setHistory((h) => {
        const copy = [...h];
        for (let i = copy.length - 1; i >= 0; i--) {
          if (copy[i].role === "assistant" && copy[i].loading) {
            copy[i] = { role: "assistant", text: final, ts: Date.now() };
            break;
          }
        }
        return copy;
      });

      setAnswer(final);
    } catch (e) {
      setAnswer("AI service unavailable. Please try again.");
      setHistory((h) => {
        const copy = [...h];
        for (let i = copy.length - 1; i >= 0; i--) {
          if (copy[i].role === "assistant" && copy[i].loading) {
            copy[i] = {
              role: "assistant",
              text: "AI service unavailable. Please try again.",
              ts: Date.now(),
            };
            break;
          }
        }
        return copy;
      });
    } finally {
      setLoading(false);
      setTimeout(
        () =>
          panelRef.current?.scrollTo({
            top: panelRef.current.scrollHeight,
            behavior: "smooth",
          }),
        60,
      );
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open AI Assistant"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        title="Ask AI"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px]"
          aria-hidden
        />
      )}

      {/* Chat Panel */}
      <div
        className={`fixed z-50 right-4 bottom-4 max-h-[72vh] w-full
  sm:w-[360px] md:w-[400px] lg:w-[420px]
  transition-all duration-300 ${
    open
      ? "opacity-100 translate-y-0"
      : "opacity-0 translate-y-6 pointer-events-none"
  }`}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="mx-3 flex h-[72vh] flex-col overflow-hidden rounded-xl bg-white shadow-lg border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
              <Bot className="h-5 w-5 text-indigo-600" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Sales AI Assistant
              </h3>
              <p className="text-xs text-slate-500">
                Ask questions about deals, customers or pipeline
              </p>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => {
                  setHistory([]);
                  setAnswer("");
                }}
                className="hidden sm:inline-flex rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
              >
                Clear
              </button>

              <button
                onClick={() => setOpen(false)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conversation Area */}
          <div
            ref={panelRef}
            className="flex-1 overflow-y-auto bg-slate-50 p-3 space-y-3"
          >
            {history.length === 0 && (
              <div className="rounded-lg border border-dashed border-slate-200 bg-white p-4 text-center">
                <Sparkles className="mx-auto mb-3 h-6 w-6 text-amber-400" />
                <h4 className="text-sm font-semibold text-slate-900">
                  Ask things like
                </h4>
                <p className="mt-2 text-xs text-slate-500">
                  Operational insights • Strategic analytics • Pipeline health
                </p>

                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {/* Operational */}
                  <QuickHint
                    text="Deals closing this month"
                    onClick={() =>
                      handleAsk("Show me deals closing this month")
                    }
                  />
                  <QuickHint
                    text="High risk customers"
                    onClick={() => handleAsk("Which customers are high risk?")}
                  />
                  <QuickHint
                    text="Pipeline velocity"
                    onClick={() =>
                      handleAsk("What is our pipeline velocity last quarter?")
                    }
                  />

                  {/* 🔥 Advanced Analytics */}
                  <QuickHint
                    text="Current pipeline scenario"
                    onClick={() =>
                      handleAsk(
                        "What is the current scenario in advanced analytics?",
                      )
                    }
                  />
                  <QuickHint
                    text="Pipeline health"
                    onClick={() =>
                      handleAsk("Is our pipeline healthy right now?")
                    }
                  />
                  <QuickHint
                    text="Biggest risks"
                    onClick={() =>
                      handleAsk("What are the biggest risks in our pipeline?")
                    }
                  />
                  <QuickHint
                    text="Strategic recommendations"
                    onClick={() =>
                      handleAsk(
                        "Give me strategic recommendations for this month.",
                      )
                    }
                  />
                </div>
              </div>
            )}

            <ul className="flex flex-col gap-4">
              {history.map((m, idx) => (
                <li
                  key={m.ts + idx}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] flex items-start gap-3 ${
                      m.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div>
                      {m.role === "user" ? (
                        <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center">
                          <User className="h-4 w-4 text-slate-600" />
                        </div>
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-indigo-600" />
                        </div>
                      )}
                    </div>

                    <div
                      className={`relative rounded-xl px-3 py-2 text-[13px] leading-5 shadow-sm ${
                        m.role === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-white border border-slate-200 text-slate-800"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">
                        {
                          m.text
                            ?.replace(/\*\*/g, "") // remove bold **
                            .replace(/\\n/g, "\n") // fix escaped newlines
                        }
                      </div>

                      {m.loading && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Thinking...</span>
                        </div>
                      )}

                      <div className="mt-2 text-[10px] text-slate-400">
                        {new Date(m.ts).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Ask Bar */}
          <div className="border-t border-slate-200 px-3 py-2 bg-white">
            <AIAskBar onAsk={handleAsk} loading={loading} />
          </div>
        </div>
      </div>
    </>
  );
}

function QuickHint({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
    >
      {text}
    </button>
  );
}

function AIAskBar({ onAsk, loading }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    autoResize();
  }, [value]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  const submit = async () => {
    const question = value.trim();
    if (!question || loading) return;
    setValue("");
    await onAsk(question);
  };

  return (
    <div className="flex w-full items-end gap-3">
      <textarea
        id="ai-input"
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder="Ask about deals, pipeline, or customers..."
        className="min-h-[40px] max-h-[160px] w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <button
        onClick={submit}
        disabled={!value.trim() || loading}
        className="inline-flex h-9 items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">Send</span>
      </button>
    </div>
  );
}
