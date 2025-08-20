/**
 * @file BlockedContacts.js
 * @description Component for managing and displaying blocked contacts list.
 * @version 1.0.0
 * @date 2025-08-19
 * @author Palni
 *
 * Copyright (c) 2025 Palni.
 * All rights reserved.
 *
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

/**
 * Copyright (c) 2025 Palni
 * All rights reserved.
 *
 * This file is part of the ss-frontend project.
 * Unauthorized copying or distribution of this file,
 * via any medium is strictly prohibited.
 */

import React, { useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';

const blockedContactsData = [
  {
    id: 1,
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    name:'Moe',
    verified: true,
  },
  {
    id: 2,
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    name: 'Ziad',
    verified: false,
  },
  {
    id: 3,
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    name: 'Ayoub',
    verified: false,
  },
  {
    id: 4,
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    name: 'Moe',
    verified: true,
  },
  {
    id: 5,
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    name: 'Ziad',
    verified: false,
  },
];

const EmptyState = () => (
  <div style={{ textAlign: 'center', padding: 40 }}>
    <h3>No Blocked Contacts</h3>
    <p>You have not blocked any contacts.</p>
  </div>
);

const BlockedContacts = () => {
  const [contacts, setContacts] = useState(blockedContactsData);
  const [unblockLoading, setUnblockLoading] = useState(null);

  const handleUnblock = id => {
    setUnblockLoading(id);
    setTimeout(() => {
      setContacts(contacts.filter(contact => contact.id !== id));
      setUnblockLoading(null);
    }, 500);
  };

  if (contacts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="blocked-contacts-main">
      <div className="blocked-contacts-header">Blocked Contacts</div>
      <div className="blocked-contacts-list">
        {contacts.map(contact => (
          <div className="blocked-contact-item" key={contact.id}>
            <img
              src={contact.avatar}
              alt={contact.name}
              className="blocked-contact-avatar"
            />
            <div className="blocked-contact-info">
              <span className="blocked-contact-name">
                {contact.name}
                {contact.verified && (
                  <CheckCircleFilled
                    style={{
                      color: '#1890ff',
                      fontSize: 16,
                      marginLeft: 6,
                      verticalAlign: -2,
                    }}
                  />
                )}
              </span>
            </div>
            <div className="blocked-contact-action">
              <Popconfirm
                title={`Unblock ${contact.name}?`}
                onConfirm={() => handleUnblock(contact.id)}
                okText="Yes"
                cancelText="No"
                placement="left"
              >
                <Button
                  type="link"
                  loading={unblockLoading === contact.id}
                  style={{ padding: 0, fontWeight: 500 }}
                >
                  Unblock
                </Button>
              </Popconfirm>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockedContacts;
