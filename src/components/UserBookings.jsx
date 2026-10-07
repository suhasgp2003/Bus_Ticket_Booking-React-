import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import ConfirmationDialog from "./ConfirmationDialog";

const BookingIcon = ({ name, className = "h-5 w-5" }) => {
  const paths = {
    bus: <><rect x="5" y="3" width="14" height="16" rx="3" /><path d="M5 10h14M8 19v2m8-2v2M9 6h6" /><circle cx="8.5" cy="15" r="1" /><circle cx="15.5" cy="15" r="1" /></>,
    ticket: <><path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a3 3 0 0 0 0-6Z" /><path d="M12 6v2m0 3v2m0 3v1" /></>,
    seat: <><rect x="7" y="3" width="10" height="13" rx="2" /><path d="M4 11v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M7 16h10M8 20v2m8-2v2" /></>,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18M8 14h2m4 0h2" /></>,
  };

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name] || paths.ticket}
    </svg>
  );
};

const formatBookingTime = (value) => {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
};

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
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/booking/cancel/`,
        {
          headers: { Authorization: `Token ${token}` },
          data: { seats: [seatId] },
        },
      );
      setBookings((currentBookings) =>
        currentBookings.filter((item) => item.id !== booking.id),
      );
      notify("Booking cancelled. A cancellation email has been sent.");
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
    <section aria-labelledby="my-bookings-title" className="space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-red-700">Your travel hub</p>
          <h1 id="my-bookings-title" className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">My bookings</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Your journeys and seat reservations, all in one place.</p>
        </div>
        <Link to="/buses" className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 motion-reduce:transition-none">
          <BookingIcon name="bus" className="h-4 w-4" /> Find a bus
        </Link>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <BookingIcon name="ticket" className="h-4 w-4 text-red-700" />
          Your reservations
        </div>
        <p aria-live="polite" aria-atomic="true" className="text-xs text-slate-500">
          {isLoading ? "Loading bookings..." : bookingError ? "Bookings unavailable" : `${bookings.length} booking${bookings.length === 1 ? "" : "s"}`}
        </p>
      </div>

      {isLoading ? (
        <div role="status" aria-label="Loading bookings" aria-busy="true" className="space-y-5">
          <span className="sr-only">Loading your reservations...</span>
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} aria-hidden="true" className="grid animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm motion-reduce:animate-none md:grid-cols-[minmax(0,1fr)_210px]">
              <div className="space-y-5 p-5 sm:p-6">
                <div className="h-5 w-48 max-w-full rounded bg-slate-200" />
                <div className="h-4 w-28 rounded bg-slate-100" />
                <div className="grid grid-cols-2 gap-8">
                  <div className="h-14 rounded-xl bg-slate-100" />
                  <div className="h-14 rounded-xl bg-slate-100" />
                </div>
                <div className="h-4 w-64 max-w-full rounded bg-slate-100" />
              </div>
              <div className="space-y-4 border-t border-dashed border-slate-300 bg-slate-50 p-5 md:border-t-0 md:border-l sm:p-6">
                <div className="h-12 w-16 rounded bg-slate-200" />
                <div className="h-11 rounded-xl bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ) : bookingError ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-200 text-xl font-bold text-red-700">!</span>
            <div className="min-w-0">
              <h2 className="font-bold text-red-900">We couldn’t load your bookings</h2>
              <p className="mt-2 break-words text-sm leading-6 text-red-700">{bookingError}</p>
            </div>
          </div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center shadow-sm sm:px-10 sm:py-16">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-700">
            <BookingIcon name="ticket" className="h-9 w-9" />
          </span>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">Your next journey starts here</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-500">You have no bookings yet. Find your route, pick a seat, and your reservation will appear here.</p>
          <Link to="/buses" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">
            Explore buses <BookingIcon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {bookings.map((item) => (
            <article
              key={item.id}
              aria-label={`Reservation for ${item.bus?.bus_name || "Bus"}, seat ${item.seat?.seat_number || "N/A"}`}
              aria-busy={cancellingSeatIds.includes(item.seat?.id)}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="grid md:grid-cols-[minmax(0,1fr)_210px]">
                <div className="min-w-0 p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-700"><BookingIcon name="bus" /></span>
                      <div className="min-w-0">
                        <h2 className="break-words text-lg font-bold tracking-tight text-slate-900">{item.bus?.bus_name || "Bus"}</h2>
                        <p className="mt-1 text-xs text-slate-500">Bus no. {item.bus?.bus_number || "Not available"}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 [.theme-dark_&]:text-green-300">
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-green-600" />
                      Confirmed
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 rounded-xl bg-slate-50 p-4 sm:p-5">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">From</p>
                      <h3 className="mt-1 break-words text-lg font-bold tracking-tight text-slate-900 sm:text-xl">{item.bus?.origin || "Unknown"}</h3>
                      {item.bus?.start_time && <p className="mt-1 text-xs font-medium text-slate-500">Departs {item.bus.start_time}</p>}
                    </div>
                    <BookingIcon name="arrow" className="h-5 w-5 text-red-600" />
                    <div className="text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">To</p>
                      <h3 className="mt-1 break-words text-lg font-bold tracking-tight text-slate-900 sm:text-xl">{item.bus?.destination || "Unknown"}</h3>
                      {item.bus?.reach_time && <p className="mt-1 text-xs font-medium text-slate-500">Arrives {item.bus.reach_time}</p>}
                    </div>
                  </div>

                  <dl className="mt-5 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                    <div>
                      <dt className="flex items-center gap-1.5 text-xs text-slate-500"><BookingIcon name="calendar" className="h-3.5 w-3.5" /> Booked on</dt>
                      <dd className="mt-1 break-words text-sm font-medium text-slate-700">{formatBookingTime(item.booking_time || item.created_at)}</dd>
                    </div>
                    <div className="sm:text-right">
                      <dt className="text-xs text-slate-500">Booking reference</dt>
                      <dd className="mt-1 break-words text-sm font-semibold text-slate-700">{item.id != null ? `#${item.id}` : "Not available"}</dd>
                    </div>
                  </dl>
                </div>

                <div className="relative flex flex-col justify-between gap-5 border-t border-dashed border-slate-300 bg-slate-50 p-5 md:border-t-0 md:border-l sm:p-6">
                  <span aria-hidden="true" className="absolute -top-3 -left-3 h-6 w-6 rounded-full border border-slate-200 bg-slate-100" />
                  <span aria-hidden="true" className="absolute -top-3 -right-3 h-6 w-6 rounded-full border border-slate-200 bg-slate-100 md:top-auto md:-bottom-3 md:-left-3 md:right-auto" />
                  <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-2">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-red-700"><BookingIcon name="seat" /></span>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Reserved seat</p>
                      <p className="mt-1 break-words text-3xl font-bold tracking-tight text-slate-900">{item.seat?.seat_number || "N/A"}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={!item.seat?.id || cancellingSeatIds.includes(item.seat.id)}
                    onClick={() => openCancellationDialog(item)}
                    aria-label={`Cancel seat ${item.seat?.seat_number || "N/A"} on ${item.bus?.bus_name || "Bus"}`}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
                  >
                    {cancellingSeatIds.includes(item.seat?.id) && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="animate-spin motion-reduce:animate-none">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity=".25" />
                        <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    )}
                    {cancellingSeatIds.includes(item.seat?.id) ? "Cancelling..." : "Cancel seat"}
                  </button>
                </div>
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
