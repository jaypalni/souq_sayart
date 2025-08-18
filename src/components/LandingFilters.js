import React, { useState, useRef, useEffect } from "react";
import { Select, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "../assets/styles/landingFilters.css";
import { carAPI } from "../services/api";
import { handleApiResponse, handleApiError } from "../utils/apiUtils";
import { message, Modal, Tag } from "antd";
import { fetchMakeCars, fetchModelCars } from "../commonFunction/fetchMakeCars";
import { useNavigate } from "react-router-dom";
import Searchemptymodal from "../components/searchemptymodal";
import { useDispatch } from "react-redux";
import { logoutUser, clearCustomerDetails } from "../redux/actions/authActions";
const { Option } = Select;

const newUsedOptions = ["New & Used", "New", "Used"];
const priceMinOptions = ["Price Min", 5000, 10000, 20000, 30000, 40000];
const priceMaxOptions = ["Price Max", 20000, 30000, 40000, 50000, 100000];

const LandingFilters = ({ searchbodytype }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [make, setMake] = useState("All");
  const [carMakes, setCarMakes] = useState([]);
  const [model, setModel] = useState("All Models");
  const [carModels, setCarModels] = useState([]);
  const [bodyType, setBodyType] = useState("All Body Types");
  const [carBodyTypes, setCarBodyTypes] = useState([]);
  const [location, setLocation] = useState("Baghdad");
  const [carLocation, setCarLocation] = useState([]);
  const [carLocationCountry, setCarLocationCountry] = useState([]);
  const [carSearch, setCarSearch] = useState([]);
  const [newUsed, setNewUsed] = useState("New & Used");
  const [priceMin, setPriceMin] = useState("Price Min");
  const [priceMax, setPriceMax] = useState("Price Max");
  const [carCount] = useState(342642);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const dropdownRefs = {
    newUsed: useRef(),
    priceMin: useRef(),
    priceMax: useRef(),
  };

  useEffect(() => {
    fetchMakeCars({ setLoading, setCarMakes });
  }, []);

  useEffect(() => {
    make && fetchModelCars({ setLoading, setCarModels, make });
  }, [make]);

  useEffect(() => {
    model && fetchBodyTypeCars();
  }, []);

  useEffect(() => {
    bodyType && fetchRegionCars();
  }, []);

  useEffect(() => {
    setBodyType(searchbodytype);
  }, [searchbodytype]);

  const fetchBodyTypeCars = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getBodyCars({});
      const data1 = handleApiResponse(response);

      if (data1) {
        setCarBodyTypes(data1?.data);
      }

      message.success(data1.message || "Fetched successfully");
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to Make car data");
      setCarBodyTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegionCars = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getLocationCars({});
      const data1 = handleApiResponse(response);
      if (data1) {
        const locations = data1?.data;
        setCarLocation(locations);
        const getGeoData = async () => {
          try {
            const cacheKey = "geoDataCache";
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
              const parsed = JSON.parse(cached);
              const maxAgeMs = 24 * 60 * 60 * 1000;
              if (
                parsed?.ts &&
                Date.now() - parsed.ts < maxAgeMs &&
                parsed?.data
              ) {
                return parsed.data;
              }
            }

            const geoRes = await fetch("https://ipapi.co/json/");
            if (!geoRes.ok) throw new Error(`Geo API error: ${geoRes.status}`);
            const geoData = await geoRes.json();
            localStorage.setItem(
              cacheKey,
              JSON.stringify({ ts: Date.now(), data: geoData })
            );
            return geoData;
          } catch (err) {
            return null;
          }
        };

        const geoData = await getGeoData();
        let defaultLocation = null;

        if (geoData) {
          const userCountry = geoData?.country_name?.toLowerCase();
          defaultLocation = locations.find(
            (loc) => loc.location.toLowerCase() === userCountry
          );
        }

        if (!defaultLocation) {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const tzLower = tz ? tz.toLowerCase() : "";
          const tzOffset = new Date().getTimezoneOffset();
          const langs = [
            navigator.language,
            ...(navigator.languages || []),
          ].filter(Boolean);

          const isIndiaLocale =
            tzLower === "asia/kolkata" ||
            tzLower === "asia/calcutta" ||
            tzOffset === -330 ||
            langs.some((l) => {
              const ll = String(l).toLowerCase();
              return ll.endsWith("-in") || ll === "en-in" || ll.includes("-in");
            });
          if (isIndiaLocale) {
            defaultLocation = locations.find(
              (loc) => loc.location.toLowerCase() === "india"
            );

            if (!defaultLocation) {
              defaultLocation = locations.find(
                (loc) => loc.location.toLowerCase() === "dubai"
              );
            }
          }
        }

        if (!defaultLocation && locations.length > 0) {
          defaultLocation = locations[0];
        }

        if (defaultLocation) {
          setCarLocationCountry(defaultLocation);
          setLocation(defaultLocation.location);
        }
      }

      message.success(data1.message || "Fetched successfully");
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to Locations car data");
      setCarLocation([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToast = (msg) => {
    console.message("Here it done");
    setToastMsg(msg);
    if (msg) {
      message.success(msg);
    }
  };

  const handleChange = (name, value) => {};

  const handleSearch = async () => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const params = {
        make: make !== "All" ? make : "",
        model: model !== "All Models" ? model : "",
        body_type: bodyType !== "All Body Types" ? bodyType : "",
        location: location !== "Baghdad" ? location : "",
      };

      const response = await carAPI.getSearchCars(params);
      const data1 = handleApiResponse(response);

      if (data1) {
        const results = data1?.data?.cars || [];
        setCarSearch(results);

        if (results.length === 0) {
          setIsModalOpen(true);
        } else {
          navigate("/allcars", {
            state: { cars: results, pagination: data1?.data?.pagination },
          });
          localStorage.setItem("searchcardata", JSON.stringify(params));
        }
      }
    } catch (error) {
      const errorData = handleApiError(error);

      if (errorData.status === 401) {
        messageApi.open({
          type: "error",
          content: "Your session has expired. Please log in again.",
        });

        setTimeout(() => {
          (async () => {
            localStorage.removeItem("token");
            localStorage.clear();

            await dispatch(logoutUser());
            dispatch(clearCustomerDetails());
            dispatch({ type: "CLEAR_USER_DATA" });

            navigate("/login");
          })();
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: errorData.message,
        });
      }

      setCarSearch([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdown &&
        dropdownRefs[openDropdown] &&
        !dropdownRefs[openDropdown].current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  const renderDropdown = (type, options, value, setValue) => (
    <div className="landing-filters-dropdown-menu" ref={dropdownRefs[type]}>
      {options.map((opt) => (
        <div
          key={opt}
          className={`landing-filters-dropdown-item${
            value === opt ? " selected" : ""
          }`}
          onClick={() => {
            setValue(opt);
            handleChange(
              type === "newUsed"
                ? "New & Used"
                : type === "priceMin"
                ? "Price Min"
                : "Price Max",
              opt
            );
            setOpenDropdown(null);
          }}
        >
          {opt}
        </div>
      ))}
    </div>
  );

  return (
    <div className="landing-filters-outer">
      {contextHolder}
      <div className="landing-filters-bar">
        <div className="landing-filters-row">
          <div className="landing-filters-col">
            <label className="landing-filters-label">Make</label>
            <Select
              value={make}
              onChange={(value) => {
                setMake(value);
                setModel("All Models");
                handleChange("Make", value);
              }}
              className="landing-filters-select"
              size="large"
              dropdownClassName="landing-filters-dropdown"
              placeholder="All Models"
            >
              {carMakes.map((m) => (
                <Option key={m.id} value={m.name}>
                  {m.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="landing-filters-col">
            <label className="landing-filters-label">Model</label>
            <Select
              value={model}
              onChange={(value) => {
                setModel(value);
                handleChange("Model", value);
              }}
              className="landing-filters-select"
              size="large"
              dropdownClassName="landing-filters-dropdown"
              disabled={make === "All Make"}
            >
              {carModels?.map((m) => (
                <Option key={m.id} value={m.model_name}>
                  {m.model_name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="landing-filters-col">
            <label className="landing-filters-label">Body Type</label>
            <Select
              value={bodyType}
              onChange={(value) => {
                setBodyType(value);
                handleChange("Body Type", value);
              }}
              className="landing-filters-select"
              size="large"
              dropdownClassName="landing-filters-dropdown"
            >
              {carBodyTypes.map((b) => (
                <Option key={b.id} value={b.body_type}>
                  {b.body_type}
                </Option>
              ))}
            </Select>
          </div>
          <div className="landing-filters-col">
            <label className="landing-filters-label">Location</label>
            <Select
              value={location}
              onChange={(value) => {
                setLocation(value);
                handleChange("Location", value);
              }}
              className="landing-filters-select"
              size="large"
              dropdownClassName="landing-filters-dropdown"
            >
              {carLocation.map((l) => (
                <Option key={l.id} value={l.location}>
                  {l.location}
                </Option>
              ))}
            </Select>
          </div>
          <div className="landing-filters-col landing-filters-btn-col">
            <Button
              type="primary"
              size="large"
              onClick={handleSearch}
              icon={<SearchOutlined />}
              className="landing-filters-btn"
            >
              <span>Show {carCount.toLocaleString()} Cars</span>
            </Button>
          </div>
        </div>
        <div className="landing-filters-row landing-filters-row-text">
          <div
            className="landing-filters-text"
            onClick={() =>
              setOpenDropdown(openDropdown === "newUsed" ? null : "newUsed")
            }
            tabIndex={0}
          >
            {newUsed} <span className="landing-filters-text-arrow">▼</span>
            {openDropdown === "newUsed" &&
              renderDropdown("newUsed", newUsedOptions, newUsed, setNewUsed)}
          </div>
          <div
            className="landing-filters-text"
            onClick={() =>
              setOpenDropdown(openDropdown === "priceMin" ? null : "priceMin")
            }
            tabIndex={0}
          >
            {priceMin} <span className="landing-filters-text-arrow">▼</span>
            {openDropdown === "priceMin" &&
              renderDropdown(
                "priceMin",
                priceMinOptions,
                priceMin,
                setPriceMin
              )}
          </div>
          <div
            className="landing-filters-text"
            onClick={() =>
              setOpenDropdown(openDropdown === "priceMax" ? null : "priceMax")
            }
            tabIndex={0}
          >
            {priceMax} <span className="landing-filters-text-arrow">▼</span>
            {openDropdown === "priceMax" &&
              renderDropdown(
                "priceMax",
                priceMaxOptions,
                priceMax,
                setPriceMax
              )}
          </div>
        </div>
      </div>

      <Searchemptymodal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        toastmessage={handleToast}
        make={make}
        setMake={setMake}
        model={model}
        setModel={setModel}
        bodyType={bodyType}
        setBodyType={setBodyType}
        selectedLocation={location} // renamed here
        setSelectedLocation={setLocation} // renamed here
        onSave={handleSearch}
      />
    </div>
  );
};

export default LandingFilters;
