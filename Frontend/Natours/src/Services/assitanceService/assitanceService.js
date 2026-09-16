import axios from 'axios'

export async function createBookingQuery(data) {
  const response = await axios.post(`http://localhost:3001/api/v1/user/bookingQuery`, data, {
    withCredentials: true,
  });

  return response.data;
}

export async function getMyBookingQueries() {
  const response = await axios.get(
    `http://localhost:3001/api/v1/user/getAllMyBookingQuery`,
    {
      withCredentials: true,
    },
  );

  return response.data.data.queries;
}

export async function getMyBookingQuery(id) {
  const response = await axios.get(
    `http://localhost:3001/api/v1/user/getDetailedBookingQuery/${id}`,
    {
      withCredentials: true,
    },
  );

  return response.data.data.query;
}
