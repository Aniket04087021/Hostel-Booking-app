import React, { useState } from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Reservation = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // ✅ Use environment variable (Best Practice)
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://hostel-booking-app-3.onrender.com/api/v1";

  const handleReservation = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to make a reservation");
      navigate("/login");
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/reservation/send`,
        { date, time },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setTime("");
      setDate("");
      navigate("/success");
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        toast.error("Please login to make a reservation");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  if (loading) {
    return (
      <section className="reservation" id="reservation">
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="reservation" id="reservation">
        <div className="container">
          <div className="banner">
            <img src="/reservation.png" alt="res" />
          </div>
          <div className="banner">
            <div className="reservation_form_box">
              <h1>MAKE A RESERVATION</h1>
              <p>Please login to make a reservation</p>
              <button onClick={() => navigate("/login")} style={{ marginTop: "20px" }}>
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="reservation" id="reservation">
      <div className="container">
        <div className="banner">
          <img src="/reservation.png" alt="res" />
        </div>
        <div className="banner">
          <div className="reservation_form_box">
            <h1>MAKE A RESERVATION</h1>
            <p>Welcome, {user.firstName}! Select your preferred date and time.</p>
            <form onSubmit={handleReservation}>
              <div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
              <div style={{ marginTop: "10px", fontSize: "0.9rem", color: "#666" }}>
                <p>Reservation will be made for:</p>
                <p><strong>{user.firstName} {user.lastName}</strong></p>
                <p>{user.email} | {user.phone}</p>
              </div>
              <button type="submit">
                RESERVE NOW{" "}
                <span>
                  <HiOutlineArrowNarrowRight />
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reservation;
