const API = "http://hemagrid-backend-env.eba-zutpubgp.us-east-1.elasticbeanstalk.com";

export async function
getDashboardStats() {

  const response =
    await fetch(
      `${API}/api/dashboard`
    );

  return response.json();
}