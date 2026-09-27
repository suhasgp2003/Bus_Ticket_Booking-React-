import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const UserBookings = ({ token, userId }) => {
  const [bookings, setBookings] = useState([]);
  const [bookingError, setBookingError] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(token && userId));

  useEffect(() => {
    if (!token || !userId) return;

    const fetchBookings = async () => {
      setIsLoading(true);
      setBookingError(null);

      try {
        const response = await axios.get(
          `http://localhost:8000/api/user/${userId}/bookings/`,
          { headers: { Authorization: `Token ${token}` } },
        );
        const responseBookings = Array.isArray(response.data)
          ? response.data
          : response.data.results || response.data.bookings || [];
        setBookings(responseBookings);
      } catch (error) {
        setBookings([]);
        setBookingError(
          error.response?.data?.detail ||
            "Unable to load your bookings. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [token, userId]);

  if (!token || !userId) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section>
      <div className="mb-7">
        <p className="text-sm font-semibold text-blue-600">Your travel history</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">My bookings</h1>
      </div>

      {isLoading ? (
        <p className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">Loading your bookings...</p>
      ) : bookingError ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{bookingError}</p>
      ) : bookings.length === 0 ? (
        <p className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">You have no bookings yet.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((item) => (
  <article
    key={item.id}
    className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between"
  >
    <div>
      <p className="font-bold text-slate-900">
        {item.bus?.bus_name || "Bus"}
        {item.bus?.bus_number ? ` (${item.bus.bus_number})` : ""}
        {" - "}
        Seat {item.seat?.seat_number || "N/A"}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {item.bus?.origin || "Unknown"} →{" "}
        {item.bus?.destination || "Unknown"}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        Booked on{" "}
        {item.booking_time || item.created_at || "Not available"}
      </p>
    </div>

    <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
      Confirmed
    </span>
  </article>
))}
        </div>
      )}
    </section>
  );
};

export default UserBookings;
