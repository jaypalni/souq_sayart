import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Row,
  Col,
  Card,
  Select,
  DatePicker,
  Checkbox,
  Radio,
  Modal,
  Image,
} from "antd";
import {
  PlusOutlined,
  RightOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/styles/sell.css";
import imageIcon from "../assets/images/imageIcon.svg";
import toyotaImg from "../assets/images/toyota.png";
import { useNavigate } from "react-router-dom";
import mercedesImg from "../assets/images/mercedes.png";
import miniImg from "../assets/images/mini.png";
import bmwImg from "../assets/images/bmw.png";
import hummerImg from "../assets/images/hummer.png";
import lamborghiniImg from "../assets/images/lamborghini.png";
import addMediaSvg from "../assets/images/addMedia.svg";
import { carAPI } from "../services/api";
import { handleApiResponse, handleApiError } from "../utils/apiUtils";
//import { message } from "antd";
import { fetchMakeCars, fetchModelCars } from "../commonFunction/fetchMakeCars";


const NewSell = () => {
  return (
    <>
      <div className="page-header">
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
          Sell Your Car In IRAQ
        </div>
        <div style={{ fontSize: 11 }}>Post an ad in just 3 simple steps</div>
      </div>
     
    </>
  );
};

export default NewSell;
