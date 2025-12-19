import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./Admin.css";

const Admin = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use environment variable or fallback to hosted backend
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://hostel-booking-app-3.onrender.com/api/v1";

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE_URL}/reservation/all`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setReservations(data.reservations);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch reservations");
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const { data } = await axios.patch(
        `${API_BASE_URL}/reservation/update/${id}`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      fetchReservations(); // Refresh the list
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update reservation");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "accepted":
        return "status-badge accepted";
      case "declined":
        return "status-badge declined";
      default:
        return "status-badge pending";
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading reservations...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard - Booking Requests</h1>
        <p>Manage all restaurant reservation requests</p>
      </div>

      {reservations.length === 0 ? (
        <div className="no-reservations">
          <p>No reservations found</p>
        </div>
      ) : (
        <div className="reservations-table-container">
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation._id}>
                  <td>
                    {reservation.firstName} {reservation.lastName}
                  </td>
                  <td>{reservation.email}</td>
                  <td>{reservation.phone}</td>
                  <td>
                    {reservation.date
                      ? new Date(reservation.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : reservation.date}
                  </td>
                  <td>{reservation.time}</td>
                  <td>
                    <span className={getStatusBadgeClass(reservation.status)}>
                      {reservation.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {reservation.status === "pending" && (
                        <>
                          <button
                            className="btn-accept"
                            onClick={() => handleStatusUpdate(reservation._id, "accepted")}
                          >
                            Accept
                          </button>
                          <button
                            className="btn-decline"
                            onClick={() => handleStatusUpdate(reservation._id, "declined")}
                          >
                            Decline
                          </button>
                        </>
                      )}
                      {reservation.status !== "pending" && (
                        <span className="action-completed">
                          {reservation.status === "accepted" ? "✓ Accepted" : "✗ Declined"}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;

