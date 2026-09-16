export const getCountry = async function (lat, lng) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
  );

  if (!response.ok) {
     return `Great Choice !`
  }

  const data = await response.json();

  return data.address.country;
};
