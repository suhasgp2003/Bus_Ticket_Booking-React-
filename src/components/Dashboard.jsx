import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";

const getBookingDate = (booking) => booking.booking_time || booking.created_at;

const formatBookingDate = (value) => {
  if (!value) return "Date not available";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date not available"
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
};

const Dashboard = ({ token, userId, username }) => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(token && userId));
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (!token || !userId) return undefined;

    let cancelled = false;

    const fetchBookings = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/${userId}/bookings/`,
          { headers: { Authorization: `Token ${token}` } },
        );
        const results = Array.isArray(response.data)
          ? response.data
          : response.data?.results || response.data?.bookings || [];

        if (!cancelled) setBookings(results);
      } catch (error) {
        if (!cancelled) {
          setBookings([]);
          setLoadError(
            error.response?.data?.detail ||
              "We couldn't load your travel summary. Please try again.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchBookings();

    return () => {
      cancelled = true;
    };
  }, [token, userId]);

  const latestBooking = useMemo(
    () =>
      [...bookings].sort((a, b) => {
        const firstDate = new Date(getBookingDate(a) || 0).getTime() || 0;
        const secondDate = new Date(getBookingDate(b) || 0).getTime() || 0;
        return secondDate - firstDate;
      })[0],
    [bookings],
  );

  const routeCount = useMemo(
    () =>
      new Set(
        bookings.map(
          (booking) => `${booking.bus?.origin || ""}|${booking.bus?.destination || ""}`,
        ),
      ).size,
    [bookings],
  );

  if (!token || !userId) return <Navigate to="/login" replace />;

  return (
    <section>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">Your travel hub</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Welcome back{username ? ` ${username}` : ""}
          </h1>
          <p className="mt-2 text-slate-600">
            Plan a new journey or keep an eye on your reservations.
          </p>
        </div>
        <Link
          to="/buses"
          className="inline-flex w-fit items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Find a bus <span className="ml-2" aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Confirmed bookings", isLoading ? "—" : bookings.length, "Your active reservations"],
          ["Routes explored", isLoading ? "—" : routeCount, "Different journeys booked"],
          ["Seats reserved", isLoading ? "—" : bookings.length, "Across all bookings"],
        ].map(([label, value, description]) => (
          <article key={label} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
            <p className="mt-1 text-xs text-slate-500">{description}</p>
          </article>
        ))}
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-5">
        <article className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 lg:col-span-3 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-600">Latest reservation</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">Your booking at a glance</h2>
            </div>
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              Confirmed
            </span>
          </div>

          {isLoading ? (
            <div className="mt-6 animate-pulse space-y-3">
              <div className="h-6 w-56 rounded bg-slate-200" />
              <div className="h-4 w-40 rounded bg-slate-100" />
              <div className="h-4 w-32 rounded bg-slate-100" />
            </div>
          ) : loadError ? (
            <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {loadError}
            </p>
          ) : latestBooking ? (
            <div className="mt-6">
              <p className="text-xl font-bold text-slate-900">
                {latestBooking.bus?.origin || "Unknown"}
                <span className="mx-2 text-slate-400" aria-hidden="true">&rarr;</span>
                {latestBooking.bus?.destination || "Unknown"}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {latestBooking.bus?.bus_name || "Bus"}
                {latestBooking.bus?.bus_number ? ` · ${latestBooking.bus.bus_number}` : ""}
                {` · Seat ${latestBooking.seat?.seat_number || "N/A"}`}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Booked {formatBookingDate(getBookingDate(latestBooking))}
              </p>
            </div>
          ) : (
            <div className="mt-6 rounded-lg bg-slate-50 p-5">
              <p className="font-semibold text-slate-900">No reservations yet</p>
              <p className="mt-1 text-sm text-slate-600">
                Your next journey starts with finding the right bus.
              </p>
              <Link to="/buses" className="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-800">
                Browse buses &rarr;
              </Link>
            </div>
          )}
        </article>

        <aside className="rounded-xl bg-slate-900 p-5 text-white shadow-sm lg:col-span-2 sm:p-6">
          <p className="text-sm font-semibold text-blue-200">Quick actions</p>
          <h2 className="mt-1 text-xl font-bold">Everything travel, in one place.</h2>
          <div className="mt-5 grid gap-3">
            <Link to="/buses" className="rounded-lg bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white">
              Search available buses
            </Link>
            <Link to="/my-bookings" className="rounded-lg border border-white/20 px-4 py-3 text-sm font-semibold transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white">
              Manage my bookings
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Dashboard;
