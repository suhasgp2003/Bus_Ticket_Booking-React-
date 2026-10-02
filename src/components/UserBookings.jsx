import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import ConfirmationDialog from "./ConfirmationDialog";

const UserBookings = ({ token, userId, notify }) => {
  const [bookings, setBookings] = useState([]);
  const [bookingError, setBookingError] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(token && userId));
  const [cancellingSeatIds, setCancellingSeatIds] = useState([]);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  useEffect(() => {
    if (!token || !userId) return;

    const fetchBookings = async () => {
      setIsLoading(true);
      setBookingError(null);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/${userId}/bookings/`,
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

  const handleCancelBooking = async (booking) => {
    const seatId = booking.seat?.id;
    if (!seatId || cancellingSeatIds.includes(seatId)) return;

    setCancellingSeatIds((currentIds) => [...currentIds, seatId]);
    try {
      const response = await axios.delete(
        "http://localhost:8000/api/booking/cancel/",
        {
          headers: { Authorization: `Token ${token}` },
          data: { seats: [seatId] },
        },
      );
      setBookings((currentBookings) =>
        currentBookings.filter((item) => item.id !== booking.id),
      );
      notify(response.data?.message || "Booking cancelled successfully.");
    } catch (error) {
      notify(
        error.response?.data?.error ||
          error.response?.data?.detail ||
          "Unable to cancel this booking. Please try again.",
        "error",
      );
    } finally {
      setCancellingSeatIds((currentIds) =>
        currentIds.filter((id) => id !== seatId),
      );
    }
  };

  const openCancellationDialog = (booking) => {
    if (booking.seat?.id && !cancellingSeatIds.includes(booking.seat.id)) {
      setBookingToCancel(booking);
    }
  };

  const confirmCancellation = () => {
    const booking = bookingToCancel;
    setBookingToCancel(null);
    if (booking) handleCancelBooking(booking);
  };

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
        <div className="space-y-3" aria-label="Loading bookings">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="animate-pulse rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="h-5 w-48 rounded bg-slate-200" />
              <div className="mt-3 h-4 w-64 max-w-full rounded bg-slate-100" />
              <div className="mt-2 h-4 w-36 rounded bg-slate-100" />
            </div>
          ))}
        </div>
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

    <div className="flex w-fit items-center gap-2">
      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
        Confirmed
      </span>
      <button
        type="button"
        disabled={!item.seat?.id || cancellingSeatIds.includes(item.seat.id)}
        onClick={() => openCancellationDialog(item)}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {cancellingSeatIds.includes(item.seat?.id) ? "Cancelling..." : "Cancel seat"}
      </button>
    </div>
  </article>
))}
        </div>
      )}
      <ConfirmationDialog
        isOpen={Boolean(bookingToCancel)}
        title="Cancel this seat?"
        message={`Are you sure you want to cancel seat ${bookingToCancel?.seat?.seat_number || ""}?`}
        confirmLabel="Cancel booking"
        onCancel={() => setBookingToCancel(null)}
        onConfirm={confirmCancellation}
      />
    </section>
  );
};

export default UserBookings;
