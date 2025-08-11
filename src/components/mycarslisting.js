import React, { useState, useEffect } from "react";
import mylistingcar_icon from "../assets/images/mylistingcar_icon.png";
import "../assets/styles/mycarslisting.css";
import { Radio, Select, Button, Pagination, Tag } from "antd";
import mylistingcard_icon from "../assets/images/mylistingcard_icon.png";
import chat_icon from "../assets/images/chat_icon.svg";
import like_icon from "../assets/images/like_icon.svg";
import view_icon from "../assets/images/view_icon.svg";
import boost_icon from "../assets/images/boost_icon.svg";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { carAPI } from "../services/api";
import { handleApiResponse, handleApiError } from "../utils/apiUtils";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Option } = Select;

const Mycarslisting = () => {
  const [value, setValue] = useState("Active");
  const [filterStatus, setFilterStatus] = useState("Any");
  const navigate = useNavigate();

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [activeDropdownId, setActiveDropdownId] = useState(null);

  const baseURL = "http://192.168.2.68:5000/";

  const menuItemStyle = {
    padding: "8px 16px",
    fontSize: "14px",
    cursor: "pointer",
    color: "#333",
    hover: {
      backgroundColor: "#f5f5f5",
    },
  };

  const [carDetails, setCarDetails] = useState([]);
  const [loading, setLoading] = useState(false); // loading spinner
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [totalCount, setTotalCount] = useState(0);
  const [carDelete, setCarDelete] = useState(null);

  // Handle radio button change (Active/Drafts/Sold)
  const handleChange = (e) => {
    setValue(e.target.value);
    setPage(1); // reset page on status change
  };

  // Handle filter dropdown change (Pending Approval, Approved, All)
  const handleFilterChange = (val) => {
    setFilterStatus(val);
    setPage(1); // reset page on filter change
  };

  // Fetch cars when page, value (status), or filterStatus changes

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        let statusParam = "";

        if (value === "Active") {
          if (filterStatus === "Base") statusParam = "pending";
          else if (filterStatus === "Sport") statusParam = "approved";
          else statusParam = "any";
        } else if (value === "Drafts") {
          statusParam = "drafts";
        } else if (value === "Sold") {
          statusParam = "sold";
        }

        const response = await carAPI.getMylistingCars({
          page,
          limit,
          status: statusParam,
        });

        const cardetail = handleApiResponse(response);
       

        // Map the status to the correct key in the response
        if (
          statusParam === "pending" ||
          statusParam === "approved" ||
          statusParam === "any"
        ) {
          setCarDetails(cardetail.data.approved_pending || []);
          setTotalCount(cardetail.data.total || 0); // 👈 Set total count
        } else if (statusParam === "drafts") {
          setCarDetails(cardetail.data.draft || []);
          setTotalCount(cardetail.data.total || 0); // 👈 Same here
        } else if (statusParam === "sold") {
          setCarDetails(cardetail.data.sold || []);
          setTotalCount(cardetail.data.total || 0); // 👈 Same here
        } else {
          setCarDetails([]);
          setTotalCount(0);
        }

        message.success(cardetail.message || "Fetched successfully");
      } catch (error) {
        const errorData = handleApiError(error);
        message.error(errorData.message || "Failed to load car data");
        setCarDetails([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, [page, limit, value, filterStatus]);

  const handleDeleteMethod = async (carId) => {
    
    try {
      setLoading(true);
      const response = await carAPI.deleteCar(carId);
      const cardetail = handleApiResponse(response);
      if (cardetail?.data) {
        setCarDelete(cardetail.data);
      }
      message.success(cardetail.message || "Fetched successfully");
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to delete car data");
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div>
      {/* Blue header section */}
      <div
        style={{
          background: "#008ad5",
          color: "#fff",
          padding: "32px 0 16px 0",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 35px" }}>
          <h2 style={{ margin: 0 }}>My Listings</h2>
          <p style={{ margin: 0 }}>Post an ad in just 3 simple steps</p>
        </div>
      </div>

      {/* Car image section */}
      <div className="mylisting-car-image-container">
        <div>
          <h1
            style={{
              top: 55,
              left: 35,
              color: "#fff",
              fontSize: 40,
              fontWeight: 700,
              width: 355,
            }}
          >
            Subscribe To Our Packages
          </h1>
          <button
            style={{
              top: 20,
              left: 35,
              background: "#008ad500",
              color: "#fff",
              borderRadius: 22,
              border: "1px solid #fff",
              padding: "10px 20px",
            }}
          >
            Subscribe
          </button>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          marginTop: 35,
          marginLeft: 35,
          marginRight: 25,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <Radio.Group
          onChange={handleChange}
          value={value}
          style={{ display: "flex", gap: "10px" }}
        >
          {["Active", "Drafts", "Sold"].map((status) => (
            <Radio.Button
              key={status}
              value={status}
              className="custom-radio-button"
              style={{
                width: 75,
                textAlign: "center",
                borderRadius: "4px",
                color: value === status ? "#D67900" : "#000",
                fontSize: "14px",
                fontWeight: value === status ? "700" : "400",
                borderColor: "#fff",
                backgroundColor: value === status ? "#FFEDD5" : undefined,
              }}
            >
              {status}
            </Radio.Button>
          ))}
        </Radio.Group>

        {value === "Active" && (
          <Select
            value={filterStatus}
            style={{ minWidth: 140, borderColor: "#fff" }}
            onChange={handleFilterChange}
          >
            <Option value="Any">All</Option>
            <Option value="Base">Pending Approval</Option>
            <Option value="Sport">Approved</Option>
          </Select>
        )}
      </div>

      <div style={{ padding: "20px" }}>
        {/* Loading and empty states */}
        {loading ? (
          <p>Loading cars...</p>
        ) : carDetails.length === 0 ? (
          <p>No cars found.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(308px, 1fr))",
              gap: "20px",
              justifyContent: "center",
            }}
          >
            {carDetails?.map((car) => {
              return (
                <div
                  key={car.id}
                  style={{
                    border: "1px solid #eee",
                    borderRadius: "8px",
                    padding: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    backgroundColor: "#fff",
                    width: "308px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", gap: "12px" }}>
                    <img
                      src={
                        car.image
                          ? `${baseURL}${car.image}`
                          : mylistingcard_icon
                      }
                      alt="car"
                      style={{
                        width: 137,
                        height: value === "Active" ? "144px" : "109px",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginTop: "10px",
                          marginRight: "10px",
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            fontSize: "18px",
                            fontWeight: 700,
                          }}
                        >
                          {car.ad_title}
                        </h3>
                        <div style={{ position: "relative" }}>
                          {value === "Active" && (
                            <button
                              onClick={() =>
                                setActiveDropdownId(
                                  activeDropdownId === car.id ? null : car.id
                                )
                              }
                              style={{
                                height: "20px",
                                width: "20px",
                                background: "transparent",
                                border: "none",
                                padding: 0,
                                marginLeft: "auto",
                                cursor: "pointer",
                              }}
                            >
                              <HiOutlineDotsVertical />
                            </button>
                          )}

                          {/* Dropdown - Only show for active card */}
                          {activeDropdownId === car.id && (
                            <div
                              style={{
                                position: "absolute",
                                top: "35px",
                                right: "12px",
                                backgroundColor: "#fff",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                borderRadius: "6px",
                                padding: "8px 0",
                                zIndex: 10,
                                width: "150px",
                              }}
                            >
                              <div
                                style={menuItemStyle}
                                onClick={() => {
                                  setActiveDropdownId(null);
                                }}
                              >
                                Delete listing
                              </div>
                              <div
                                style={menuItemStyle}
                                onClick={() => {
                                  setActiveDropdownId(null);
                                }}
                              >
                                Edit listing
                              </div>
                              <div
                                style={menuItemStyle}
                                onClick={() => {
                                  // Mark as sold action
                                  setActiveDropdownId(null);
                                }}
                              >
                                Mark as sold
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        style={{
                          color: "#D67900",
                          fontWeight: 700,
                          fontSize: "16px",
                          marginTop: "4px",
                        }}
                      >
                        {"$" + car.price}
                      </div>
                      <Tag
                        color={
                          value === "Active" && filterStatus === "Sport"
                            ? "#A4F4E7"
                            : value === "Active" && filterStatus === "Base"
                            ? "#ffe0b3"
                            : value === "Sold"
                            ? "#A4F4E7"
                            : "#ffe0b3"
                        }
                        style={{
                          color:
                            value === "Active" && filterStatus === "Sport"
                              ? "green"
                              : value === "Active" && filterStatus === "Base"
                              ? "#d67a00"
                              : value === "Sold"
                              ? "green"
                              : "#d67a00",
                          marginTop: "6px",
                          display: "inline-block",
                          fontSize: "14px",
                          fontWeight: 700,
                        }}
                      >
                        {value === "Active" && filterStatus === "Sport"
                          ? "Active"
                          : value === "Active" && filterStatus === "Base"
                          ? "Pending Approval"
                          : value === "Sold"
                          ? "Sold"
                          : car.status}
                      </Tag>
                      {value === "Active" && filterStatus === "Sport" && (
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            backgroundColor: "#D67900",
                            borderRadius: "14px",
                            height: "30px",
                            marginTop: "10px",
                            marginRight: "10px",
                            alignItems: "center", // Center vertically
                            justifyContent: "center", // Center horizontally
                          }}
                        >
                          <span
                            style={{
                              color: "#fff",
                              fontSize: "14px",
                              fontWeight: 600,
                            }}
                          >
                            {"Boost"}
                          </span>
                          <img
                            src={boost_icon}
                            alt="boost"
                            style={{
                              width: "13px",
                              height: "13px",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Bottom section: date + buttons */}
                  <div>
                    <div
                      style={{
                        marginTop: "10px",
                        color: "#008ad5",
                        fontSize: "14px",
                        fontWeight: 400,
                      }}
                    >
                      {car.updated_at}
                    </div>
                    <div
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "10px",
                      }}
                    >
                      {value === "Drafts" ? (
                        <>
                          <Button
                            type="default"
                            style={{
                              flex: 1,
                              backgroundColor: "#fff",
                              borderColor: "#008ad5",
                              borderRadius: "18px",
                              color: "#008ad5",
                              fontSize: "14px",
                              fontWeight: 600,
                            }}
                          >
                            Delete
                          </Button>
                          <Button
                            type="primary"
                            style={{
                              flex: 1,
                              backgroundColor: "#008ad5",
                              borderColor: "#008ad5",
                              borderRadius: "18px",
                              color: "#fff",
                              fontSize: "14px",
                              fontWeight: 600,
                            }}
                          >
                            Post
                          </Button>
                        </>
                      ) : value === "Sold" ? (
                        <>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <span
                              style={{
                                color: "#003958",
                                fontSize: "14px",
                                fontWeight: 400,
                              }}
                            >
                              <img src={chat_icon} alt="chat" />0 Chat
                            </span>
                          </div>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <span
                              style={{
                                color: "#003958",
                                fontSize: "14px",
                                fontWeight: 400,
                              }}
                            >
                              <img src={like_icon} alt="like" />0 Like
                            </span>
                          </div>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <span
                              style={{
                                color: "#003958",
                                fontSize: "14px",
                                fontWeight: 400,
                              }}
                            >
                              <img src={view_icon} alt="view" />0 View
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Button
                            type="default"
                            danger
                            style={{
                              flex: 1,
                              backgroundColor: "#fff",
                              borderColor: "#008ad5",
                              borderRadius: "18px",
                              color: "#008ad5",
                              fontSize: "14px",
                              fontWeight: 600,
                            }}
                            onClick={() => handleDeleteMethod(car.id)}
                          >
                            Delete
                          </Button>
                          <Button
                            type="primary"
                            style={{
                              flex: 1,
                              backgroundColor: "#008ad5",
                              borderColor: "#008ad5",
                              borderRadius: "18px",
                              color: "#fff",
                              fontSize: "14px",
                              fontWeight: 600,
                            }}
                            onClick={
                              car.featured
                                ? () => navigate(`/carDetails/${car.id}`)
                                : undefined
                            }
                          >
                            Edit
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}

      {/* Centered Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 20,
          color: "#0A0A0B",
          borderradius: "4px",
        }}
      >
        <Pagination
          className="custom-pagination"
          current={page}
          total={totalCount || 50}
          pageSize={15}
          onChange={(newPage) => setPage(newPage)}
          showSizeChanger={false}
          itemRender={(page, type, originalElement) => {
            if (type === "prev") return <span>&lt;</span>;
            if (type === "next") return <span>&gt;</span>;
            return originalElement;
          }}
        />
      </div>
    </div>
  );
};

export default Mycarslisting;
