import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BusListIcon = ({ name, className = "h-5 w-5" }) => {
  const paths = {
    bus: <><rect x="5" y="3" width="14" height="16" rx="3" /><path d="M5 10h14M8 19v2m8-2v2M9 6h6" /><circle cx="8.5" cy="15" r="1" /><circle cx="15.5" cy="15" r="1" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    order: <><path d="M4 6h16M4 12h11M4 18h6m8-5v8m-3-3 3 3 3-3" /></>,
  };

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name] || paths.bus}
    </svg>
  );
};

const formatFare = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const amount = Number(value);
  if (!Number.isFinite(amount)) return null;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const BusList = () => {
    const [buses, setBuses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [filters, setFilters] = useState({ search: '', from: '', to: '' });
    const [submittedFilters, setSubmittedFilters] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBuses = async () => {
            setIsLoading(true);
            setLoadError(null);
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/buses/`);
                setBuses(response.data);
            } catch (error) {
                console.log('Error fetching buses:', error);
                setLoadError('Unable to load buses. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBuses();
    }, []);

    const handleViewSeats = (id) => {
        navigate(`/bus/${id}`);
    };

    const handleFilterChange = ({ target: { name, value } }) => {
        setFilters((currentFilters) => ({ ...currentFilters, [name]: value }));
    };

    const handleFilterSubmit = (event) => {
        event.preventDefault();
        setSubmittedFilters({
            search: filters.search.trim().toLowerCase(),
            from: filters.from.trim().toLowerCase(),
            to: filters.to.trim().toLowerCase(),
        });
    };

    const handleClearFilters = () => {
        setFilters({ search: '', from: '', to: '' });
        setSubmittedFilters(null);
    };

    const filteredBuses = submittedFilters
        ? buses.filter((bus) => {
            const searchableBusDetails = `${bus.bus_name || ''} ${bus.bus_number || ''}`.toLowerCase();
            return searchableBusDetails.includes(submittedFilters.search)
                && (bus.origin || '').toLowerCase().includes(submittedFilters.from)
                && (bus.destination || '').toLowerCase().includes(submittedFilters.to);
        })
        : buses;

    return (
        <section aria-labelledby="bus-results-title" className="space-y-6">
            <header>
                <p className="text-xs font-bold uppercase tracking-widest text-red-700">Find your ride</p>
                <h1 id="bus-results-title" className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Your route. Your ride.</h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">Compare buses, explore available seats, and find your next journey.</p>
            </header>

            <form onSubmit={handleFilterSubmit} aria-labelledby="search-buses-title" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="h-1 bg-red-600" />
                <div className="p-5 sm:p-6">
                    <div className="mb-5 flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-700"><BusListIcon name="search" /></span>
                        <div>
                            <h2 id="search-buses-title" className="font-bold text-slate-900">Where would you like to go?</h2>
                            <p className="mt-0.5 text-xs leading-5 text-slate-500">Search by city, bus name, or bus number.</p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label htmlFor="bus-search" className="block text-sm font-semibold text-slate-700">Bus name or number</label>
                            <div className="relative mt-2">
                                <BusListIcon name="search" className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="bus-search"
                                    name="search"
                                    type="search"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    placeholder="Search buses"
                                    className="min-h-12 w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-11 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 motion-reduce:transition-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="bus-from" className="block text-sm font-semibold text-slate-700">From</label>
                            <div className="relative mt-2">
                                <BusListIcon name="pin" className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="bus-from"
                                    name="from"
                                    type="text"
                                    value={filters.from}
                                    onChange={handleFilterChange}
                                    placeholder="Departure city"
                                    className="min-h-12 w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-11 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 motion-reduce:transition-none"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-1">
                            <label htmlFor="bus-to" className="block text-sm font-semibold text-slate-700">To</label>
                            <div className="relative mt-2">
                                <BusListIcon name="pin" className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="bus-to"
                                    name="to"
                                    type="text"
                                    value={filters.to}
                                    onChange={handleFilterChange}
                                    placeholder="Destination city"
                                    className="min-h-12 w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-11 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 motion-reduce:transition-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs leading-5 text-slate-500">All fields are optional. Search to apply your filters.</p>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            {submittedFilters && (
                                <button type="button" onClick={handleClearFilters} className="min-h-12 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">
                                    Clear filters
                                </button>
                            )}
                            <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 motion-reduce:transition-none">
                                <BusListIcon name="search" className="h-4 w-4" /> Search buses
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900" aria-live="polite" aria-atomic="true">
                        {isLoading ? "Finding buses..." : loadError ? "Search results" : `${filteredBuses.length} bus${filteredBuses.length === 1 ? "" : "es"} found`}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">{submittedFilters ? "Results matching your search" : "Explore available routes"}</p>
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-600">
                    <BusListIcon name="order" className="h-4 w-4" />
                    <span>Sort order</span><span className="font-semibold text-slate-900">Default</span>
                </div>
            </div>

            {submittedFilters && (
                <div className="flex flex-wrap gap-2" aria-label="Applied search filters">
                    {[
                        ["Bus", submittedFilters.search],
                        ["From", submittedFilters.from],
                        ["To", submittedFilters.to],
                    ].filter(([, value]) => value).map(([label, value]) => (
                        <span key={label} className="max-w-full break-words rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700">{label}: {value}</span>
                    ))}
                </div>
            )}

            {isLoading ? (
                <div role="status" aria-label="Loading buses" className="space-y-4">
                    <span className="sr-only">Loading available buses...</span>
                    {Array.from({ length: 4 }, (_, index) => (
                        <div key={index} aria-hidden="true" className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 motion-reduce:animate-none sm:p-6">
                            <div className="h-5 w-40 rounded bg-slate-200" />
                            <div className="mt-3 h-4 w-28 rounded bg-slate-100" />
                            <div className="mt-6 grid grid-cols-2 gap-6">
                                <div className="h-12 rounded-xl bg-slate-100" />
                                <div className="h-12 rounded-xl bg-slate-100" />
                            </div>
                            <div className="mt-5 h-11 w-full rounded-xl bg-slate-200 sm:ml-auto sm:w-36" />
                        </div>
                    ))}
                </div>
            ) : loadError ? (
                <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center sm:p-10">
                    <BusListIcon name="bus" className="mx-auto h-9 w-9 text-red-700" />
                    <h3 className="mt-3 text-lg font-bold text-red-900">Could not load buses</h3>
                    <p className="mt-2 text-sm leading-6 text-red-700">{loadError}</p>
                </div>
            ) : filteredBuses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center sm:p-10">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-500"><BusListIcon name="search" className="h-6 w-6" /></span>
                    <h3 className="mt-4 text-lg font-bold text-slate-900">{submittedFilters ? "No buses match your search" : "No buses are available right now"}</h3>
                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">{submittedFilters ? "Try a different city or bus name, or clear your filters to see all routes." : "Please check again later for available routes."}</p>
                    {submittedFilters && (
                        <button type="button" onClick={handleClearFilters} className="mt-5 min-h-11 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">Clear filters</button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredBuses.map((item) => {
                        const fare = formatFare(item.fare ?? item.price ?? item.ticket_price);
                        const availableSeatCount = Array.isArray(item.seats)
                            ? item.seats.filter((seat) => !seat.is_booked).length
                            : null;

                        return (
                            <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-red-200 hover:shadow-md motion-reduce:transition-none">
                                <div className="grid md:grid-cols-[minmax(0,1fr)_190px]">
                                    <div className="min-w-0 p-5 sm:p-6">
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-700"><BusListIcon name="bus" /></span>
                                                <div className="min-w-0">
                                                    <h3 className="break-words text-lg font-bold tracking-tight text-slate-900">{item.bus_name}</h3>
                                                    <p className="mt-1 text-xs text-slate-500">Bus no. {item.bus_number}</p>
                                                </div>
                                            </div>
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${availableSeatCount === null ? "bg-slate-50 text-slate-600" : availableSeatCount > 0 ? "bg-green-50 text-green-700 [.theme-dark_&]:text-green-300" : "bg-red-50 text-red-700"}`}>
                                                <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${availableSeatCount === null ? "bg-slate-400" : availableSeatCount > 0 ? "bg-green-600" : "bg-red-600"}`} />
                                                {availableSeatCount === null ? "Check seat availability" : availableSeatCount > 0 ? `${availableSeatCount} seat${availableSeatCount === 1 ? "" : "s"} available` : "No available seats"}
                                            </span>
                                        </div>

                                        <div className="mt-6 grid grid-cols-[minmax(0,1fr)_minmax(2rem,0.5fr)_minmax(0,1fr)] items-center gap-3">
                                            <div>
                                                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Departure</p>
                                                <p className="mt-1 break-words text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{item.start_time || "—"}</p>
                                                <p className="mt-1 break-words text-sm font-medium text-slate-600">{item.origin || "Not specified"}</p>
                                            </div>
                                            <div aria-hidden="true" className="flex items-center text-red-600">
                                                <span className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-red-600" />
                                                <span className="h-px flex-1 bg-slate-300" />
                                                <BusListIcon name="arrow" className="mx-1 h-4 w-4 shrink-0" />
                                                <span className="h-px flex-1 bg-slate-300" />
                                                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-600" />
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Arrival</p>
                                                <p className="mt-1 break-words text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{item.reach_time || "—"}</p>
                                                <p className="mt-1 break-words text-sm font-medium text-slate-600">{item.destination || "Not specified"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-slate-50 p-5 md:flex-col md:items-end md:justify-center md:border-t-0 md:border-l sm:p-6">
                                        <div className="min-w-0 md:text-right">
                                            <p className="text-xs font-medium text-slate-500">Fare per seat</p>
                                            <p className={`mt-1 font-bold tracking-tight text-slate-900 ${fare ? "text-2xl" : "text-sm"}`}>{fare || "Fare unavailable"}</p>
                                        </div>
                                        <button
                                            type="button"
                                            aria-label={`View seats for ${item.bus_name || "bus"} from ${item.origin || "departure"} to ${item.destination || "destination"}`}
                                            onClick={() => handleViewSeats(item.id)}
                                            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 motion-reduce:transition-none md:w-full"
                                        >
                                            View seats <BusListIcon name="arrow" className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default BusList;
