import React, { useState, useRef, useEffect } from 'react';
import PlaneBanner from '../components/planeBanner';
import carImage from '../assets/images/homecar_icon.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IoCallOutline } from 'react-icons/io5';
import { message } from 'antd';
import { CiMail } from 'react-icons/ci';
import { FaWhatsapp } from 'react-icons/fa';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { useLanguage } from '../contexts/LanguageContext';

const ContactUs = () => {
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const { translate } = useLanguage();
  const [contactInfo, setContactInfo] = useState({
    call_us: '',
    email_us: '',
    whatsapp: ''
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    subject: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    subject: '',
    phone: '',
    message: ''
  });

  const formRef = useRef(null);
  const [formHeight, setFormHeight] = useState(0);

  useEffect(() => {
    if (formRef.current) {
      setFormHeight(formRef.current.offsetHeight);
    }
  }, [subjects, contactInfo]);

  useEffect(() => {
    fetchsubjectData();
  }, []);

  // Fetch subjects and contact info
  const fetchsubjectData = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getcontactsubject();
      const data1 = handleApiResponse(response);

      if (data1?.subjects?.length) {
        setSubjects(data1.subjects);
        setContactInfo(data1.contact_info || {});
      } else {
        message.warning('No Subjects found.');
      }
    } catch (error) {
       if (error?.message === 'Network Error') {
                                   messageApi.open({
                                     type: 'error',
                                     content: translate('filters.OFFLINE_ERROR'),
                                   });
                                 }else{
                                     const errorData = handleApiError(error);
      message.error(errorData.message || 'Failed to fetch Subject.');
                                 }
     
    } finally {
      setLoading(false);
    }
  };

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Remove error message on change
    setErrors({ ...errors, [name]: '' });
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({
      firstName: '',
      lastName: '',
      subject: '',
      phone: '',
      message: ''
    });

    let hasError = false;
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Please enter First Name';
      hasError = true;
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Please enter Last Name';
      hasError = true;
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Please choose a Subject';
      hasError = true;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter Phone Number';
      hasError = true;
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Please enter your Message';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return; // stop submission
    }

    // Prepare request body
    const body = {
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      phone_number: formData.phone.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };

    await contactussubmitapi(body);
  };

  // Submit API
  const contactussubmitapi = async (body) => {
    try {
      setLoading(true);
      const response = await carAPI.postcontactsubmit(body);
      const cardetail = handleApiResponse(response);

      if (cardetail.status_code === 200) {
        messageApi.open({
          type: 'success',
          content: cardetail?.message || 'Form submitted successfully!',
        });

        // Clear all fields after success
        setFormData({
          firstName: '',
          lastName: '',
          subject: '',
          phone: '',
          message: '',
        });
      } else {
        messageApi.open({
          type: 'error',
          content: cardetail?.message || 'Failed to submit form.',
        });
      }
    } catch (error) {
      if (error?.message === 'Network Error') {
                                   messageApi.open({
                                     type: 'error',
                                     content: translate('filters.OFFLINE_ERROR'),
                                   });
                                 }else{
                                      const errorData = handleApiError(error);
      messageApi.open({
        type: 'error',
        content: errorData.message,
      });
                                 }
    
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: '#E7EBEF',
    color: '#4A5E6D',
    fontSize: '14px',
    fontWeight: 400,
    border: 'none',
    borderRadius: '8px',
    padding: '10px'
  };

  const submitButtonStyle = {
    backgroundColor: '#008AD5',
    color: '#fff',
    borderRadius: '22px',
    fontSize: '16px',
    fontWeight: 700,
    border: 'none',
    padding: '10px'
  };

  return (
    <>
      <PlaneBanner />

      {/* Dropdown custom scroll style */}
      <style>
        {`
          .custom-select-scroll {
            max-height: 150px !important;
            overflow-y: auto !important;
          }
          select.form-select {
            height: 45px !important;
          }
        `}
      </style>

      <div className="container my-5">
        {contextHolder}
        <div className="row g-4 align-items-start">
          {/* Left Column */}
          <div className="col-lg-6" ref={formRef}>
            <h2 className="mb-4" style={{ fontSize: '44px', fontWeight: 700 }}>Contact Us Today</h2>
            <p style={{ color: '#959595', fontSize: '14px', fontWeight: '400' }}>
              Submit your information to get in touch with us for personalized assistance. We care and we’re here to help.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col">
                  <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    placeholder="First Name*"
                    value={formData.firstName}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                  {errors.firstName && <div style={{ color: 'red', fontSize: '12px', marginTop: '2px' }}>{errors.firstName}</div>}
                </div>
                <div className="col">
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    placeholder="Last Name*"
                    value={formData.lastName}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                  {errors.lastName && <div style={{ color: 'red', fontSize: '12px', marginTop: '2px' }}>{errors.lastName}</div>}
                </div>
              </div>

              {/* Dropdown with scroll */}
              <div className="mb-3">
                <select
                  name="subject"
                  className="form-select custom-select-scroll"
                  value={formData.subject}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Choose Subject*</option>
                  {subjects.map((item) => (
                    <option key={item.id} value={item.subject}>
                      {item.subject}
                    </option>
                  ))}
                </select>
                {errors.subject && <div style={{ color: 'red', fontSize: '12px', marginTop: '2px' }}>{errors.subject}</div>}
              </div>

              <div className="mb-3">
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="Phone Number*"
                  value={formData.phone}
                  onChange={handleChange}
                  style={inputStyle}
                />
                {errors.phone && <div style={{ color: 'red', fontSize: '12px', marginTop: '2px' }}>{errors.phone}</div>}
              </div>

              <div className="mb-3">
                <textarea
                  name="message"
                  className="form-control"
                  placeholder="Your Message*"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  style={inputStyle}
                />
                {errors.message && <div style={{ color: 'red', fontSize: '12px', marginTop: '2px' }}>{errors.message}</div>}
              </div>

              <div className="mb-3">
                <button type="submit" className="w-100" style={submitButtonStyle} disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>

              {/* Contact Info Row */}
              <div
                className="d-flex justify-content-between align-items-center flex-wrap mt-4"
                style={{ gap: '10px' }}
              >
                {/* Call Us */}
                <div className="d-flex align-items-start flex-fill" style={{ minWidth: '150px' }}>
                  <div
                    className="d-flex justify-content-center align-items-center me-2"
                    style={{
                      backgroundColor: '#008AD5',
                      color: '#fff',
                      borderRadius: '12px',
                      width: '40px',
                      height: '40px',
                      fontSize: '20px'
                    }}
                  >
                    <IoCallOutline />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16px' }}>Call Us</div>
                    <div style={{ fontWeight: 400, fontSize: '14px', color: '#8B8B8A' }}>
                      {contactInfo.call_us}
                    </div>
                  </div>
                </div>

                {/* Email Us */}
                <div className="d-flex align-items-start flex-fill" style={{ minWidth: '150px' }}>
                  <div
                    className="d-flex justify-content-center align-items-center me-2"
                    style={{
                      backgroundColor: '#008AD5',
                      color: '#fff',
                      borderRadius: '12px',
                      width: '40px',
                      height: '40px',
                      fontSize: '20px'
                    }}
                  >
                    <CiMail />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16px' }}>Email Us</div>
                    <div style={{ fontWeight: 400, fontSize: '14px', color: '#8B8B8A' }}>
                      {contactInfo.email_us}
                    </div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="d-flex align-items-start flex-fill" style={{ minWidth: '150px' }}>
                  <div
                    className="d-flex justify-content-center align-items-center me-2"
                    style={{
                      backgroundColor: '#008AD5',
                      color: '#fff',
                      borderRadius: '12px',
                      width: '40px',
                      height: '40px',
                      fontSize: '20px'
                    }}
                  >
                    <FaWhatsapp />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16px' }}>WhatsApp</div>
                    <div style={{ fontWeight: 400, fontSize: '14px', color: '#8B8B8A' }}>
                      {contactInfo.whatsapp}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column - Car Image */}
          <div className="col-lg-6 d-flex justify-content-center align-items-start">
            <img
              src={carImage}
              alt="Car"
              className="img-fluid rounded"
              style={{ height: formHeight, objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
