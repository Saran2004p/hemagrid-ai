import {
  useEffect,
  useState,
} from "react";

export default function DonorMemory() {

  const [donors,
    setDonors] =
      useState([]);

  useEffect(() => {

    fetch("https://hemagrid-backend-env.eba-zutpubgp.us-east-1.elasticbeanstalk.com/api/donor-memory")
      .then(
        res => res.json()
      )
      .then(
        setDonors
      );

  }, []);

  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Donor Memory Dashboard
      </h1>

      {donors.map(
        donor => (

          <div
            key={
              donor.donorId
            }
            className="
              bg-white
              p-4
              rounded-lg
              shadow
              mb-3
            "
          >

            <h3 className="font-bold">
              {donor.name}
            </h3>

            <p>
              Response Rate:
              {" "}
              {donor.responseRate}%
            </p>

            <p>
              Total Requests:
              {" "}
              {donor.totalRequests}
            </p>

          </div>
        )
      )}

    </div>
  );
}