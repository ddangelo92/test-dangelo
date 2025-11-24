import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ViewPasswordPage from './pages/ViewPasswordPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/view/:id" element={<ViewPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;