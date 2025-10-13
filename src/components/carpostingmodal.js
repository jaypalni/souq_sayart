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
import { useLanguage } from '../contexts/LanguageContext';

const CarPostingModal = ({ onClose, handleAddNew, mode = 'create'}) => {
  const { translate } = useLanguage();
  const navigate = useNavigate();

  const handleViewPost = () => {
    navigate('/myListings'); 
    onClose();
  };

  const handleaddcar = () => {
    navigate('/sell'); 
    handleAddNew()
    onClose();
  };

  // Determine content based on mode
  const isDraft = mode === 'draft';
  const modalTitle = isDraft ? translate('carPostingModal.DRAFT_TITLE') : translate('carPostingModal.CREATE_TITLE');
  const modalSubtitle = isDraft
    ? translate('carPostingModal.DRAFT_SUBTITLE')
    : translate('carPostingModal.CREATE_SUBTITLE');

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <img src={posting} alt="Diamond" className="modal-image" />
        
        <p className="modal-title-text">{modalTitle}</p>
        
        <p className="modal-subtitle-text">
          {modalSubtitle}
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
    {translate('carPostingModal.VIEW_POST')}
  </button>

  <button
    className="modal-your-close-btn"
    onClick={handleaddcar}
    style={{ flex: 1 }}
  >
    {translate('carPostingModal.ADD_NEW')}
  </button>
</div>


      </div>
    </div>
  );
};


CarPostingModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  handleAddNew: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['create', 'draft']),
};

export default CarPostingModal;
