import { BrowserRouter, Routes, Route } from "react-router-dom";
import './Styles/App.css';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import HomePage from './Pages/HomePage';
import BooksPage from "./Pages/BooksPage";
import ProfilePage from "./Pages/ProfilePage";
import LibraryPage from "./Pages/LibraryPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/bookspage" element={<BooksPage />} />

      </Routes> 
    </BrowserRouter>
  );
}

export default App;
  