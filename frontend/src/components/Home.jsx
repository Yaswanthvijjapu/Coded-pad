import React, { useState } from "react";

const Home = () => {
    const [code, setCode] = useState("");

    const handleOpen = () => {
        if (code.trim() !== "") {
            window.location.href = `/code/${code}`;
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-900 to-black text-white relative overflow-hidden">
            {/* Background with random characters */}
            <div className="absolute inset-0 text-gray-500 text-xs md:text-sm leading-6 opacity-10">
                {Array(100).fill().map((_, i) => (
                    <p key={i} className="whitespace-nowrap">
                        {Array(100).fill().map(() => Math.random().toString(36).substring(2, 10)).join(" ")}
                    </p>
                ))}
            </div>

            {/* Main Content */}
            <div className="relative bg-gray-800 bg-opacity-90 p-8 md:p-12 rounded-xl shadow-2xl text-center w-11/12 md:w-2/3 lg:w-1/3">
                <h1 className="text-3xl md:text-4xl font-bold text-blue-400">The fastest way to save codes anywhere</h1>
                <p className="text-lg mt-3 font-semibold text-gray-300">No accounts. No signups. No installs.</p>
                <p className="text-md mt-1 text-gray-400">Just choose <em>one code</em>.</p>
                
                <div className="mt-6 flex items-center justify-center w-full">
                    <input 
                        type="text" 
                        value={code} 
                        onChange={(e) => setCode(e.target.value)} 
                        className="p-3 w-4/5 md:w-2/3 rounded-l-lg bg-gray-700 text-white border border-gray-600 focus:outline-none text-lg"
                        placeholder="Enter your code..." 
                    />
                    <button 
                        onClick={handleOpen} 
                        className="px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-r-lg text-lg">
                        Open
                    </button>
                </div>

                <p className="text-sm md:text-md mt-4 text-gray-400 italic">For example, you can use <strong>whatimhavingfordinnertonight3334456</strong></p>
            </div>
        </div>
    );
};

export default Home;
