import {
  useEffect,
  useState
} from "react";

import {
  getExplanation
} from "../services/explainabilityApi";

export default function Explainability() {

  const [
    data,
    setData
  ] = useState(null);

  useEffect(() => {

    getExplanation({

      patientName:
        "Arun",

      city:
        "Hyderabad",

      bloodGroup:
        "O+",

      units: 2,

      urgency:
        "critical"

    })
    .then(setData);

  }, []);

  if (!data)
    return <p>Loading...</p>;

  return (

    <div className="p-8">

      <h1 className="text-4xl font-bold mb-8">
        AI Explainability
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="font-bold text-xl">
          Urgency Reason
        </h2>

        <p>
          {data.urgencyReason}
        </p>

      </div>

      <div className="mt-6">

        {data.selectedDonors.map(
          donor => (

            <div
              key={
                donor.donorId
              }
              className="bg-white p-6 rounded-xl shadow mb-4"
            >

              <h3 className="font-bold">
                {donor.donorName}
              </h3>

              <p>
                AI Score:
                {donor.aiScore}
              </p>

              <p>
                Response Probability:
                {
                  donor.responseProbability
                }%
              </p>

              <p>
                {
                  donor.explanation
                }
              </p>

            </div>
          )
        )}

      </div>

    </div>
  );
}