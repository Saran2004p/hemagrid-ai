const API = "https://hemagrid-backend-env.eba-zutpubgp.us-east-1.elasticbeanstalk.com";

export async function
getEvents() {

  const response =
    await fetch(
      `${API}/api/events`
    );

  return response.json();
}