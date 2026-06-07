import axios from "axios";

export async function
getExplanation(
  donorId
) {

  const response =
    await axios.get(

      `http://localhost:5000/api/explainability/${donorId}`
    );

  return response.data;
}