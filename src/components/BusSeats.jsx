import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const sortSeatsByNumber = (seatList) =>
  [...seatList].sort((firstSeat, secondSeat) =>
    String(firstSeat.seat_number).localeCompare(
      String(secondSeat.seat_number),
      undefined,
      { numeric: true, sensitivity: "base" },
    ),
  );

const BusSeats = ({ token, notify }) => {
  const [bus, setBus] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const { busId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusDetails = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/buses/${busId}/`);
        setBus(response.data);
        setSeats(sortSeatsByNumber(response.data.seats || []));
        setSelectedSeatIds([]);
      } catch (error) {
        console.log("Error fetching bus details:", error);
        setLoadError("Unable to load this bus and its seats. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusDetails();
  }, [busId]);

  const toggleSeat = (seatId) => {
    const seat = seats.find((item) => item.id === seatId);
    if (seat?.is_booked || isBooking) return;

    setSelectedSeatIds((currentIds) =>
      currentIds.includes(seatId)
        ? currentIds.filter((id) => id !== seatId)
        : [...currentIds, seatId],
    );
  };

  const selectedSeats = seats.filter((seat) => selectedSeatIds.includes(seat.id));
  const fare = Number(bus?.fare ?? bus?.price ?? bus?.ticket_price ?? 0);
  const totalPrice = selectedSeats.length * fare;
  const seatRows = Object.values(
    seats.reduce((rows, seat) => {
      const rowNumber = seat.row ?? 1;
      rows[rowNumber] = rows[rowNumber] || { rowNumber, seats: [] };
      rows[rowNumber].seats.push(seat);
      return rows;
    }, {}),
  )
    .sort((firstRow, secondRow) => firstRow.rowNumber - secondRow.rowNumber)
    .map((row) => ({
      ...row,
      seats: [...row.seats].sort((firstSeat, secondSeat) => firstSeat.column - secondSeat.column),
    }));
  const layoutColumns = [...new Set(seats.map((seat) => seat.column))].sort((first, second) => first - second);

  const getGridColumn = (seat) => {
    const columnIndex = layoutColumns.indexOf(seat.column);
    if (layoutColumns.length === 4) return columnIndex < 2 ? columnIndex + 1 : columnIndex + 2;
    return seat.column;
  };

  const renderSeat = (seat) => {
    if (!seat) return <span aria-hidden="true" />;

    const isSelected = selectedSeatIds.includes(seat.id);
    return (
      <button
        key={seat.id}
        type="button"
        aria-pressed={isSelected}
        aria-label={`Seat ${seat.seat_number}, ${seat.seat_type || "seat"}, ${seat.is_booked ? "booked" : isSelected ? "selected" : "available"}`}
        disabled={seat.is_booked || isBooking}
        onClick={() => toggleSeat(seat.id)}
        className={`flex min-h-16 min-w-0 flex-col items-center justify-center rounded-xl border px-1 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 motion-reduce:transition-none ${
          seat.is_booked
            ? "cursor-not-allowed border-slate-200 bg-slate-200 text-slate-500"
            : isSelected
              ? "border-red-600 bg-red-600 text-white shadow-sm hover:bg-red-700 disabled:cursor-wait"
              : "border-slate-300 bg-white text-slate-600 hover:border-red-400 hover:bg-red-50 disabled:cursor-wait"
        }`}
        style={{ gridColumnStart: getGridColumn(seat), gridRowStart: 1 }}
        title={`${seat.seat_number} — ${seat.seat_type || "seat"}`}
      >
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <rect x="8" y="3" width="16" height="18" rx="3" />
          <path d="M5 14v10a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V14M8 21h16M10 27v3m12-3v3" strokeLinecap="round" />
        </svg>
        <span className="mt-1 max-w-full truncate">{seat.seat_number}</span>
      </button>
    );
  };

  const handleBookSeats = async () => {
    if (!token) {
      notify("Please login to book a seat.", "error");
      navigate("/login");
      return;
    }

    if (selectedSeatIds.length === 0 || isBooking) return;

    setIsBooking(true);
    try {
      await axios.post(
         `${import.meta.env.VITE_API_URL}/booking/`,
        { seats: selectedSeatIds },
        { headers: { Authorization: `Token ${token}` } },
      );
      setSeats((currentSeats) =>
        currentSeats.map((item) =>
          selectedSeatIds.includes(item.id) ? { ...item, is_booked: true } : item,
        ),
      );
      setSelectedSeatIds([]);
      notify(`${selectedSeatIds.length} seat${selectedSeatIds.length === 1 ? "" : "s"} booked successfully!`);
    } catch (error) {
      notify(error.response?.data?.error || "Booking failed. Please try again.", "error");
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <section aria-busy="true" aria-label="Loading bus and seat map" className="animate-pulse motion-reduce:animate-none">
        <div className="h-40 rounded-2xl bg-slate-200" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
            <div className="h-6 w-40 rounded bg-slate-200" />
            <div className="mx-auto mt-8 grid max-w-xs grid-cols-4 gap-3">
              {Array.from({ length: 20 }, (_, index) => (
                <div key={index} className="h-16 rounded-xl bg-slate-200" />
              ))}
            </div>
          </div>
          <div className="h-80 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
            <div className="h-6 w-32 rounded bg-slate-200" />
            <div className="mt-6 h-20 rounded bg-slate-100" />
            <div className="mt-6 h-12 rounded bg-slate-200" />
          </div>
        </div>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="rounded-2xl bg-red-50 p-6 text-center shadow-sm ring-1 ring-red-200">
        <h1 className="text-lg font-bold text-red-900">Could not load seats</h1>
        <p className="mt-2 text-sm text-red-700">{loadError}</p>
        <button type="button" onClick={() => window.location.reload()} className="mt-4 min-h-11 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">
          Try again
        </button>
      </section>
    );
  }

  return (
    <section className="pb-28 lg:pb-0">
      {bus && (
        <header className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1 bg-red-600" />
          <div className="p-5 sm:p-7">
            <p className="text-xs font-bold uppercase tracking-widest text-red-700">Your journey</p>
            <h1 className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              <span className="break-words">{bus.origin}</span>
              <span aria-label="to" className="text-red-600">&rarr;</span>
              <span className="break-words">{bus.destination}</span>
            </h1>
            <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{bus.bus_name}</p>
                <p className="mt-1 text-sm text-slate-500">Bus no. {bus.number || bus.bus_number}</p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <p className="font-semibold text-slate-700">{bus.start_time} &ndash; {bus.reach_time}</p>
                <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                  {seats.filter((seat) => !seat.is_booked).length} seats available
                </span>
              </div>
            </div>
          </div>
        </header>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Choose your seats</h2>
              <p className="mt-1 text-sm text-slate-500">Tap an available seat to select it.</p>
            </div>
            {fare > 0 && (
              <p className="text-right text-sm text-slate-500">
                <span className="block text-lg font-bold text-slate-900">₹{fare.toFixed(2)}</span>
                per seat
              </p>
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-y border-slate-100 py-4 text-xs font-medium text-slate-600" aria-label="Seat status legend">
            <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="h-4 w-4 rounded border border-slate-300 bg-white" />Available</span>
            <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="h-4 w-4 rounded bg-red-600" />Selected</span>
            <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="h-4 w-4 rounded border border-slate-200 bg-slate-200" />Booked</span>
          </div>
          {seats.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center">
              <p className="font-semibold text-slate-900">No seats have been added for this bus.</p>
              <p className="mt-1 text-sm text-slate-500">Please choose another bus or try again later.</p>
            </div>
          ) : (
            <div className="mx-auto mt-6 max-w-sm rounded-[2rem] border-2 border-slate-200 bg-slate-50 px-3 py-5 sm:px-5 sm:py-6">
              <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Front of bus</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Driver</span>
                  <svg width="27" height="27" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <circle cx="16" cy="16" r="12" /><circle cx="16" cy="16" r="3" />
                    <path d="m13 16-8-3m14 3 8-3m-11 6v9" />
                  </svg>
                </div>
              </div>
              <div className="mb-3 grid grid-cols-[1fr_1fr_1.5rem_1fr_1fr] gap-2 text-center text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                <span className="col-span-2">Window side</span>
                <span aria-label="Aisle">&darr;</span>
                <span className="col-span-2">Window side</span>
              </div>
              <div className="space-y-3">
                {seatRows.map((row) => (
                  <div key={row.rowNumber} className="grid grid-cols-[1fr_1fr_1.5rem_1fr_1fr] items-center gap-2">
                    {row.seats.map(renderSeat)}
                    <span style={{ gridColumnStart: 3, gridRowStart: 1 }} className="text-center text-[10px] font-medium text-slate-500" aria-label={`Row ${row.rowNumber}`}>{row.rowNumber}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-center text-[10px] font-semibold uppercase tracking-widest text-slate-500">Rear of bus</p>
            </div>
          )}
          <p className="mt-5 text-center text-xs leading-5 text-slate-500">Tap a selected seat again to remove it.</p>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-6" aria-labelledby="fare-summary-title">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <h2 id="fare-summary-title" className="text-lg font-bold text-slate-900">Booking summary</h2>
            <p className="mt-1 text-sm text-slate-500">Your seats and fare, at a glance.</p>
          </div>
          <div className="p-5 sm:p-6">
            <div aria-live="polite" aria-atomic="true">
              <p className="flex items-center justify-between text-sm font-semibold text-slate-700">
                <span>Selected seats</span>
                <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-red-700">{selectedSeats.length}</span>
              </p>
              {selectedSeats.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <span key={seat.id} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{seat.seat_number}</span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">Select your seats on the map to see your fare.</p>
              )}
              <dl className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-500">Fare per seat</dt>
                  <dd className="font-semibold text-slate-900">{fare > 0 ? `₹${fare.toFixed(2)}` : "Not available"}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-500">Number of seats</dt>
                  <dd className="font-semibold text-slate-900">{selectedSeats.length}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <dt className="font-bold text-slate-900">Total fare</dt>
                  <dd className="text-2xl font-bold tracking-tight text-slate-900">{fare > 0 ? `₹${totalPrice.toFixed(2)}` : "—"}</dd>
                </div>
              </dl>
            </div>
            <button
              type="button"
              disabled={selectedSeatIds.length === 0 || isBooking}
              onClick={handleBookSeats}
              className="mt-6 hidden min-h-12 w-full items-center justify-center rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 lg:inline-flex"
            >
              {isBooking ? "Booking..." : "Book selected seats"}
            </button>
            <p className="mt-3 text-xs leading-5 text-slate-500">Review your seat selection before booking.</p>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(15,23,42,0.08)] lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="min-w-0" aria-live="polite" aria-atomic="true">
            <p className="text-xs text-slate-500">{selectedSeats.length} seat{selectedSeats.length === 1 ? "" : "s"} selected</p>
            <p className="mt-0.5 text-xl font-bold text-slate-900">{fare > 0 ? `₹${totalPrice.toFixed(2)}` : "Fare unavailable"}</p>
          </div>
          <button
            type="button"
            disabled={selectedSeatIds.length === 0 || isBooking}
            onClick={handleBookSeats}
            className="min-h-12 shrink-0 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
          >
            {isBooking ? "Booking..." : "Book seats"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default BusSeats;
