import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const BusSeats = ({ token }) => {
  const [bus, setBus] = useState(null);
  const [seats, setSeats] = useState([]);
  const [bookingSeatId, setBookingSeatId] = useState(null);
  const { busId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/buses/${busId}/`);
        setBus(response.data);
        setSeats(response.data.seats || []);
      } catch (error) {
        console.log("Error fetching bus details:", error);
      }
    };

    fetchBusDetails();
  }, [busId]);

  const handleBookSeat = async (seatId) => {
    if (!token) {
      alert("Please login to book a seat.");
      navigate("/login");
      return;
    }

    const seat = seats.find((item) => item.id === seatId);
    if (seat?.is_booked || bookingSeatId !== null) return;

    setBookingSeatId(seatId);
    try {
      await axios.post(
        "http://localhost:8000/api/booking/",
        { seat: seatId },
        { headers: { Authorization: `Token ${token}` } },
      );
      setSeats((currentSeats) =>
        currentSeats.map((item) =>
          item.id === seatId ? { ...item, is_booked: true } : item,
        ),
      );
      alert("Seat booked successfully!");
    } catch (error) {
      alert(error.response?.data?.error || "Booking failed. Please try again.");
    } finally {
      setBookingSeatId(null);
    }
  };

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
            <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-red-500" />Booked</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
          {seats.map((seat) => (
            <button
              key={seat.id}
              type="button"
              disabled={seat.is_booked || bookingSeatId !== null}
              onClick={() => handleBookSeat(seat.id)}
              className={`min-h-12 rounded-lg px-2 py-3 text-xs font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 sm:px-3 sm:text-sm ${
                seat.is_booked
                  ? "cursor-not-allowed bg-red-500 opacity-100"
                  : bookingSeatId === seat.id
                    ? "cursor-wait bg-amber-500"
                    : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
              }`}
            >
              {seat.is_booked
                ? `Seat ${seat.seat_number} - Booked`
                : bookingSeatId === seat.id
                  ? "Booking..."
                  : `Seat ${seat.seat_number}`}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusSeats;
