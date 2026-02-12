import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RoomListPage from "./pages/rooms/RoomListPage";
import BookingListPage from "./pages/bookings/BookingListPage";
import BookingFormPage from "./pages/bookings/BookingFormPage";
import AvailabilityCheckerPage from "./pages/availability/AvailabilityCheckerPage";
import RoomAvailabilityDetailPage from "./pages/availability/RoomAvailabilityDetailPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/rooms" replace />} />
        <Route path="/rooms" element={<RoomListPage />} />
        <Route
          path="/rooms/:id/availability"
          element={<RoomAvailabilityDetailPage />}
        />
        <Route path="/availability" element={<AvailabilityCheckerPage />} />
        <Route path="/bookings" element={<BookingListPage />} />
        <Route path="/bookings/new" element={<BookingFormPage />} />
        <Route path="/bookings/edit/:id" element={<BookingFormPage />} />
        <Route path="*" element={<Navigate to="/rooms" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
