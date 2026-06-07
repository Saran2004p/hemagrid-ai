import {
  useEffect,
  useState
} from "react";

import {
  getForecast
} from "../services/forecastApi";

export default function Forecast() {

  const [data,setData] =
    useState([]);

  useEffect(() => {

    getForecast()
      .then(setData);

  }, []);

  return (

    <div className="p-8">

      <h1 className="text-4xl font-bold mb-8">
        Blood Demand Forecast
      </h1>

      <div className="grid gap-4">

        {data.map(item => (

          <div
            key={item.bloodGroup}
            className="
              bg-white
              p-6
              rounded-xl
              shadow
            "
          >

            <h2 className="text-2xl font-bold">
              {item.bloodGroup}
            </h2>

            <p>
              Requests:
              {item.requests}
            </p>

            <p>
              Risk:
              {item.risk}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}