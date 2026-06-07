import axios from "axios";

export async function
getCampaigns() {

  const response =
    axios.get("https://hemagrid-backend-env.eba-zutpubgp.us-east-1.elasticbeanstalk.com/api/campaigns")

  return response.data;
}