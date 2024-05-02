
import './App.css';
import { Routes, Route } from 'react-router-dom'; 
import Admin from './Admin';
import Voter from './Voter';
import Home from './Home';

function App() {
  return (
      <div className="App">
        <h1>Here we go!</h1>
        <Routes>
        <Route path="/" element={<Home />} /> {/* Route for Home component */}
          <Route path="/admin" element={<Admin />} /> {/* Route for Admin component */}
          <Route path="/voters" element={<Voter />} /> {/* Route for Voter component */}
        </Routes>
      </div>
  );
}

export default App;
