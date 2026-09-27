import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
                console.log('Error fetching bus details:', error);
            }
        };

        fetchBusDetails();
    }, [busId]);

    const handleBookSeat = async (seatId) => {
        if(!token){
            alert("Please login to book a seat.");
            navigate('/login');
            return;
        }
         const seat = seats.find((item) => item.id === seatId);
          if (seat?.is_booked || bookingSeatId !== null) {
    return;
  }
    setBookingSeatId(seatId);
        try {
            await axios.post(
                "http://localhost:8000/api/booking/",
                { seat: seatId },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
             setSeats((currentSeats) =>
      currentSeats.map((item) =>
        item.id === seatId ? { ...item, is_booked: true } : item
      )
    );

    alert("Seat booked successfully!");
  } catch (error) {
    alert(error.response?.data?.error || "Booking failed. Please try again.");
  } finally {
    setBookingSeatId(null);
  }
};

    return (
        <div>
            {bus && (
                <div>
                    <div>{bus.bus_name}</div>
                    <div>{bus.number}</div>
                    <div>{bus.origin}</div>
                    <div>{bus.destination}</div>
                    <div>{bus.start_time}</div>
                    <div>{bus.reach_time}</div>
                </div>
            )}
          <div>
  {seats.map((seat) => (
    <div key={seat.id}>
      <button
        type="button"
        disabled={seat.is_booked || bookingSeatId !== null}
        onClick={() => handleBookSeat(seat.id)}
        className={`rounded px-3 py-2 text-sm font-medium text-white ${
          seat.is_booked
            ? "cursor-not-allowed bg-red-500 opacity-60"
            : bookingSeatId === seat.id
              ? "cursor-wait bg-amber-500"
              : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {seat.is_booked
          ? `Seat ${seat.seat_number} — Booked`
          : bookingSeatId === seat.id
            ? "Booking…"
            : `Book seat ${seat.seat_number}`}
      </button>
    </div>
  ))}
</div>
        </div>
    );
};

export default BusSeats;
