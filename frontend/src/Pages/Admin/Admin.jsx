import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./Admin.css";

const Admin = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterName, setFilterName] = useState("");
  
  // Pagination states
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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
      setFilteredReservations(data.reservations);
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

  // Get unique years from reservations
  const getAvailableYears = () => {
    const years = new Set();
    reservations.forEach((reservation) => {
      if (reservation.date) {
        const year = new Date(reservation.date).getFullYear();
        years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  // Filter reservations based on selected criteria
  useEffect(() => {
    let filtered = [...reservations];

    // Filter by year
    if (filterYear) {
      filtered = filtered.filter((reservation) => {
        if (!reservation.date) return false;
        const year = new Date(reservation.date).getFullYear();
        return year.toString() === filterYear;
      });
    }

    // Filter by month
    if (filterMonth) {
      filtered = filtered.filter((reservation) => {
        if (!reservation.date) return false;
        const month = new Date(reservation.date).getMonth() + 1; // getMonth() returns 0-11
        return month.toString() === filterMonth;
      });
    }

    // Filter by date
    if (filterDate) {
      filtered = filtered.filter((reservation) => {
        if (!reservation.date) return false;
        const reservationDate = new Date(reservation.date).toISOString().split('T')[0];
        return reservationDate === filterDate;
      });
    }

    // Filter by name
    if (filterName) {
      const searchTerm = filterName.toLowerCase();
      filtered = filtered.filter((reservation) => {
        const fullName = `${reservation.firstName} ${reservation.lastName}`.toLowerCase();
        return fullName.includes(searchTerm);
      });
    }

    setFilteredReservations(filtered);
  }, [reservations, filterYear, filterMonth, filterDate, filterName]);

  // Clear all filters
  const clearFilters = () => {
    setFilterYear("");
    setFilterMonth("");
    setFilterDate("");
    setFilterName("");
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredReservations.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedReservations = filteredReservations.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterYear, filterMonth, filterDate, filterName, recordsPerPage]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle records per page change
  const handleRecordsPerPageChange = (e) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1);
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

      {/* Filters Section */}
      {reservations.length > 0 && (
        <div className="filters-container">
          <div className="filters-header">
            <h2>Filters</h2>
            <button className="btn-clear-filters" onClick={clearFilters}>
              Clear All
            </button>
          </div>
          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="filter-year">Year</label>
              <select
                id="filter-year"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="filter-select"
              >
                <option value="">All Years</option>
                {getAvailableYears().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="filter-month">Month</label>
              <select
                id="filter-month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="filter-select"
              >
                <option value="">All Months</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="filter-date">Date</label>
              <input
                id="filter-date"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="filter-name">Name</label>
              <input
                id="filter-name"
                type="text"
                placeholder="Search by name..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="filter-input"
              />
            </div>
          </div>
          <div className="filter-results-row">
            <div className="filter-results-count">
              Showing {filteredReservations.length} of {reservations.length} reservations
            </div>
            <div className="records-per-page-group">
              <label htmlFor="records-per-page">Records per page:</label>
              <select
                id="records-per-page"
                value={recordsPerPage}
                onChange={handleRecordsPerPageChange}
                className="records-per-page-select"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="no-reservations">
          <p>No reservations found</p>
        </div>
      ) : filteredReservations.length === 0 ? (
        <div className="no-reservations">
          <p>No reservations match the selected filters</p>
          <button className="btn-clear-filters" onClick={clearFilters} style={{ marginTop: '10px' }}>
            Clear Filters
          </button>
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
              {paginatedReservations.map((reservation) => (
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
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <div className="pagination-info">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredReservations.length)} of {filteredReservations.length} entries
              </div>
              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                <div className="pagination-pages">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          className={`pagination-page-btn ${currentPage === page ? 'active' : ''}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="pagination-ellipsis">...</span>;
                    }
                    return null;
                  })}
                </div>
                
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;

