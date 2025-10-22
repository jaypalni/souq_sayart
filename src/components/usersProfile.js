import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import { Pagination, Select, message } from 'antd';
import { BsChatLeftDots } from 'react-icons/bs';
import '../assets/styles/userProfile.css';
import Share_icon from '../assets/images/share_icon.svg';
import Bluetick_icon from '../assets/images/bluetick_svg.svg';
import Pinlocation_icon from '../assets/images/pinlocation_icon.svg';
import Allcarslistdata from '../components/Allcarslistdata';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { useNavigate } from 'react-router-dom';


const { Option } = Select;

const UsersProfile = () => {
  const { userId } = useParams();
  const [location, setLocation] = useState('');
  const [carLocations, setCarLocations] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [userProfile, setUserProfile] = useState(null);
  const [visibleCars, setVisibleCars] = useState([]);
  const [carList, setCarList] = useState([]);
  const [, setLoading] = useState(false);
   const navigate = useNavigate();
  

  // Fetch user details whenever userId or location changes
  useEffect(() => {
    if (userId) {
      fetchlocations();
      fetchUserDetails(userId, location);
    }
  }, [userId, location]);

  // Fetch all available car locations
  const fetchlocations = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getLocationCars({});
      const data = handleApiResponse(response);

      if (!data) {
        message.error('No location data found');
        setCarLocations([]);
        return;
      }

      const locations = data?.data || [];
      setCarLocations(locations);
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || 'Failed to fetch locations');
      setCarLocations([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile & cars
  const fetchUserDetails = async (userId, selectedLocation = '') => {
    setLoading(true);
    try {
      const body = {
        user_id: parseInt(userId),
        page: 1,
        limit: 20,
        location: selectedLocation || '',
      };

      const response = await carAPI.postsellerprofile(body);
      const result = handleApiResponse(response);

      if (result?.success) {
        setUserProfile(result);
        setCarList(result.cars || []);
      } else {
        messageApi.open({
          type: 'warning',
          content: result?.message || 'No profile data available.',
        });
      }
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({
        type: 'error',
        content: errorData.error || 'Failed to load profile data.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {contextHolder}

      {/* Header */}
      {/* <div
        style={{
          backgroundColor: '#008ad5',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
          height: 55,
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 35px' }}>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 400,
              color: '#fff',
              marginTop: 15,
            }}
          >
            Home &gt; New Cars &gt; Profile
          </p>
        </div>
      </div> */}

      {/* Profile Header */}
      {userProfile && (
        <div style={{ marginTop: 25, marginLeft: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: '#cce6f7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                fontWeight: 'bold',
                color: '#007acc',
                overflow: 'hidden',
              }}
            >
              {userProfile.profile_pic ? (
                <img
                  src={userProfile.profile_pic}
                  alt="Profile"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                (userProfile.first_name?.charAt(0) || 'U').toUpperCase()
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 'bold', fontSize: 20 }}>
                  {userProfile.first_name} {userProfile.last_name}
                </span>
                <span style={{ color: '#008ad5', fontSize: 18 }}>
                  <img
                    src={Bluetick_icon}
                    alt="Verified"
                    style={{
                      width: 13.33,
                      height: 13.33,
                      cursor: 'pointer',
                      marginRight: 24,
                    }}
                  />
                </span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>
                {userProfile.total_cars} Published ads
              </div>
              <div style={{ fontSize: 14, color: 'gray' }}>
                Joined on {userProfile.created_at}
              </div>
            </div>

            <div style={{ marginLeft: 55 }}>
              <img
                src={Share_icon}
                alt="Share"
                style={{
                  width: 24,
                  height: 24,
                  cursor: 'pointer',
                  marginRight: 1,
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button className="blue-btn">
              <BsChatLeftDots /> Message
            </button>
            <button className="green-btn">
              <FaWhatsapp /> Whatsapp
            </button>
            <button className="dark-btn">
              <FaPhoneAlt /> Call
            </button>
          </div>

          {/* Location Selector */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontWeight: 600, color: '#555' }}>
              <img
                src={Pinlocation_icon}
                alt="Location"
                style={{
                  width: 24,
                  height: 24,
                  cursor: 'pointer',
                  marginRight: 4,
                }}
              />
              Address
            </div>
            <div style={{ marginTop: 10 }}>
              <label
                htmlFor="location-select"
                style={{ color: '#008ad5', fontWeight: 'bold' }}
              >
                Location
              </label>

              <div className="custom-select-wrapper">
                <Select
                  id="location-select"
                  value={location}
                  onChange={(value) => setLocation(value)}
                  style={{ width: 200 }}
                  placeholder="Select Location"
                >
                  <Option value="">All Locations</Option>
                  {carLocations.map((loc) => (
                    <Option key={loc.id || loc.location} value={loc.location}>
                      {loc.location}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Car List */}
      <div
        className="row"
        style={{ marginLeft: '100px', marginRight: '100px', marginTop: '25px' }}
      >
        {carList.map((car, idx) => (
          <Allcarslistdata
            key={`car-${car.id}-${idx}`}
            car={{
              id: car.id,
              image: car.car_image || '/default-car.png',
              title: car.ad_title || `${car.make} ${car.model}`,
              price: `$${car.price}`,
              engine: car.engine_cc
                ? `${car.no_of_cylinders} Cyl ${car.engine_cc}L`
                : 'N/A',
              transmission: car.transmission_type || 'Automatic',
              location: car.location || 'Unknown',
              country: car.company_name || 'N/A',
              mileage: car.kilometers ? `${car.kilometers}` : 'N/A',
              is_favorite: car.is_favorite, 
              featured: car.is_featured || false,
              certified: car.certified || false,
            }}
            idx={idx}
            onClick={() => navigate(`/carDetails/${car.id}`, { state: { previousPage: 'Seller Profile' } })}
          />
        ))}
      </div>

      {/* Pagination */}
      <div
        style={{
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Pagination defaultCurrent={1} total={carList.length} />
      </div>
    </div>
  );
};

export default UsersProfile;
