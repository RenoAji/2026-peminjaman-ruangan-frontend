import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoomListPage from "./pages/rooms/RoomListPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoomListPage />} />
        <Route path="/rooms" element={<RoomListPage />} />
        <Route path="*" element={<RoomListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
