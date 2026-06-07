import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

export default function DonorDashboard() {
  const navigate = useNavigate();

  const [donor, setDonor] = useState(null);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("available");
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [declinedRequests, setDeclinedRequests] = useState([]);
  const [acceptedId, setAcceptedId] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem("bloodbridge_donor");

    if (!session) {
      navigate("/donor-auth");
      return;
    }

    setDonor(JSON.parse(session));

    const fetchRequests = async () => {
      const snapshot = await getDocs(collection(db, "bloodRequests"));

      const allRequests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const matchedRequests = allRequests.filter(
        (request) => request.bloodType === JSON.parse(session).bloodType,
      );

      const donorPhone = JSON.parse(session).phone;

      const accepted = matchedRequests.filter((request) =>
        request.acceptedDonors?.some((d) => d.donorPhone === donorPhone),
      );

      const available = matchedRequests.filter(
        (request) =>
          !request.acceptedDonors?.some((d) => d.donorPhone === donorPhone),
      );

      setAcceptedRequests(accepted);
      setRequests(available);
    };

    fetchRequests();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("bloodbridge_donor");
    navigate("/donor-auth");
  };

  const handleAccept = async (request) => {
    if (!donor) return;

    setAcceptedId(request.id);

    await updateDoc(doc(db, "bloodRequests", request.id), {
      acceptedDonors: arrayUnion({
        donorName: donor.name,
        donorPhone: donor.phone,
        donorBloodType: donor.bloodType,
        acceptedAt: new Date(),
      }),
    });

    setTimeout(() => {
      setAcceptedRequests((prev) => [...prev, request]);

      setRequests((prev) => prev.filter((r) => r.id !== request.id));

      setAcceptedId(null);
    }, 700);
  };

  const handleDecline = (request) => {
    setDeclinedRequests((prev) => [...prev, request]);

    setRequests((prev) => prev.filter((r) => r.id !== request.id));
  };

  const handleAcceptAgain = async (request) => {
    await handleAccept(request);

    setDeclinedRequests((prev) => prev.filter((r) => r.id !== request.id));
  };

  if (!donor) return null;

  const maskPhoneNumber = (phone = "") => {
    return `+91 XXXXXXX${phone.slice(-3)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-red-100">
          <div>
            <h1 className="text-5xl font-black tracking-tight text-gray-900">
              Welcome, {donor.name}
            </h1>

            <p className="text-gray-500 mt-2">
              Blood Group: {donor.bloodType} • {donor.city}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-5 py-2 rounded-xl"
          >
            Logout
          </button>
        </div>

        <div className="rounded-2xl border p-8 bg-white shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">
            Blood Requests Near You
          </h2>

          {/* Tabs */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setActiveTab("available")}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === "available"
                  ? "bg-red-600 text-white"
                  : "bg-white border text-gray-600 hover:shadow-md"
              }`}
            >
              Available
            </button>

            <button
              onClick={() => setActiveTab("accepted")}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === "accepted"
                  ? "bg-red-600 text-white"
                  : "bg-white border text-gray-600 hover:shadow-md"
              }`}
            >
              Accepted
            </button>

            <button
              onClick={() => setActiveTab("declined")}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === "declined"
                  ? "bg-red-600 text-white"
                  : "bg-white border text-gray-600 hover:shadow-md"
              }`}
            >
              Declined
            </button>
          </div>

          {/* AVAILABLE TAB */}
          {activeTab === "available" &&
            (requests.length === 0 ? (
              <p className="text-gray-500">No blood requests found.</p>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className={`bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-red-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ${
                      acceptedId === request.id
                        ? "bg-red-50 scale-95 opacity-70"
                        : "bg-white"
                    }`}
                  >
                    <h3 className="text-xl font-bold">
                      {request.contactPerson}
                    </h3>

                    <p className="text-gray-500 text-sm">
                      {maskPhoneNumber(request.contactPhone)}
                    </p>

                    <p className="mt-2 text-gray-600">
                      Hospital: {request.hospital}
                    </p>

                    <p className="text-gray-500 text-sm">
                      City: {request.city}
                    </p>

                    <p className="text-gray-500 text-sm">
                      Blood Group: {request.bloodType}
                    </p>

                    <div className="mt-3">
                      {request.urgency === "critical" ? (
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                          🚨 Urgent — Needed within hours
                        </span>
                      ) : request.urgency === "planned" ? (
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                          📅 Planned — {request.requiredDate}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex gap-3 mt-5">
                      <button
                        onClick={() => handleAccept(request)}
                        className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-3 rounded-2xl hover:scale-105 hover:shadow-xl transition-all duration-300"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => handleDecline(request)}
                        className="bg-gray-100 px-5 py-2 rounded-xl"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}

          {/* ACCEPTED TAB */}
          {activeTab === "accepted" &&
            (acceptedRequests.length === 0 ? (
              <p className="text-gray-500">No accepted requests yet.</p>
            ) : (
              <div className="space-y-4">
                {acceptedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-red-100"
                  >
                    <h3 className="text-xl font-bold">
                      {request.contactPerson}
                    </h3>

                    <p className="text-gray-600 mt-2">{request.contactPhone}</p>

                    <p className="text-gray-500 text-sm mt-2">
                      Hospital: {request.hospital}
                    </p>

                    <p className="text-gray-500 text-sm">
                      City: {request.city}
                    </p>

                    <p className="text-gray-500 text-sm">
                      Blood Group: {request.bloodType}
                    </p>

                    <div className="mt-3">
                      {request.urgency === "critical" ? (
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                          🚨 Urgent — Needed within hours
                        </span>
                      ) : request.urgency === "planned" ? (
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                          📅 Planned — {request.requiredDate}
                        </span>
                      ) : null}
                    </div>

                    <span className="inline-block mt-4 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                      Accepted ✓
                    </span>
                  </div>
                ))}
              </div>
            ))}

          {/* DECLINED TAB */}
          {activeTab === "declined" &&
            (declinedRequests.length === 0 ? (
              <p className="text-gray-500">No declined requests yet.</p>
            ) : (
              <div className="space-y-4">
                {declinedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-red-100"
                  >
                    <h3 className="text-xl font-bold">
                      {request.contactPerson}
                    </h3>

                    <p className="text-gray-500 text-sm mt-2">
                      Hospital: {request.hospital}
                    </p>

                    <p className="text-gray-500 text-sm">
                      City: {request.city}
                    </p>

                    <p className="text-gray-500 text-sm">
                      Blood Group: {request.bloodType}
                    </p>

                    <div className="mt-3">
                      {request.urgency === "critical" ? (
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                          🚨 Urgent — Needed within hours
                        </span>
                      ) : request.urgency === "planned" ? (
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                          📅 Planned — {request.requiredDate}
                        </span>
                      ) : null}
                    </div>

                    <button
                      onClick={() => handleAcceptAgain(request)}
                      className="bg-red-600 text-white px-4 py-2 rounded-xl mt-4"
                    >
                      Accept Again
                    </button>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
