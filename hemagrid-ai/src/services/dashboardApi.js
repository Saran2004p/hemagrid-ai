const API =
  "http://localhost:5000";

export async function
getDashboardStats() {

  const response =
    await fetch(
      `${API}/api/dashboard`
    );

  return response.json();
}