import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { autocompletion } from "@codemirror/autocomplete";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { xml } from "@codemirror/lang-xml";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { php } from "@codemirror/lang-php";
import { rust } from "@codemirror/lang-rust";
import { sql } from "@codemirror/lang-sql";
import { go } from "@codemirror/lang-go";
import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Editor = () => {
  const { codeId } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [readOnly, setReadOnly] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const editorRef = useRef(null);
  const viewRef = useRef(null);
  const maxCharLimit = 500000;

  const languageExtensions = {
    javascript: javascript(),
    python: python(),
    java: java(),
    cpp: cpp(),
    css: css(),
    html: html(),
    xml: xml(),
    json: json(),
    markdown: markdown(),
    php: php(),
    rust: rust(),
    sql: sql(),
    go: go(),
  };

  useEffect(() => {
    if (!editorRef.current || loading) return;

    // Destroy previous instance if exists
    if (viewRef.current) {
      viewRef.current.destroy();
    }

    const state = EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        languageExtensions[language] || javascript(),
        autocompletion(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newCode = update.state.doc.toString();
            setCode(newCode);
            setCharCount(newCode.length);
          }
        }),
        readOnly ? EditorView.editable.of(false) : EditorView.editable.of(true),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => view.destroy();
  }, [language, readOnly, loading]); 

  useEffect(() => {
    const fetchCode = async () => {
      try {
        const res = await axios.get(`https://coded-pad-production.up.railway.app/api/code/${encodeURIComponent(codeId)}`);
        setCode(res.data.code || "");
        setCharCount(res.data.code ? res.data.code.length : 0);
      } catch (err) {
        console.error("Error fetching code:", err.response?.data || err.message);
        setError("Failed to load code. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCode();
  }, [codeId]);

  const handleSave = async () => {
    try {
      const res = await axios.put(`https://coded-pad-production.up.railway.app/api/code/${encodeURIComponent(codeId)}`, { code });
      setCode(res.data.existingCode.code);
      setCharCount(res.data.existingCode.code.length);
      alert("Code saved successfully");
      setReadOnly(true);
    } catch (error) {
      console.error("Error saving code:", error.response?.data || error.message);
      alert("Failed to save code. Please try again.");
    }
  };

  const handleSaveAndClose = async () => {
    try {
      await handleSave();
      navigate("/");
    } catch (error) {
      console.error("Error while saving and closing:", error.response?.data || error.message);
      alert("Failed to save and close. Please try again.");
    }
  };

  const handleRefresh = () => {
    setCode("");
    setCharCount(0);
  };

  const handleClose = () => {
    navigate("/");
  };

  if (loading) return <p className="text-center mt-20 text-white">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 md:p-6">
      <div className="flex flex-wrap gap-2 justify-center mb-4 w-full max-w-lg md:max-w-none">
        <button onClick={() => setReadOnly(false)} className={`px-4 py-2 rounded-lg ${!readOnly ? "bg-blue-600" : "bg-gray-700"}`}>
          Edit Mode
        </button>
        <button onClick={() => setReadOnly(true)} className={`px-4 py-2 rounded-lg ${readOnly ? "bg-blue-600" : "bg-gray-700"}`}>
          Read-Only Mode
        </button>
        <select
          className="px-4 py-2 bg-gray-700 text-white rounded-lg"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {Object.keys(languageExtensions).map((lang) => (
            <option key={lang} value={lang}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full max-w-4xl bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg shadow-lg">
        <div
          ref={editorRef}
          className="w-full min-h-[300px] sm:min-h-[400px] h-[500px] overflow-auto p-4 rounded-lg border border-gray-600 bg-gray-700 text-white"
        ></div>
      </div>

      <div className="mt-4 w-full max-w-4xl bg-blue-700 p-3 flex flex-wrap justify-between items-center rounded-lg gap-2">
        <div className="flex flex-wrap gap-2">
          <button onClick={handleSaveAndClose} className="px-4 py-2 bg-gray-300 text-black rounded">Save & Close</button>
          {!readOnly && <button onClick={handleSave} className="px-4 py-2 bg-gray-300 text-black rounded">Save</button>}
          <button onClick={handleRefresh} className="px-4 py-2 bg-gray-300 text-black rounded">Refresh</button>
          <button onClick={handleClose} className="px-4 py-2 bg-gray-300 text-black rounded">Close</button>
        </div>
        <span className="text-white text-center text-sm md:text-base">Char count {charCount} / {maxCharLimit}</span>
      </div>
    </div>
  );
};

export default Editor;
