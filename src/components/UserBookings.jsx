import axios from "axios";
import { useEffect, useState } from "react";

const UserBookings = ({ token, userId }) => {
    const [bookings, setBookings] = useState([]);
    const [bookingError, setBookingError] = useState(null);
    useEffect(() => {
        const fetchBookings = async () => {
            if (!token || !userId) {
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:8000/api/user/${userId}/bookings/`,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
                console.log("Booking data:", response.data);
                setBookings(response.data);
                console.log("checking for user bookings:", response);
            } catch (error) {
                console.log("fetching details failed:", error);
                setBookingError(
                    error.response?.data?.detail ||
                    "Unable to load your bookings. Please try again."
                );
            }
        };

        fetchBookings();
    }, [userId, token]);

    return (
        <div>
            {bookingError && <p role="alert">{bookingError}</p>}
            {bookings.map((item) => {
                return (
                    <div key={item.id}>
                        {item.user}-
                        {item.bus}-
                        {item.seat}-
                        {item.booking_time}
                    </div>
                );
            })}
        </div>
    );
};

export default UserBookings;
