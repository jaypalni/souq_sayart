/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React from 'react';
import { Modal, Button, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import '../assets/styles/searchmodal.css';
import PropTypes from 'prop-types';

const filters = [
  'Mercedes-Benz B-Class',
  'B-Class',
  'Beirut, Lebanon',
  'Beirut, Lebanon',
  'B-Class',
  'Mercedes-Benz B-Class',
];

const SearchModal = ({ visible, onCancel, onSave }) => {
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      className="search-modal"
      width={420}
    >
      <div className="search-modal-content">
        <div className="search-modal-icon">
          <SearchOutlined style={{ fontSize: 48, color: '#ff9100' }} />
        </div>
        <div className="search-modal-title">
          We didnt find anything that matches this search
        </div>
        <div className="search-modal-subtitle">
          you could try to remove some filters:
        </div>
        <div className="search-modal-tags">
          {filters.map((f) => (
            <Tag key={f.id} className="search-modal-tag">
              {f.name}
            </Tag>
          ))}
        </div>
        <div className="search-modal-footer">
          <Button onClick={onCancel} className="search-modal-cancel-btn">
            Cancel
          </Button>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={onSave}
            className="search-modal-save-btn"
          >
            Save Search
          </Button>
        </div>
        <div className="search-modal-note">
          Or save the search and be notified as soon as we have something for
          you.
        </div>
      </div>
    </Modal>
  );
};

SearchModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default SearchModal;