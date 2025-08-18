import { useState, useEffect } from "react";
import "../assets/styles/usersavedsearches.css";
import carImage from "../assets/images/subscribecar_icon.png";
import diamondLogo from "../assets/images/bluediamond_icon.svg";
import dollarLogo from "../assets/images/bluedollar_icon.svg";
import like_icon from "../assets/images/like_icon.svg";
import { useNavigate } from "react-router-dom";
import diamondGif from "../assets/images/diamondGif.gif";
import { carAPI } from "../services/api";
import { handleApiResponse, handleApiError } from "../utils/apiUtils";
import { message } from "antd";

const UserSavedsearch = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedSearches, setSavedSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const tokendata = localStorage.getItem("token");
  const isLoggedIn = !!tokendata;

  useEffect(() => {
    if (isLoggedIn) {
      fetchSavedSearches();
    } else {
      messageApi.open({
        type: "error",
        content: "Please Log in/ Signup.",
      });
    }
  }, [isLoggedIn]);

  const fetchSavedSearches = async () => {
    try {
      const res = await carAPI.getsavedsearches(1, 10);
      const response = handleApiResponse(res);

      if (response?.data?.searches) {
        setSavedSearches(response.data.searches.slice(0, 3));
        messageApi.open({
          type: "success",
          content: response.data.message,
        });
      }
    } catch (error) {
      const errorData = handleApiError(error);
      // messageApi.open({
      //   type: "error",
      //   content: errorData.message || "Something went wrong.",
      // });
      setSavedSearches([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-saved-searches-wrapper">
      {contextHolder}
      <div className="Search-header">
        <h1
          style={{
            fontWeight: "700",
            fontSize: "32px",
            marginBottom: "24px",
            marginTop: "24px",
          }}
        >
          Your Saved Searches
        </h1>
        <a href="#" className="car-listing-seeall">
          See All
        </a>
      </div>

      <div className="user-saved-searches-top">
        <div className="user-saved-searches-left">
          {isLoggedIn ? (
            loading ? (
              <p>Loading saved searches...</p>
            ) : savedSearches.length > 0 ? (
              <div className="user-saved-searches-outer-card">
                {savedSearches.map((item, idx) => (
                  <div
                    className={`user-saved-search-section${
                      idx < savedSearches.length - 1 ? " with-divider" : ""
                    }`}
                    key={item.id}
                  >
                    <div className="user-saved-search-header">
                      <img
                        src={
                          item.make_image
                            ? `${process.env.REACT_APP_BASE_URL}${item.make_image}`
                            : carImage
                        }
                        alt={item.search_params?.make || "Car"}
                        className="user-saved-search-logo"
                      />
                      <div className="user-saved-search-title">
                        <span className="user-saved-search-brand">
                          {item.search_params?.make || "Unknown Make"}
                        </span>
                        {item.search_params?.model && (
                          <span className="user-saved-search-model">
                            {item.search_params.model}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="user-saved-search-meta">
                      {item.search_params?.price_min ||
                      item.search_params?.price_to ? (
                        <span className="user-saved-search-price">
                          {item.search_params?.price_min
                            ? `$${item.search_params.price_min}`
                            : ""}
                          {item.search_params?.price_to
                            ? ` - $${item.search_params.price_to}`
                            : ""}
                        </span>
                      ) : (
                        <span className="user-saved-search-price">$0</span>
                      )}
                      <span className="user-saved-search-dot">•</span>
                      <span className="user-saved-search-year">
                        From{" "}
                        {item.search_params?.year_min
                          ? item.search_params.year_min
                          : "N/A"}
                      </span>
                    </div>

                    {item.search_params?.extra_features?.length > 0 && (
                      <ul className="user-saved-search-details">
                        {item.search_params.extra_features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="user-saved-searches-signup-box">
                <div className="signup-icon">
                  <img src={like_icon} alt="like" />
                </div>
                <div>
                  <h1>You have no Saved searches</h1>
                  <p style={{ fontSize: "16px", fontWeight: "400" }}>
                    Find your saved searches right here. Get alerts for new
                    listings.
                  </p>
                  <button
                    className="signup-btn"
                    onClick={() =>
                      window.scrollTo({ top: 260, behavior: "smooth" })
                    }
                  >
                    Start Searching
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="user-saved-searches-signup-box">
              <div className="signup-icon">
                <img src={like_icon} alt="like" />
              </div>
              <div>
                <h1>Sign up searches</h1>
                <p>
                  Find your saved searches right here. Get alerts for new
                  listings.
                </p>
                <button
                  className="signup-btn"
                  onClick={() => navigate("/login")}
                >
                  Sign up / log in
                </button>
              </div>
            </div>
          )}

          <div className="user-saved-search-actions">
            <div className="user-saved-search-action-box">
              <img src={diamondLogo} alt="Diamond" className="action-icon" />
              <p
                style={{
                  fontSize: "14px",
                  color: "#0A0A0B",
                  cursor: "pointer",
                }}
                onClick={() => setIsModalOpen(true)}
              >
                Value your car with our free online valuation
              </p>
            </div>

            <div className="user-saved-search-action-box">
              <img src={dollarLogo} alt="Dollar" className="action-icon" />
              <p
                style={{
                  fontSize: "14px",
                  color: "#0A0A0B",
                  cursor: "pointer",
                }}
                onClick={() => setIsModalOpen(true)}
              >
                List your car or get a free Instant Offer
              </p>
            </div>
          </div>

          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <img src={diamondGif} alt="Diamond" className="modal-image" />
                <p
                  style={{
                    fontSize: "16px",
                    color: "#0A0A0B",
                    fontWeight: 700,
                    marginBottom: "4px",
                  }}
                >
                  This Feature is coming soon
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#898384",
                    fontWeight: 400,
                    marginTop: "0",
                  }}
                >
                  you could try to remove some filters:
                </p>
                <button
                  className="modal-your-close-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="user-saved-search-image-box">
          <img src={carImage} alt="Car" className="user-saved-search-image" />
          <div className="user-saved-search-image-text">
            <h3>Subscribe To Our Packages</h3>
            <p>
              Find your saved searches right here. Get alerts for new listings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSavedsearch;
