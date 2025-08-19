/**
 * Copyright (c) 2025 Palni
 * All rights reserved.
 *
 * This file is part of the ss-frontend project.
 * Unauthorized copying or distribution of this file,
 * via any medium is strictly prohibited.
 */

import React, { useState } from 'react';
import { RightOutlined, LeftOutlined, BellOutlined } from '@ant-design/icons';

const notifications = [
  {
    id: 1,
    title: 'Fringilla Fusce Elit',
    date: 'Dec 7, 2019 23:26',
    section: 'Today',
    highlighted: true,
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=600&h=300',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    id: 2,
    title: 'Vehicula Quam Quis',
    date: 'Dec 7, 2019 23:26',
    section: 'Today',
    img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=600&h=300',
    desc: 'Short notification description.',
  },
  {
    id: 3,
    title: 'Aenean Lacinia Bibendum',
    date: 'Dec 7, 2019 23:26',
    section: 'Earlier',
    highlighted: true,
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=600&h=300',
    desc: 'Another notification description.',
  },
  {
    id: 4,
    title: 'Cras Mattis Consectetur',
    date: 'Dec 7, 2019 23:26',
    section: 'Earlier',
    img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=facearea&w=600&h=300',
    desc: 'Earlier notification.',
  },
  {
    id: 5,
    title: 'Nulla Vitae Elit',
    date: 'Dec 7, 2019 23:26',
    section: 'Last Week',
    highlighted: true,
    img: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fdc?auto=format&fit=facearea&w=600&h=300',
    desc: 'Last week notification.',
  },
  {
    id: 6,
    title: 'Etiam Porta Sem Malesuada',
    date: 'Dec 7, 2019 23:26',
    section: 'Last Week',
    img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=600&h=300',
    desc: 'Another last week notification.',
  },
];

const sectionOrder = ['Today', 'Earlier', 'Last Week'];
const sectionColors = {
  Today: '#ffb300',
  Earlier: '#ff6f00',
  'Last Week': '#e65100',
};

const ManageNotifications = () => {
  const [selected, setSelected] = useState(null);

  if (notifications.length === 0) {
    return (
      <div className="notifications-main">
        <div className="notifications-header">Manage Notifications</div>
        <div className="notifications-empty">
          <BellOutlined
            style={{ fontSize: 64, color: '#039be5', marginBottom: 16 }}
          />
          <div className="notifications-empty-title">
            You Have No Notifications
          </div>
          <div className="notifications-empty-desc">
            you've got a blank slate (for now). we'll let you know when updates
            arrive!
          </div>
        </div>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="notifications-main">
        <div
          className="notifications-header"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <LeftOutlined
            style={{ fontSize: 20, marginRight: 12, cursor: 'pointer' }}
            onClick={() => setSelected(null)}
          />
          <span>Manage Notifications</span>
        </div>
        <div className="notification-details-card">
          <img
            className="notification-details-img"
            src={selected.img}
            alt="notification"
          />
          <div className="notification-details-title">{selected.title}</div>
          <div className="notification-details-date">{selected.date}</div>
          <div className="notification-details-desc">{selected.desc}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-main">
      <div className="notifications-header">Manage Notifications</div>
      <div className="notifications-list">
        {sectionOrder.map((section) => {
          const sectionNotifs = notifications.filter(
            (n) => n.section === section
          );
          if (!sectionNotifs.length) return null;
          return (
            <div key={section} className="notifications-section">
              <div
                className="notifications-section-title"
                style={{ color: sectionColors[section] }}
              >
                {section}
              </div>
              {sectionNotifs.map((notif, idx) => (
                <div
                  key={notif.id}
                  className={`notification-item${
                    notif.highlighted ? ' highlighted' : ''
                  }`}
                  onClick={() => setSelected(notif)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="notification-dot" />
                  <div className="notification-content">
                    <div className="notification-title">{notif.title}</div>
                    <div className="notification-date">{notif.date}</div>
                  </div>
                  <div className="notification-thumb">
                    <img src={notif.img} alt="thumb" />
                  </div>
                  <RightOutlined className="notification-arrow" />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageNotifications;
