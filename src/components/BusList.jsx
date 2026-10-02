import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        <section>
            <div className="mb-7">
                <p className="text-sm font-semibold text-blue-600">Find your ride</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Available buses</h1>
                <p className="mt-2 text-slate-600">Choose a route and reserve your preferred seat.</p>
            </div>
            <form onSubmit={handleFilterSubmit} className="mb-7 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
                <div className="grid gap-4 md:grid-cols-3">
                    <label className="block text-sm font-semibold text-slate-700">
                        Search
                        <input
                            name="search"
                            type="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Bus name or number"
                            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                        From
                        <input
                            name="from"
                            type="text"
                            value={filters.from}
                            onChange={handleFilterChange}
                            placeholder="Departure city"
                            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                        To
                        <input
                            name="to"
                            type="text"
                            value={filters.to}
                            onChange={handleFilterChange}
                            placeholder="Destination city"
                            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </label>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                    <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Search buses</button>
                    {submittedFilters && <button type="button" onClick={handleClearFilters} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Clear filters</button>}
                </div>
            </form>
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2" aria-label="Loading buses">
                {Array.from({ length: 4 }, (_, index) => (
                  <div key={index} className="animate-pulse rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <div className="h-5 w-40 rounded bg-slate-200" />
                    <div className="mt-3 h-4 w-28 rounded bg-slate-100" />
                    <div className="my-6 h-4 w-full rounded bg-slate-100" />
                    <div className="h-9 w-28 rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            ) : loadError ? (
              <div className="rounded-xl bg-red-50 p-6 text-center shadow-sm ring-1 ring-red-200">
                <p className="font-semibold text-red-900">Could not load buses</p>
                <p className="mt-1 text-sm text-red-700">{loadError}</p>
              </div>
            ) : filteredBuses.length === 0 ? (
              <p className="rounded-xl bg-white p-6 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">{submittedFilters ? 'No buses match your search.' : 'No buses are available right now.'}</p>
            ) : (
            <div className="grid gap-4 md:grid-cols-2">
            {filteredBuses.map((item) => (
                <article key={item.id} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
                    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">{item.bus_name}</h2>
                            <p className="mt-1 text-sm text-slate-500">Bus no. {item.bus_number}</p>
                        </div>
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Available</span>
                    </div>
                    <div className="my-5 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-700 sm:flex-nowrap sm:gap-3">
                        <span className="max-w-full break-words">{item.origin}</span>
                        <span className="h-px min-w-6 flex-1 bg-slate-300" />
                        <span className="max-w-full break-words">{item.destination}</span>
                    </div>
                    <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-500">{item.start_time} - {item.reach_time}</p>
                        <button className="w-full rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto" onClick={() => handleViewSeats(item.id)}>View seats</button>
                    </div>
                </article>
            ))}
            </div>
            )}
        </section>
    );
}    
export default BusList;
