import axios from "axios";

export async function
getShortages() {

  const response =
    await axios.get(
      "http://localhost:5000/api/shortages"
    );

  return response.data;
}