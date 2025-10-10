import React, { useState, useRef, useEffect } from 'react';
import PlaneBanner from '../components/planeBanner';
import carImage from '../assets/images/homecar_icon.png'; // replace with your image path
import 'bootstrap/dist/css/bootstrap.min.css';
import { IoCallOutline } from 'react-icons/io5';
import { CiMail } from 'react-icons/ci';
import { FaWhatsapp } from 'react-icons/fa';

const ContactUs = () => {
  const [formData, setFormData] = useState({
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
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
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
      <div className="container my-5">
        <div className="row g-4 align-items-start">

          {/* Left Column */}
          <div className="col-lg-6" ref={formRef}>
            <h2 className="mb-4">Contact Us Today</h2>
            <p style={{ color: '#959595', fontSize: '14px', fontWeight: '400' }}>
              Submit your information to get in touch with us for personalized assistance for the perfect real estate in Lebanon. We care and we’re here to help
            </p>

            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col">
                  <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="mb-3">
                <select
                  name="subject"
                  className="form-select"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="">Choose Subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Sell Car">Sell Car</option>
                  <option value="Support">Support</option>
                </select>
              </div>

              <div className="mb-3">
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>

              <div className="mb-3">
                <textarea
                  name="message"
                  className="form-control"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                  style={inputStyle}
                />
              </div>

              <div className="mb-3">
                <button type="submit" className="w-100" style={submitButtonStyle}>
                  Submit
                </button>
              </div>

              {/* Contact Info Row */}
              <div className="d-flex justify-content-between mt-4">
                <div className="d-flex align-items-start">
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
                    <div style={{ fontWeight: 400, fontSize: '14px', color: '#8B8B8A' }}>+91773867823</div>
                  </div>
                </div>

                <div className="d-flex align-items-start">
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
                    <div style={{ fontWeight: 400, fontSize: '14px', color: '#8B8B8A' }}>Souqsiyarat@info.com</div>
                  </div>
                </div>

                <div className="d-flex align-items-start">
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
                    <div style={{ fontWeight: 700, fontSize: '16px' }}>Whatsapp</div>
                    <div style={{ fontWeight: 400, fontSize: '14px', color: '#8B8B8A' }}>+918736728322</div>
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
