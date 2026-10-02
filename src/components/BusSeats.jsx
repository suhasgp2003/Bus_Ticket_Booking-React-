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
        disabled={seat.is_booked || isBooking}
        onClick={() => toggleSeat(seat.id)}
        className={`min-h-14 rounded-lg px-2 py-3 text-xs font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm ${
          seat.is_booked
            ? "cursor-not-allowed bg-red-500 opacity-100"
            : isSelected
              ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
        }`}
        style={{ gridColumnStart: getGridColumn(seat) }}
        title={`${seat.seat_number} — ${seat.seat_type || "seat"}`}
      >
        <span className="block text-[10px] font-medium uppercase opacity-80">Seat</span>
        <span>{seat.seat_number}</span>
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
      <section className="animate-pulse">
        <div className="h-40 rounded-2xl bg-slate-200" />
        <div className="mt-7 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="h-6 w-28 rounded bg-slate-200" />
          <div className="mt-6 grid grid-cols-5 gap-3">
            {Array.from({ length: 20 }, (_, index) => (
              <div key={index} className="col-span-1 h-14 rounded-lg bg-slate-200 even:col-start-4" />
            ))}
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
        <button type="button" onClick={() => window.location.reload()} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Try again</button>
      </section>
    );
  }

  return (
    <section>
      {bus && (
        <div className="mb-7 rounded-2xl bg-slate-900 p-4 text-white shadow-lg sm:p-6">
          <p className="text-sm font-semibold text-blue-200">Choose your seat</p>
          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">{bus.bus_name}</h1>
              <p className="mt-1 text-slate-300">Bus no. {bus.number || bus.bus_number}</p>
            </div>
            <p className="text-sm font-medium text-slate-200">{bus.start_time} - {bus.reach_time}</p>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm font-semibold sm:flex-nowrap sm:gap-3">
            <span className="break-words">{bus.origin}</span>
            <span className="h-px min-w-6 flex-1 bg-slate-600" />
            <span className="break-words">{bus.destination}</span>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">
        <div className="mb-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-slate-900">Seat map</h2>
          <div className="flex flex-wrap gap-3 text-xs font-medium text-slate-600">
            <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-green-600" />Available</span>
            <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-blue-600" />Selected</span>
            <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-red-500" />Booked</span>
          </div>
        </div>
        {seats.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <p className="font-semibold text-slate-900">No seats have been added for this bus.</p>
            <p className="mt-1 text-sm text-slate-500">Please choose another bus or try again later.</p>
          </div>
        ) : (
          <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-5">
            <div className="mb-5 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span>Front of bus</span>
              <span className="rounded-lg bg-slate-800 px-3 py-2 text-white">Driver</span>
            </div>
            <div className="mb-2 grid grid-cols-[1fr_1fr_2rem_1fr_1fr] gap-2 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              <span className="col-span-2">Window</span>
              <span>Aisle</span>
              <span className="col-span-2">Window</span>
            </div>
            <div className="space-y-2">
              {seatRows.map((row) => (
                <div key={row.rowNumber} className="grid grid-cols-[1fr_1fr_2rem_1fr_1fr] items-center gap-2">
                  {row.seats.map(renderSeat)}
                  <span className="col-start-3 text-center text-xs font-semibold text-slate-400">{row.rowNumber}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {selectedSeats.length} seat{selectedSeats.length === 1 ? "" : "s"} selected
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {selectedSeats.length > 0
                ? `Seats: ${selectedSeats.map((seat) => seat.seat_number).join(", ")}`
                : "Choose one or more available seats."}
              {fare > 0 && ` Total: ₹${totalPrice.toFixed(2)}`}
            </p>
          </div>
          <button
            type="button"
            disabled={selectedSeatIds.length === 0 || isBooking}
            onClick={handleBookSeats}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isBooking ? "Booking..." : "Book selected seats"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default BusSeats;
