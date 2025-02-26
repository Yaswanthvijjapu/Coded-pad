import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CodeEditor = () => {
    const { id } = useParams();
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

    useEffect(() => {
        const fetchCode = async () => {
            try {
                console.log("Fetching code for ID:", id);
                const response = await fetch(`http://localhost:5000/api/code/${id}`);
                console.log("Fetch response:", response);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched code:", data);
                    setText(data.code);
                } else {
                    console.error("No existing code found. Status:", response.status);
                }
            } catch (error) {
                console.error("Error fetching code:", error);
            }
        };
        fetchCode();
    }, [id]);
    

    const handleSaveAndClose = () => {
        console.log("Saved & Closed!");
        navigate("/");
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/code/${codeId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: text }),
            });

            if (response.ok) {
                console.log("Saved successfully!");
            } else {
                console.error("Failed to save.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleRefresh = () => {
        setText("");
        setCharCount(value.length);
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
            </div>

            <div className="mt-4 w-full max-w-4xl bg-blue-700 p-3 flex justify-between items-center rounded-lg">
                <div className="flex space-x-2">
                    <button onClick={handleSaveAndClose} className="px-4 py-2 bg-gray-300 text-black rounded">Save & Close</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-gray-300 text-black rounded">Save</button>
                    <button onClick={handleRefresh} className="px-4 py-2 bg-gray-300 text-black rounded">Refresh</button>
                    <button onClick={handleClose} className="px-4 py-2 bg-gray-300 text-black rounded">Close</button>
                </div>
                <span className="text-white">Char count {charCount} / {maxCharLimit}</span>
            </div>
        </div>
    );
};

export default CodeEditor;
