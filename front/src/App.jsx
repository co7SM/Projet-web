import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Notes from './pages/Notes';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Signup />} />
      <Route path="/Notes" element={<Notes />} />
    </Routes>
  );
}
export default App;