import axios from "axios";

const API_BASE = "http://hemagrid-backend-env.eba-zutpubgp.us-east-1.elasticbeanstalk.com";

export async function
getExplanation(
  donorId
) {

  const response =
    await axios.get(
  `${API_BASE}/api/explainability/${donorId}`
);

  return response.data;
}