import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Editor = () => {
  const { codeId } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [readOnly, setReadOnly] = useState(true);
  const [charCount, setCharCount] = useState(0);
  const maxCharLimit = 500000;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCode = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/code/${codeId}`);
  
        if (!res.data) {
          // If codeId does not exist, create a new entry in MongoDB
          await axios.post("http://localhost:5000/api/code", { codeId, code: "" });
          setCode(""); // Set initial empty code
        } else {
          setCode(res.data.code);
          setCharCount(res.data.code.length);
        }
      } catch (error) {
        console.error("Error fetching code", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCode();
  }, [codeId]);
  

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/code/${codeId}`, { code });
      alert("Code saved successfully");
      setReadOnly(true);
    } catch (error) {
      console.error("Error saving code:", error);
      alert("Failed to save code.");
    }
  };
  
  const handleSaveAndClose = async () => {
    try {
      await handleSave();
      navigate("/");
    } catch (error) {
      console.error("Error while saving and closing", error);
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <div className="flex space-x-4 mb-4">
        <button onClick={() => setReadOnly(false)} className={`px-4 py-2 ${!readOnly ? "bg-blue-600" : "bg-gray-700"} rounded-lg`}>
          Edit Mode
        </button>
        <button onClick={() => setReadOnly(true)} className={`px-4 py-2 ${readOnly ? "bg-blue-600" : "bg-gray-700"} rounded-lg`}>
          Read-Only Mode
        </button>
      </div>

      <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <textarea
          className={`w-full h-64 p-4 rounded-lg ${readOnly ? "bg-gray-700 text-gray-300" : "bg-gray-600 text-white"} border border-gray-600`}
          value={code}
          onChange={handleTextChange}
          readOnly={readOnly}
        ></textarea>
      </div>

      <div className="mt-4 w-full max-w-4xl bg-blue-700 p-3 flex justify-between items-center rounded-lg">
        <div className="flex space-x-2">
          <button onClick={handleSaveAndClose} className="px-4 py-2 bg-gray-300 text-black rounded">Save & Close</button>
          {!readOnly && <button onClick={handleSave} className="px-4 py-2 bg-gray-300 text-black rounded">Save</button>}
          <button onClick={handleRefresh} className="px-4 py-2 bg-gray-300 text-black rounded">Refresh</button>
          <button onClick={handleClose} className="px-4 py-2 bg-gray-300 text-black rounded">Close</button>
        </div>
        <span className="text-white">Char count {charCount} / {maxCharLimit}</span>
      </div>
    </div>
  );
};

export default Editor;
