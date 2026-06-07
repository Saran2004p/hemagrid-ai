import axios from "axios";

export async function
getForecast() {

  const response =
    await axios.get(
      "http://localhost:5000/api/forecast"
    );

  return response.data;
}