import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [codeId, setCodeId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!codeId.trim()) {
      alert("Please enter a Code ID.");
      return;
    }

    try {
      // Check if codeId exists; if not, create it
      await axios.get(`https://coded-pad-2myz.vercel.app/api/code/${encodeURIComponent(codeId)}`).catch(async () => {
        await axios.post("https://coded-pad-2myz.vercel.app/api/code", { codeId, code: "" });
      });
      navigate(`/editor/${encodeURIComponent(codeId)}`);
    } catch (error) {
      console.error("Error checking or creating code:", error.response?.data || error.message);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-900 to-black text-white relative overflow-hidden px-4">
      <div className="absolute inset-0 text-gray-500 text-xs md:text-sm leading-6 opacity-10 pointer-events-none">
        {Array(30)
          .fill()
          .map((_, i) => (
            <p key={i} className="whitespace-nowrap">
              {Array(30)
                .fill()
                .map(() => Math.random().toString(36).substring(2, 10))
                .join(" ")}
            </p>
          ))}
      </div>

      <div className="relative bg-gray-800 bg-opacity-90 p-6 md:p-10 rounded-xl shadow-2xl text-center w-full max-w-md md:max-w-lg lg:max-w-xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400">
          Enter Your Code ID
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row items-center w-full gap-2">
          <input
            type="text"
            value={codeId}
            onChange={(e) => setCodeId(e.target.value)}
            className="p-3 w-full sm:w-2/3 rounded-lg sm:rounded-l-lg bg-gray-700 text-white border border-gray-600 focus:outline-none text-lg placeholder-gray-400"
            placeholder="Enter Code ID..."
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg sm:rounded-r-lg text-lg transition"
          >
            Submit
          </button>
        </form>

        <p className="text-sm md:text-md mt-4 text-gray-400 italic">
          Try using <strong>exampleCode123</strong>
        </p>
      </div>
    </div>
  );
};

export default Home;