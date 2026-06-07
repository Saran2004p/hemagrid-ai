import axios from "axios";

export async function
getCampaigns() {

  const response =
    await axios.get(
      "http://localhost:5000/api/campaigns"
    );

  return response.data;
}