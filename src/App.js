import React from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Layout,Validation } from "./components";

function App() {
  return (
    <div>
      <Layout>
        
      <Router>
        <Routes>
          <Route path="/" exact element={<Validation/>} />
        </Routes>
      </Router>

      </Layout>
    </div>
  );
}

export default App;
