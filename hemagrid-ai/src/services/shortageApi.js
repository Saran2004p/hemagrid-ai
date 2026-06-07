import axios from "axios";

const API_BASE = "http://hemagrid-backend-env.eba-zutpubgp.us-east-1.elasticbeanstalk.com";

export async function
getShortages() {

  const response =
    await axios.get(
  `${API_BASE}/api/shortages`
);
  return response.data;
}