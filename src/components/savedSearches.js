import React, { useState, useEffect } from "react";
import { Switch, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { userAPI } from "../services/api";
import { handleApiResponse, handleApiError } from "../utils/apiUtils";
import { message } from "antd";
import lamborgini from '../assets/images/lamborghini.png'


const savedSearchesData = [
  {
    id: 1,
    logo: "https://cdn-icons-png.flaticon.com/512/616/616494.png", // Lamborghini logo
    title: "Lamborghini",
    details: "$0 - 0$  •  From 2005",
    notify: true,
  },
  {
    id: 2,
    logo: "https://cdn-icons-png.flaticon.com/512/226/226595.png", // Mercedes logo
    title: "Mercedes - Benz",
    subtitle: "A-Class",
    details:
      "$6524 - 33556  •  From 2005  •  to 30,000 km  •  number of seats: 3-5  •  new",
    notify: false,
  },
  {
    id: 3,
    logo: "https://cdn-icons-png.flaticon.com/512/616/616494.png", // Lamborghini logo
    title: "Lamborghini",
    details: "$0 - 0$  •  From 2005",
    notify: true,
  },
];

const EmptyState = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      textAlign: "center",
    }}
  >
    <div
      style={{
        width: "64px",
        height: "64px",
        background: "#FFA500",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "16px",
      }}
    >
      <SearchOutlined style={{ fontSize: "32px", color: "#FFFFFF" }} />
    </div>
    <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "600" }}>
      No Saved Searches
    </h3>
    <p
      style={{
        margin: "0 0 24px 0",
        color: "#666",
        fontSize: "14px",
        maxWidth: "300px",
      }}
    >
      Run your searches again quickly
      <br />
      Get Notified about new cars
    </p>
    <Button type="primary" size="large" icon={<SearchOutlined />}>
      Start Searching
    </Button>
  </div>
);

const SavedSearches = () => {
  const [searches, setSearches] = useState(savedSearchesData);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);

  useEffect(() => {
    Allsavedsearches();
  }, []);

  const Allsavedsearches = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getFavorites({
        page,
        limit,
      });
      const newcars = handleApiResponse(response);
      console.log("API Response:", newcars?.data?.cars);
      if (newcars?.favorites) {
        setSearches(newcars.favorites);
      } else {
        setSearches([]);
      }
      message.success(newcars.message || "Fetched successfully");
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to load car data");
      setSearches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (id) => {
    setSearches((searches) =>
      searches.map((s) => (s.id === id ? { ...s, notify: !s.notify } : s))
    );
  };

  // ✅ Only return UI conditionally, hooks are above
  if (searches.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="saved-searches-main">
      <div className="saved-searches-header">Saved Searches</div>
      <div className="saved-searches-list">
        {searches.map((search) => (
          <div className="saved-search-item" key={search.id}>
            <div className="saved-search-info">
              <img
                src={search.car_image || lamborgini}
                alt="logo"
                className="saved-search-logo"
              />
              <div>
                <div className="saved-search-title">
                  {search.make + " - " + search.model}
                </div>
                {search.price && (
                  <div
                    className="saved-search-subtitle"
                    style={{
                      fontSize: "14",
                      fontWeight: "400",
                      color: "#0A0A0B",
                    }}
                  >
                    {"$" + search.price + " . From" + search.year}
                  </div>
                )}
                <div className="saved-search-details">{search.details}</div>
                <div
                  className="saved-search-notify-label"
                  style={{
                    fontSize: "16",
                    fontWeight: "600",
                    color: "#0A0A0B",
                  }}
                >
                  Get Notified about new offers.
                </div>
              </div>
            </div>
            <Switch
              checked={search.notify}
              onChange={() => handleToggle(search.id)}
              className="saved-search-switch"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedSearches;
