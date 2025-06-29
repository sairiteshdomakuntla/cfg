import React, { useEffect, useState } from "react";

/* helper to build a blank form row */
const blankEntry = (studentId = "") => ({
  studentId,                                  // <-- required by backend
  date: new Date().toISOString().slice(0, 10),
  parent: "",
  educator: "",
  improvement: "",
  conclusion: "",
});

export default function Conversations({ studentId: initialId = "" }) {
  /* core state */
  const [studentId, setStudentId]   = useState(initialId);
  const [entry, setEntry]           = useState(blankEntry(initialId));
  const [history, setHistory]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const [msg, setMsg]               = useState("");

  /* -------------------------------------------------- */
  /* load history whenever studentId changes            */
  /* -------------------------------------------------- */
  useEffect(() => {
    if (!studentId) return;
    const fetchHistory = async () => {
      try {
        const res = await fetch(`https://vision-global.onrender.com/api/conversations?studentId=${studentId}`, {
  credentials: 'include',
});
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, [studentId]);

  /* -------------------------------------------------- */
  /* handle all input changes                           */
  /* -------------------------------------------------- */
  const handle = (e) => {
    if (e.target.name === "studentId") {
      setStudentId(e.target.value.trim());
      setEntry(blankEntry(e.target.value.trim()));
    } else {
      setEntry({ ...entry, [e.target.name]: e.target.value });
    }
  };

  /* -------------------------------------------------- */
  /* submit new conversation                            */
  /* -------------------------------------------------- */
  const addEntry = async (e) => {
    e.preventDefault();
    if (!studentId) {
      setMsg("❌ Please enter a Student ID first");
      return;
    }
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("https://vision-global.onrender.com/api/conversations", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: 'include',
  body: JSON.stringify(entry),
});

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "❌ Failed to save");
      } else {
        setMsg("✅ Conversation saved");
        /* prepend new entry into history */
        setHistory([data, ...history]);
        setEntry(blankEntry(studentId));
      }
    } catch (err) {
      setMsg(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------- */
  /* render                                              */
  /* -------------------------------------------------- */
  return (
    <div className="min-h-screen bg-teal-50 flex flex-col items-center p-6">
      {/* ---------- FORM ---------- */}
      <form
        onSubmit={addEntry}
        className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-teal-700 text-center">
          Conversation Log
        </h2>

        {/* Student ID first */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-teal-700">Student&nbsp;ID</label>
          <input
            name="studentId"
            value={studentId}
            onChange={handle}
            placeholder="Enter studentId (unique string)"
            className="border border-teal-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>

        {/* date + improvement */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-teal-700">Date</label>
            <input
              type="date"
              name="date"
              value={entry.date}
              onChange={handle}
              className="border border-teal-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-teal-700">
              Scope of Improvement
            </label>
            <input
              type="text"
              name="improvement"
              value={entry.improvement}
              onChange={handle}
              placeholder="e.g., Reading comprehension"
              className="border border-teal-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
        </div>

        {/* parent/educator/conclusion */}
        {["parent", "educator", "conclusion"].map((field, i) => (
          <div key={field}>
            <label className="mb-1 font-medium text-teal-700 block">
              {field === "parent"
                ? "What the Parent Said"
                : field === "educator"
                ? "What the Educator Said"
                : "Conclusion"}
            </label>
            <textarea
              name={field}
              value={entry[field]}
              onChange={handle}
              rows={field === "conclusion" ? 2 : 3}
              className="w-full border border-teal-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required={field !== "conclusion"}
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 text-white font-semibold py-2 rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
        >
          {loading ? "Saving…" : "Add Conversation"}
        </button>

        {msg && (
          <p
            className={`text-center text-sm ${
              msg.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {msg}
          </p>
        )}
      </form>

      {/* ---------- HISTORY ---------- */}
      {history.length > 0 && (
        <div className="w-full max-w-3xl mt-10 space-y-6">
          <h3 className="text-xl font-semibold text-teal-700">
            Conversation History
          </h3>

          {history.map((c) => (
            <div
              key={c._id || c.id}
              className="bg-white border-l-4 border-teal-600 rounded-md shadow-sm p-6"
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm text-teal-600 font-semibold">
                  {new Date(c.date).toLocaleDateString()}
                </span>
                <span className="text-xs text-gray-400">
                  ID: {c._id || c.id}
                </span>
              </div>

              <div className="space-y-2">
                <p>
                  <span className="font-medium text-gray-700">
                    Parent&nbsp;Feedback:
                  </span>{" "}
                  {c.parent}
                </p>
                <p>
                  <span className="font-medium text-gray-700">
                    Educator&nbsp;Educator:
                  </span>{" "}
                  {c.educator}
                </p>
                <p>
                  <span className="font-medium text-gray-700">
                    Scope&nbsp;of&nbsp;improvement:
                  </span>{" "}
                  {c.improvement}
                </p>
                {c.conclusion && (
                  <p>
                    <span className="font-medium text-gray-700">
                      Conclusion:
                    </span>{" "}
                    {c.conclusion}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
