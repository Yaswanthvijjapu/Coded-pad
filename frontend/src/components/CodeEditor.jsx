import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CodeEditor = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const [view, setView] = useState("editing");
    const [text, setText] = useState("");
    const [charCount, setCharCount] = useState(0);
    const maxCharLimit = 500000;

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.altKey && event.key === "s") {
                event.preventDefault();
                handleSaveAndClose();
            } else if (event.ctrlKey && event.key === "s") {
                event.preventDefault();
                handleSave();
            } else if (event.altKey && event.key === "F5") {
                event.preventDefault();
                handleRefresh();
            } else if (event.key === "Escape") {
                event.preventDefault();
                handleClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleSaveAndClose = () => {
        console.log("Saved & Closed!");
        navigate("/");
    };

    const handleSave = () => {
        console.log("Saved!");
    };

    const handleRefresh = () => {
        setText("");
        setCharCount(0);
    };

    const handleClose = () => {
        navigate("/");
    };

    const handleTextChange = (e) => {
        const value = e.target.value;
        if (value.length <= maxCharLimit) {
            setText(value);
            setCharCount(value.length);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
            {/* Navigation Tabs */}
            <div className="flex space-x-4 mb-4">
                <button onClick={() => setView("editing")} className={`px-4 py-2 ${view === "editing" ? "bg-blue-600" : "bg-gray-700"} rounded-lg`}>
                    Editing View
                </button>
                <button onClick={() => setView("reading")} className={`px-4 py-2 ${view === "reading" ? "bg-blue-600" : "bg-gray-700"} rounded-lg`}>
                    Reading View
                </button>
                <button onClick={() => setView("settings")} className={`px-4 py-2 ${view === "settings" ? "bg-blue-600" : "bg-gray-700"} rounded-lg`}>
                    Settings
                </button>
            </div>

            {/* View Content */}
            <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg">
                {view === "editing" && (
                    <textarea 
                        className="w-full h-64 p-4 bg-gray-700 text-white rounded-lg"
                        value={text}
                        onChange={handleTextChange}
                    ></textarea>
                )}
                {view === "reading" && (
                    <p className="text-gray-300">{text || "Reading view for code: " + code}</p>
                )}
                {view === "settings" && (
                    <div className="text-gray-300">
                        <p><strong>Self Destruct:</strong> Off</p>
                        <p><strong>Pad Lock:</strong> Off</p>
                        <p><strong>Line Numbers:</strong> On</p>
                    </div>
                )}
            </div>

            {/* Save, Close, Refresh, and Character Count */}
            <div className="mt-4 w-full max-w-4xl bg-blue-700 p-3 flex justify-between items-center rounded-lg">
                <div className="flex space-x-2">
                    <button onClick={handleSaveAndClose} className="px-4 py-2 bg-gray-300 text-black rounded">Save & Close</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-gray-300 text-black rounded">Save</button>
                    <button onClick={handleRefresh} className="px-4 py-2 bg-gray-300 text-black rounded">Refresh</button>
                    <button onClick={handleClose} className="px-4 py-2 bg-gray-300 text-black rounded">Close</button>
                </div>
                <span className="text-white">Char count {charCount.toLocaleString()} / {maxCharLimit.toLocaleString()}</span>
            </div>
        </div>
    );
};

export default CodeEditor;
