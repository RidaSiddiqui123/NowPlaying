import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./Pages/mainPage";
import ResultsPage from "./Pages/resultsPage";
import ReviewsPage from "./Pages/reviewsPage";
import Navbar from "./components/navbar";

function App() {
  return (
    <div className="App">
      <Router>
      
        <Navbar />
          <Routes>
            <Route path="/" element= {<MainPage/>}></Route>
            <Route path="/results/:query" element= {<ResultsPage/>}></Route>
            <Route path="/reviews/:media_type/:id" element={<ReviewsPage/>}></Route>
            {/* <Route path="/project/:id" element= {<ProjectPage/>}></Route>
            <Route path="*" element = {<div>404 Not Found</div>}></Route> */}
          </Routes>
        
      </Router>
      

    </div>
  );
}

export default App;