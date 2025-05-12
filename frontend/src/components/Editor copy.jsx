import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Editor = () => {
  const { codeId } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [readOnly, setReadOnly] = useState(true);
  const [charCount, setCharCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const maxCharLimit = 500000;
  useEffect(() => {
    const fetchCode = async () => {
      try {
        const res = await axios.get(`https://coded-pad-1.vercel.app/api/code/${encodeURIComponent(codeId)}`);
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
      const res = await axios.put(`https://coded-pad-1.vercel.app/api/code/${encodeURIComponent(codeId)}`, { code });
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

  const handleTextChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxCharLimit) {
      setCode(value);
      setCharCount(value.length);
    }
  };

  if (loading) return <p className="text-center mt-20 text-white">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 md:p-6">
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        <button onClick={() => setReadOnly(false)} className={`px-4 py-2 rounded-lg ${!readOnly ? "bg-blue-600" : "bg-gray-700"}`}>
          Edit Mode
        </button>
        <button onClick={() => setReadOnly(true)} className={`px-4 py-2 rounded-lg ${readOnly ? "bg-blue-600" : "bg-gray-700"}`}>
          Read-Only Mode
        </button>
      </div>

      <div className="w-full max-w-4xl bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
        <textarea
          className={`w-full min-h-[200px] md:h-64 p-4 rounded-lg border border-gray-600 ${
            readOnly ? "bg-gray-700 text-gray-300" : "bg-gray-600 text-white"
          }`}
          value={code}
          onChange={handleTextChange}
          readOnly={readOnly}
        ></textarea>
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
