import axios from "axios";

const API_BASE = "https://hemagrid-backend-env.eba-zutpubgp.us-east-1.elasticbeanstalk.com";

export async function
getForecast() {

  const response =
    await axios.get(
  `${API_BASE}/api/forecast`
);

  return response.data;
}