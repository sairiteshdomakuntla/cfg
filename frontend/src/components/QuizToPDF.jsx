import React, { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsPDF } from "jspdf";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";

/* ---- Gemini prompt ---- */
const prompt = /* md */ `
You are a current‑affairs quiz generator.

1. Search the web for major India news from the last 7 days (include cricket).
2. Write exactly 5 multiple‑choice questions.
   • Four options each, label them A) B) C) D).
   • Provide the correct option *label* (e.g., "B)").
3. Respond with **pure JSON ONLY**, no Markdown fences, in this form:

[
  {
    "question": "...",
    "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "answer": "B)"
  }
]
`;

export default function QuiztoPdf() {
  const [quiz, setQuiz]       = useState([]);
  const [status, setStatus]   = useState("Fetching quiz from Gemini…");
  const [loading, setLoading] = useState(false);

  /* fetch quiz once */
  useEffect(() => {
    (async () => {
      try {
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const res   = await model.generateContent(prompt);
        const text  = res.response.candidates[0].content.parts[0].text;
        const json  = JSON.parse(text.replace(/```json|```/g, "").trim());
        setQuiz(json);
        setStatus("");
      } catch (err) {
        console.error(err);
        setStatus("❌ " + err.message);
      }
    })();
  }, []);

  /* build PDF without bold answers */
  const downloadPDF = () => {
    setLoading(true);
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    /* title */
    doc.setFont("helvetica", "bold").setFontSize(20);
    doc.text("Current Affairs Quiz", 297.5, 60, { align: "center" });
    doc.setLineWidth(0.5).line(72, 70, 523, 70);

    /* questions */
    let y = 100;
    quiz.forEach((q, idx) => {
      if (y > 760) {
        doc.addPage();
        y = 60;
      }
      doc.setFontSize(12).setFont("helvetica", "bold");
      doc.text(`${idx + 1}. ${q.question}`, 72, y);
      y += 18;

      doc.setFont("helvetica", "normal"); // ⬅️ always normal now
      q.options.forEach((opt) => {
        doc.text(opt, 90, y);
        y += 16;
      });

      y += 4;
      doc.setDrawColor(204).line(72, y, 523, y);
      y += 16;
    });

    /* footer */
    const pages = doc.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setFontSize(8).setFont("helvetica", "normal");
      doc.text(`Page ${i} of ${pages}`, 523, 820, { align: "right" });
    }

    doc.save("current-affairs-quiz.pdf");
    setLoading(false);
  };

  /* UI */
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500/30 via-cyan-400/20 to-indigo-400/10 flex items-center justify-center p-6">
      <div className="backdrop-blur-md bg-white/70 border border-white/30 rounded-3xl shadow-2xl p-10 w-full max-w-2xl">
        <h1 className="text-3xl font-extrabold text-center text-teal-700 drop-shadow-sm">
          Current Affairs Quiz
        </h1>

        {status && (
          <p className="mt-4 text-center text-sm text-gray-600">{status}</p>
        )}

        {!status && (
          <>
            <p className="mt-2 text-center text-sm text-gray-600">
              {quiz.length} questions
            </p>

            <ol className="mt-6 space-y-4 text-sm text-gray-700 max-h-64 overflow-y-auto pr-2">
              {quiz.map((q, i) => (
                <li key={i} className="border-l-4 border-teal-600 pl-3">
                  <span className="font-semibold">{i + 1}.</span>{" "}
                  {q.question}
                </li>
              ))}
            </ol>

            <button
              onClick={downloadPDF}
              disabled={loading}
              className="mt-8 w-full flex items-center justify-center gap-2 bg-teal-600 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-teal-700 active:scale-95 transition-all duration-150 disabled:opacity-60"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              {loading ? "Generating…" : "Download PDF"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
