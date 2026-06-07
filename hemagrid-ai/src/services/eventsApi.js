const API =
  "http://localhost:5000";

export async function
getEvents() {

  const response =
    await fetch(
      `${API}/api/events`
    );

  return response.json();
}