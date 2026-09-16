import BookingPage from "../ui/Booking/BookingPage"
import BookingProvider from "../features/contexts/BookingProvider";
function Booking() {
    return (
        <BookingProvider>
            <BookingPage />
        </BookingProvider>
    )
}

export default Booking
