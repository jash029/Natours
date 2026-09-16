import axios from "axios";

export async function createMyBooking({ slug, formData }) {
  const { data } = await axios.post(
    `http://localhost:3001/api/v1/booking/create-my-booking/${slug}`,
    formData,
    {
      withCredentials: true,
    },
  );

  return data;
}

export async function getMyAllBookings() {
  const { data } = await axios.get(
    "http://localhost:3001/api/v1/booking/my-bookings",
    {
      withCredentials: true,
    },
  );

  return data.data.bookings;
}

export async function getMyBookingDetails(bookingNumber) {
  const { data } = await axios.get(
    `http://localhost:3001/api/v1/booking/detail-booking/${bookingNumber}`,
    {
      withCredentials: true,
    }
  );

  return data.data.booking;
}


///actually let's do ssection by section first i am giving you the data of booking that i ahve so you structure in 4 parts Tour / Travller / payment  /..and etc 