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

const DashboardIcon = ({ name, className = "h-5 w-5" }) => {
  const paths = {
    bus: <><rect x="5" y="3" width="14" height="16" rx="3" /><path d="M5 10h14M8 19v2m8-2v2M9 6h6" /><circle cx="8.5" cy="15" r="1" /><circle cx="15.5" cy="15" r="1" /></>,
    ticket: <><path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a3 3 0 0 0 0-6Z" /><path d="M12 6v2m0 3v2m0 3v1" /></>,
    route: <><circle cx="6" cy="5" r="2" /><circle cx="18" cy="19" r="2" /><path d="M6 7v8a4 4 0 0 0 4 4h6M8 5h6a4 4 0 0 1 4 4v8" /></>,
    seat: <><rect x="7" y="3" width="10" height="13" rx="2" /><path d="M4 11v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M7 16h10M8 20v2m8-2v2" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18M8 14h2m4 0h2" /></>,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  };

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name] || paths.bus}
    </svg>
  );
};

const BookingPlaceholder = () => (
  <div aria-label="Loading booking details" role="status" className="animate-pulse space-y-4 motion-reduce:animate-none">
    <span className="sr-only">Loading booking details...</span>
    <div className="h-5 w-2/3 rounded bg-slate-200" />
    <div className="h-4 w-1/2 rounded bg-slate-100" />
    <div className="h-20 rounded-xl bg-slate-100" />
  </div>
);

