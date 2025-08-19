/**
 * Copyright (c) 2025 Palni
 * All rights reserved.
 *
 * This file is part of the ss-frontend project.
 * Unauthorized copying or distribution of this file,
 * via any medium is strictly prohibited.
 */

import React from "react";
import { Modal, Button, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "../assets/styles/searchmodal.css";

const filters = [
  "Mercedes-Benz B-Class",
  "B-Class",
  "Beirut, Lebanon",
  "Beirut, Lebanon",
  "B-Class",
  "Mercedes-Benz B-Class",
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
          <SearchOutlined style={{ fontSize: 48, color: "#ff9100" }} />
        </div>
        <div className="search-modal-title">
          We didnt find anything that matches this search
        </div>
        <div className="search-modal-subtitle">
          you could try to remove some filters:
        </div>
        <div className="search-modal-tags">
          {filters.map((f, i) => (
            <Tag key={i} className="search-modal-tag">
              {f}
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

export default SearchModal;
