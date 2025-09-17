/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../assets/styles/usersavedsearches.css';
import posting from '../assets/images/posting.gif';

const CarPostingModal = ({ onClose }) => {
  const navigate = useNavigate();

  const handleViewPost = () => {
    navigate('/myListings'); // Update this path as needed
    onClose();
  };

  const handleaddcar = () => {
    navigate('/sell'); // Update this path as needed
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <img src={posting} alt="Diamond" className="modal-image" />
        
        <p className="modal-title-text">Thank You For Posting</p>
        
        <p className="modal-subtitle-text">
          We will review your post and let you know when it's approved.
        </p>
        
      <div style={{ display: 'flex', gap: '10px', padding: '12px', width: '100%' }}>
  <button
    className="modal-your-close-btn"
    onClick={handleViewPost}
    style={{
      flex: 1,
      backgroundColor: '#fff',
      color: '#0691c3',
      borderColor: '#008AD5',
      borderWidth: '1px',
      borderStyle: 'solid',
    }}
  >
    View Post
  </button>

  <button
    className="modal-your-close-btn"
    onClick={handleaddcar}
    style={{ flex: 1 }}
  >
    Add New
  </button>
</div>


      </div>
    </div>
  );
};

// ✅ Prop validation
CarPostingModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default CarPostingModal;