const ReservationCard = ({ booking }) => (
  <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-700">
          <DashboardIcon name="bus" />
        </span>
        <div className="min-w-0">
          <h3 className="break-words font-bold text-slate-900">{booking.bus?.bus_name || "Bus"}</h3>
          <p className="mt-0.5 text-xs text-slate-500">Bus no. {booking.bus?.bus_number || "Not available"}</p>
        </div>
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 [.theme-dark_&]:text-green-300">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-green-600" />
        Confirmed
      </span>
    </div>

    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 rounded-xl bg-slate-50 p-4 sm:p-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">From</p>
        <p className="mt-1 break-words text-base font-bold text-slate-900 sm:text-lg">{booking.bus?.origin || "Unknown"}</p>
      </div>
      <DashboardIcon name="arrow" className="h-5 w-5 text-red-600" />
      <div className="text-right">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">To</p>
        <p className="mt-1 break-words text-base font-bold text-slate-900 sm:text-lg">{booking.bus?.destination || "Unknown"}</p>
      </div>
    </div>

    <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 border-t border-slate-100 pt-4 text-sm">
      <div>
        <dt className="text-xs text-slate-500">Seat number</dt>
        <dd className="mt-1 font-bold text-slate-900">{booking.seat?.seat_number || "N/A"}</dd>
      </div>
      <div className="text-right">
        <dt className="text-xs text-slate-500">Booked on</dt>
        <dd className="mt-1 font-semibold text-slate-700">{formatBookingDate(getBookingDate(booking))}</dd>
      </div>
    </dl>
  </div>
);

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
    <section aria-labelledby="dashboard-title" className="space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest text-red-700">Your travel dashboard</p>
          <h1 id="dashboard-title" className="mt-2 break-words text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Welcome back{username ? ` ${username}` : ""}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">A little less planning. A lot more exploring.</p>
        </div>
        <Link to="/my-bookings" className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 motion-reduce:transition-none">
          <DashboardIcon name="ticket" /> My bookings
        </Link>
      </header>

      <div className="relative isolate overflow-hidden rounded-3xl bg-[#b91c1c] px-5 py-7 text-white shadow-sm sm:px-8 sm:py-8">
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-16 -z-10 h-72 w-72 rounded-full border-[40px] border-white/10" />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium"><DashboardIcon name="route" className="h-4 w-4" /> Your next adventure</span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">Great journeys start with a seat.</h2>
            <p className="mt-2 text-sm leading-6 text-red-100">Explore available routes and find a bus for wherever life takes you next.</p>
          </div>
          <Link to="/buses" className="inline-flex min-h-12 w-fit shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-red-700 shadow-sm transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-red-700 motion-reduce:transition-none">
            Find a bus <DashboardIcon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3" aria-label="Booking statistics" aria-busy={isLoading}>
        {[
          ["Confirmed bookings", bookings.length, "Your active reservations", "ticket"],
          ["Routes explored", routeCount, "Different journeys booked", "route"],
          ["Seats reserved", bookings.length, "Across all bookings", "seat"],
        ].map(([label, value, description, icon]) => (
          <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-medium text-slate-600">{label}</h2>
                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{isLoading || loadError ? "—" : value}</p>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-700"><DashboardIcon name={icon} /></span>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">{description}</p>
          </article>
        ))}
      </div>

      {loadError && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-700">
          <p className="font-bold">Your travel summary is unavailable</p>
          <p className="mt-1">{loadError}</p>
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="latest-booking-title">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-700">Latest reservation</p>
              <h2 id="latest-booking-title" className="mt-1 text-xl font-bold tracking-tight text-slate-900">Your booking at a glance</h2>
            </div>
            <DashboardIcon name="ticket" className="h-6 w-6 shrink-0 text-red-700" />
          </div>
          <div className="p-5 sm:p-6" aria-busy={isLoading}>
            {isLoading ? (
              <BookingPlaceholder />
            ) : loadError ? (
              <p className="text-sm leading-6 text-slate-500">Your latest reservation is currently unavailable.</p>
            ) : latestBooking ? (
              <>
                <ReservationCard booking={latestBooking} />
                <Link to="/my-bookings" className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">
                  Manage my bookings <DashboardIcon name="arrow" className="h-4 w-4" />
                </Link>
              </>
            ) : (
              <div className="rounded-xl bg-slate-50 p-6 text-center">
                <DashboardIcon name="ticket" className="mx-auto h-9 w-9 text-slate-400" />
                <h3 className="mt-3 font-bold text-slate-900">No reservations yet</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">Your next journey starts with finding the right bus.</p>
                <Link to="/buses" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-bold text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                  Browse buses <DashboardIcon name="arrow" className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </article>

        <div className="space-y-6">
          <section aria-labelledby="upcoming-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 id="upcoming-title" className="text-xl font-bold tracking-tight text-slate-900">Upcoming journeys</h2>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-700"><DashboardIcon name="calendar" /></span>
            </div>
            <div className="mt-5" aria-busy={isLoading}>
              {isLoading ? (
                <BookingPlaceholder />
              ) : loadError ? (
                <p className="text-sm leading-6 text-slate-500">Your journey details are currently unavailable.</p>
              ) : bookings.length > 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
                  <span className="inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600">Travel dates unavailable</span>
                  <h3 className="mt-3 font-bold text-slate-900">Check your journey details</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Your reservations don’t include travel dates here. Open My bookings to review your bus and seat details.</p>
                  <Link to="/my-bookings" className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-bold text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">View reservations <DashboardIcon name="arrow" className="h-4 w-4" /></Link>
                </div>
              ) : (
                <div className="rounded-xl bg-slate-50 p-5">
                  <h3 className="font-bold text-slate-900">Where will you go next?</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Explore a new route and reserve your seat for your next adventure.</p>
                  <Link to="/buses" className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-bold text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">Find a bus <DashboardIcon name="arrow" className="h-4 w-4" /></Link>
                </div>
              )}
            </div>
          </section>

          <aside className="rounded-2xl bg-slate-900 p-5 text-white shadow-sm sm:p-6" aria-labelledby="quick-actions-title">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-200">Quick actions</p>
            <h2 id="quick-actions-title" className="mt-2 text-lg font-bold">Less searching. More travelling.</h2>
            <nav aria-label="Travel shortcuts" className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link to="/buses" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-3 text-sm font-semibold transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><DashboardIcon name="bus" className="h-4 w-4" /> Find a bus</Link>
              <Link to="/my-bookings" className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 px-3 py-3 text-sm font-semibold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><DashboardIcon name="ticket" className="h-4 w-4" /> My bookings</Link>
            </nav>
          </aside>
        </div>
      </div>

      <section aria-labelledby="recent-bookings-title" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
          <div>
            <h2 id="recent-bookings-title" className="text-xl font-bold tracking-tight text-slate-900">Recent bookings</h2>
            <p className="mt-1 text-sm text-slate-500">Your latest seat reservations.</p>
          </div>
          <Link to="/my-bookings" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-bold text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">View all <DashboardIcon name="arrow" className="h-4 w-4" /></Link>
        </div>
        <div className="p-5 sm:p-6" aria-busy={isLoading}>
          {isLoading ? (
            <div className="grid gap-5 md:grid-cols-3">{[0, 1, 2].map((index) => <BookingPlaceholder key={index} />)}</div>
          ) : loadError ? (
            <p className="text-sm text-slate-500">Your recent bookings are currently unavailable.</p>
          ) : bookings.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">Your recent bookings will appear here after your first reservation.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[...bookings]
                .sort((a, b) => {
                  const firstDate = new Date(getBookingDate(a) || 0).getTime() || 0;
                  const secondDate = new Date(getBookingDate(b) || 0).getTime() || 0;
                  return secondDate - firstDate;
                })
                .slice(0, 3)
                .map((booking) => (
                  <article key={booking.id} className="min-w-0 rounded-2xl border border-slate-200 p-4 sm:p-5">
                    <ReservationCard booking={booking} />
                  </article>
                ))}
            </div>
          )}
        </div>
      </section>
    </section>
  );
};

export default Dashboard;
