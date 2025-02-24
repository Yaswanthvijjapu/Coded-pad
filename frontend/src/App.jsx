import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import CodeEditor from "./components/CodeEditor";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/code/:code" element={<CodeEditor />} />
            </Routes>
        </Router>
    );
};

export default App;
