/**
 * Copyright (c) 2025 Palni
 * All rights reserved.
 *
 * This file is part of the ss-frontend project.
 * Unauthorized copying or distribution of this file,
 * via any medium is strictly prohibited.
 */

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
  Modal,
  Image,
} from "antd";
import { PlusOutlined, RightOutlined, SearchOutlined } from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/styles/sell.css";
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
import { fetchMakeCars, fetchModelCars } from "../commonFunction/fetchMakeCars";

const { TextArea } = Input;
const { Option } = Select;

const bodyTypes = ["SUV", "Sedan", "Wagon"];
const badges = [
  "Urgent",
  "Perfect Inside Out",
  "No Accident history",
  "Low Mileage",
  "Full Service history available",
  "Cash Only",
  "New",
  "Financing Available",
  "Available For Rent",
];
const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric"];
const transmissionTypes = ["Automatic", "Manual", "Steptronic"];
const driveTypes = ["Rear Wheel Drive", "Front Wheel Drive", "All Wheel Drive"];

const cylinders = [
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "16",
  "N/A, Electric",
  "Not Sure",
];
const seats = ["1/2", "2/3", "4/5", "5/6", "6/7"];
const doors = ["2/3", "4/5"];

const brandOptions = [
  { label: "Toyota", value: "Toyota", img: toyotaImg },
  { label: "Mercedes", value: "Mercedes", img: mercedesImg },
  { label: "Mini Cooper", value: "Mini Cooper", img: miniImg },
  { label: "BMW", value: "BMW", img: bmwImg },
  { label: "Hummer", value: "Hummer", img: hummerImg },
  { label: "Lamborghini", value: "Lamborghini", img: lamborghiniImg },
];

const conditionOptions = [
  { label: "New", value: "New" },
  { label: "Used", value: "Used" },
];

const Sell = () => {
  const [setLoading] = useState(false);
  const [carMakes, setCarMakes] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [make, setMake] = useState("");
  const [yearData, setYearData] = useState([]);
  const [trimData, setTrimData] = useState([]);
  const [updateData, setUpdateData] = useState();
  const [setAddData] = useState();
  const [setDraftData] = useState();
  const [form] = Form.useForm();
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [colorSearch, setColorSearch] = useState("");
  const [selectedColor, setSelectedColor] = useState();
  const [trimModalOpen, setTrimModalOpen] = useState(false);
  const [trimSearch, setTrimSearch] = useState("");
  const [selectedTrim, setSelectedTrim] = useState();
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [brandNameOpen, setBrandNameOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState();
  const [selectedBrandName, setSelectedBrandName] = useState();
  const [modalName, setModalName] = useState();
  const [yearModalOpen, setYearModalOpen] = useState(false);
  const [yearSearch, setYearSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState();
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedBodyType, setSelectedBodyType] = useState();
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [regionModalOpen, setRegionModalOpen] = useState(false);
  const [regionSearch, setRegionSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState();
  const [regionalSpecsModalOpen, setRegionalSpecsModalOpen] = useState(false);
  const [regionalSpecsSearch, setRegionalSpecsSearch] = useState("");
  const [selectedRegionalSpecs, setSelectedRegionalSpecs] = useState();
  const [selectedSeats, setSelectedSeats] = useState();
  const [selectedDoors, setSelectedDoors] = useState();
  const [selectedFuelType, setSelectedFuelType] = useState();
  const [selectedTransmissionType, setSelectedTransmissionType] = useState();
  const [selectedDriveType, setSelectedDriveType] = useState();
  const [selectedCylinders, setSelectedCylinders] = useState();
  const [mediaPreviewOpen, setMediaPreviewOpen] = useState(false);
  const [mediaPreviewImage, setMediaPreviewImage] = useState("");
  const [mediaFileList, setMediaFileList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMakeCars({ setLoading, setCarMakes });
  }, []);

  useEffect(() => {
    make && fetchModelCars({ setLoading, setCarModels, make });
    setModalName("");
  }, [make]);

  useEffect(() => {
    fetchUpdateOptionsData();
  }, []);

  useEffect(() => {
    make && modalName && yearData && fetchTrimCars();
  }, [make, modalName, yearData]);

  useEffect(() => {
    modalName && make && fetchYearData();
  }, [make, modalName]);

  const fetchUpdateOptionsData = async () => {
    try {
      setLoading(true);
      const response = await carAPI.uploadOptionDetails({});
      const data1 = handleApiResponse(response);
      if (data1) {
        setUpdateData(data1?.data);
      }

      message.success(data1.message || "Fetched successfully");
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to Make car data");
      setUpdateData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrimCars = async () => {
    try {
      setLoading(true);
      const response = await carAPI.trimDetails(make, modalName, yearData);
      const data1 = handleApiResponse(response);

      if (data1) {
        setTrimData(data1?.data);
      }

      message.success(data1.message || "Fetched successfully");
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to Trim car data");
      setTrimData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchYearData = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getYearData(make, modalName);
      const data1 = handleApiResponse(response);

      if (data1) {
        setYearData(data1?.data);
      }

      message.success(data1.message || "Fetched successfully");
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to Year car data");
      setYearData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateData = async () => {
    handlePostData();
    navigate("/landing");
  };

  const handlePostData = async () => {
    const values = await form.validateFields();
    const formData = new FormData();
    formData.append("make", make);
    formData.append("model", modalName);
    formData.append("year", selectedYear);
    formData.append("price", "");
    formData.append("description", values?.description);
    formData.append("ad_title", values?.adTitle);
    formData.append("color", selectedColor);
    formData.append("mileage", values?.kilometers);
    formData.append("fuel_type", values?.fuelType);
    formData.append("transmission_type", values?.transmissionType);
    formData.append("body_type", values?.bodyType);
    formData.append("condition", values?.condition);
    formData.append("location", selectedRegion);
    formData.append("interior", values?.interior);
    formData.append("trim", selectedBrandName);
    formData.append("regional_specs", selectedRegionalSpecs);
    formData.append("badges", values?.badges);
    formData.append("warranty_date", values?.warrantyDate);
    formData.append("accident_history", values?.accidentHistory);
    formData.append("number_of_seats", values?.seats);
    formData.append("number_of_doors", values?.doors);
    formData.append("drive_type", values?.driveType);
    formData.append("engine_cc", values?.engineCC);
    formData.append("extra_features", values?.extraFeatures);
    formData.append("consumption", values?.consumption);
    formData.append("no_of_cylinders", values?.cylinders);
    formData.append("payment_option", "");
    formData.append("draft", "");

    values.media?.forEach((file) => {
      formData.append("car_image", file.originFileObj);
    });
    try {
      setLoading(true);

      const response = await carAPI.createCar(formData);
      const data1 = handleApiResponse(response);

      if (data1) {
        setAddData(data1?.data);
      }
      message.success(data1.message || "Fetched successfully");
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to Make car data");
      setAddData([]);
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleFinish = (values) => {
    const images = values.media?.map((file) => file.originFileObj);

    message.success("Form submitted! Check console for output.");
  };

  const ExteriorColorInput = () => (
    <div
      className={`exterior-color-input${!selectedColor ? " placeholder" : ""}`}
      onClick={() => setColorModalOpen(true)}
    >
      <span
        style={{
          fontSize: 14,
        }}
      >
        {selectedColor || "Beige"}
      </span>
      <RightOutlined className="color-arrow" />
    </div>
  );

  const filteredColors = updateData?.colours?.filter((opt) =>
    opt.colour?.toLowerCase().includes(colorSearch?.toLowerCase())
  );

  const TrimInput = () => (
    <div
      className={`trim-input${!selectedTrim ? " placeholder" : ""}`}
      onClick={() => setTrimModalOpen(true)}
    >
      <span
        style={{
          fontSize: 14,
        }}
      >
        {selectedTrim || "B200"}
      </span>
      <RightOutlined className="trim-arrow" />
    </div>
  );

  const BrandInput = () => (
    <div
      className={`brand-input${!selectedBrand ? " placeholder" : ""}`}
      onClick={() => setBrandModalOpen(true)}
    >
      {selectedBrand && (
        <img
          src={brandOptions.find((b) => b.value === selectedBrand)?.img}
          alt="brand"
          className="brand-input-img"
        />
      )}
      <span
        style={{
          fontSize: 14,
        }}
      >
        {selectedBrand || "brand and model of your car"}
      </span>
      <RightOutlined className="brand-arrow" />
    </div>
  );

  const YearInput = () => (
    <div
      className={`year-input${!selectedYear ? " placeholder" : ""}`}
      onClick={() => setYearModalOpen(true)}
    >
      <span
        style={{
          fontSize: 14,
        }}
      >
        {selectedYear || "2023"}
      </span>
      <RightOutlined className="year-arrow" />
    </div>
  );

  const RegionInput = () => (
    <div
      className={`region-input${!selectedRegion ? " placeholder" : ""}`}
      onClick={() => setRegionModalOpen(true)}
    >
      <span
        style={{
          fontSize: 14,
        }}
      >
        {selectedRegion || "Select Region"}
      </span>
      <RightOutlined className="region-arrow" />
    </div>
  );

  const RegionalSpecsInput = () => (
    <div
      className={`regionalspecs-input${
        !selectedRegionalSpecs ? " placeholder" : ""
      }`}
      onClick={() => setRegionalSpecsModalOpen(true)}
    >
      <span
        style={{
          fontSize: 14,
        }}
      >
        {selectedRegionalSpecs || "Select Specs"}
      </span>
      <RightOutlined className="regionalspecs-arrow" />
    </div>
  );

  const handleEvaluateCar = () => {
    message.info("Evaluate Car clicked");
  };
  const handleSaveDraft = async () => {
    const values = await form.validateFields();
    const formData = new FormData();
    formData.append("make", make);
    formData.append("model", modalName);
    formData.append("year", selectedYear);
    formData.append("price", "");
    formData.append("description", values?.description);
    formData.append("ad_title", values?.adTitle);
    formData.append("color", selectedColor);
    formData.append("mileage", values?.kilometers);
    formData.append("fuel_type", values?.fuelType);
    formData.append("transmission_type", values?.transmissionType);
    formData.append("body_type", values?.bodyType);
    formData.append("condition", values?.condition);
    formData.append("location", selectedRegion);
    formData.append("interior", values?.interior);
    formData.append("trim", selectedBrandName);
    formData.append("regional_specs", selectedRegionalSpecs);
    formData.append("badges", values?.badges);
    formData.append("warranty_date", values?.warrantyDate);
    formData.append("accident_history", values?.accidentHistory);
    formData.append("number_of_seats", values?.seats);
    formData.append("number_of_doors", values?.doors);
    formData.append("drive_type", values?.driveType);
    formData.append("engine_cc", values?.engineCC);
    formData.append("extra_features", values?.extraFeatures);
    formData.append("consumption", values?.consumption);
    formData.append("no_of_cylinders", values?.cylinders);
    formData.append("payment_option", "");
    formData.append("draft", "");

    values.media?.forEach((file) => {
      formData.append("car_image", file.originFileObj);
    });
    try {
      setLoading(true);
      const response = await carAPI.saveDraftCar(formData);
      const data1 = handleApiResponse(response);

      if (data1) {
        setDraftData(data1);
      }

      message.success(data1.message || "Saved Draft Data successfully");
      navigate("/landing");
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to Save Draft car data");
      setDraftData([]);
    } finally {
      setLoading(false);
    }
  };
  const handlePostAndNew = () => {
    handlePostData();
    form.resetFields();
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleMediaPreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setMediaPreviewImage(file.url || file.preview);
    setMediaPreviewOpen(true);
  };

  const handleMediaChange = ({ fileList: newFileList }) => {
    const filteredList = newFileList?.filter((file) => {
      return (file.size || file.originFileObj?.size) / 1024 / 1024 < 5;
    });
    setMediaFileList(filteredList);
    form.setFieldsValue({ media: filteredList });
  };
  const beforeMediaUpload = (file) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("File must be smaller than 5MB!");
      return Promise.reject();
    }
    return true;
  };
  const mediaUploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined style={{ fontSize: 32, color: "#1890ff" }} />
      <div
        style={{
          marginTop: 8,
          fontWeight: 500,
          color: "#008AD5",
          fontSize: 16,
        }}
      >
        Add Media
      </div>
    </button>
  );

  return (
    <>
      <div className="page-header">
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
          Sell Your Car In IRAQ
        </div>
        <div style={{ fontSize: 11 }}>Post an ad in just 3 simple steps</div>
      </div>
      <div className="sell-container">
        <Card
          title="Car Description"
          style={{
            borderRadius: 8,
            boxShadow: "0 2px 8px #f0f1f2",
            marginBottom: 24,
            border: "1px solid #e5e6e8",
            padding: 24,
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            scrollToFirstError
            initialValues={{ condition: "", year: new Date().getFullYear() }}
          >
            <Row gutter={24}>
              <Col xs={24} md={10}>
                <Form.Item
                  name="media"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  rules={[
                    {
                      required: true,
                      message: "Please add at least one media file!",
                    },
                  ]}
                >
                  {mediaFileList.length === 0 ? (
                    <div
                      className="custom-upload-area"
                      onClick={() =>
                        document.getElementById("hidden-upload-input").click()
                      }
                    >
                      <img
                        src={addMediaSvg}
                        alt="Add Media"
                        className="custom-upload-icon"
                      />
                      <Button
                        className="custom-upload-btn"
                        type="link"
                        onClick={(e) => {
                          e.stopPropagation();
                          document
                            .getElementById("hidden-upload-input")
                            .click();
                        }}
                      >
                        Add Media
                      </Button>
                      <div className="custom-upload-info">
                        5MB maximum file size accepted in the following format :
                        jpg , jpeg, png, gif, mp4
                      </div>
                      <input
                        id="hidden-upload-input"
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.gif,.mp4"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          const newFileList = files?.map((file, idx) => ({
                            uid: `${Date.now()}-${idx}`,
                            name: file.name,
                            status: "done",
                            originFileObj: file,
                          }));
                          setMediaFileList(newFileList);
                          form.setFieldsValue({ media: newFileList });
                        }}
                      />
                    </div>
                  ) : (
                    <>
                      <Upload
                        action="#"
                        listType="picture-card"
                        fileList={mediaFileList}
                        onPreview={handleMediaPreview}
                        onChange={handleMediaChange}
                        beforeUpload={beforeMediaUpload}
                        showUploadList={{
                          showRemoveIcon: true,
                          showPreviewIcon: true,
                        }}
                        multiple
                        maxCount={8}
                        accept=".jpg,.jpeg,.png,.gif,.mp4"
                        customRequest={({ file, onSuccess }) =>
                          setTimeout(() => onSuccess("ok"), 0)
                        }
                      >
                        {mediaFileList.length < 8 && mediaUploadButton}
                      </Upload>
                      {mediaFileList.length > 0 && (
                        <div
                          className="media-info-text"
                          style={{ marginTop: "8px", color: "#666" }}
                        >
                          Tap on the images to edit them, or press, hold and
                          move for reordering{" "}
                        </div>
                      )}
                      {mediaPreviewImage && (
                        <Image
                          wrapperStyle={{ display: "none" }}
                          preview={{
                            visible: mediaPreviewOpen,
                            onVisibleChange: (visible) =>
                              setMediaPreviewOpen(visible),
                            afterOpenChange: (visible) =>
                              !visible && setMediaPreviewImage(""),
                          }}
                          src={mediaPreviewImage}
                        />
                      )}
                    </>
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} md={14}>
                <Form.Item
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#0A0A0B",
                  }}
                  label="Ad Title"
                  name="adTitle"
                >
                  <Input placeholder="Ad Title" />
                </Form.Item>
                <Form.Item
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#0A0A0B",
                  }}
                  label="Description"
                  name="description"
                >
                  <TextArea rows={4} placeholder="Choose" />
                </Form.Item>
              </Col>
            </Row>

            <Card
              title="Enter Your Car Information"
              style={{
                marginTop: 15,
                marginBottom: 32,
                padding: 24,
              }}
            >
              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: "#0A0A0B",
                    }}
                    label="Car Information"
                    name="brand"
                  >
                    <BrandInput />
                  </Form.Item>
                  <Modal
                    open={brandModalOpen}
                    onCancel={() => setBrandModalOpen(false)}
                    footer={null}
                    title={
                      <div className="brand-modal-title-row">
                        <span>What is the brand of your car? </span>
                      </div>
                    }
                    width={600}
                  >
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder="Search By Typing"
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      className="brand-modal-search"
                    />
                    <div className="brand-modal-grid">
                      {carMakes
                        ?.filter((opt) =>
                          opt?.name
                            ?.toLowerCase()
                            ?.includes(brandSearch?.toLowerCase())
                        )
                        ?.map((opt) => (
                          <div
                            key={opt.name}
                            className={`brand-option${
                              selectedBrand === opt.name ? " selected" : ""
                            }`}
                            onClick={() => {
                              setSelectedBrand(opt.name);
                              setMake(opt.name);
                              setBrandModalOpen(false);
                              form.setFieldsValue({ brand: opt.name });
                              setBrandNameOpen(true);
                            }}
                          >
                            <img
                              src={opt.img}
                              alt={opt.value}
                              className="brand-option-img"
                            />
                            <span className="brand-option-label">
                              {opt.name}
                            </span>
                          </div>
                        ))}
                    </div>
                  </Modal>

                  <Modal
                    open={brandNameOpen}
                    onCancel={() => setBrandNameOpen(false)}
                    footer={null}
                    title={
                      <div className="trim-modal-title-row">
                        <span>What is the Model of your car?</span>
                      </div>
                    }
                    width={500}
                  >
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder="Search By Typing"
                      value={modalName}
                      onChange={(e) => setModalName(e.target.value)}
                      className="trim-modal-search"
                    />
                    <div className="trim-modal-list">
                      {carModels
                        ?.filter((opt) =>
                          opt.model_name
                            .toLowerCase()
                            .includes(trimSearch.toLowerCase())
                        )
                        ?.map((opt) => (
                          <div
                            key={opt.model_name}
                            className={`trim-modal-option${
                              selectedBrandName === opt.model_name
                                ? " selected"
                                : ""
                            }`}
                            onClick={() => {
                              setSelectedBrandName(opt.model_name);
                              setModalName(opt.model_name);
                              form.setFieldsValue({ trim: opt.model_name });
                              setBrandNameOpen(false);
                            }}
                          >
                            {opt.model_name}
                          </div>
                        ))}
                    </div>
                  </Modal>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 12,
                      color: "#0A0A0B",
                    }}
                    label="Exterior Color"
                    name="exteriorColor"
                  >
                    <ExteriorColorInput />
                  </Form.Item>
                  <Modal
                    open={colorModalOpen}
                    onCancel={() => setColorModalOpen(false)}
                    footer={null}
                    title={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span>What is the brand of your car?</span>
                      </div>
                    }
                    width={500}
                  >
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder="Search By Typing"
                      value={colorSearch}
                      onChange={(e) => setColorSearch(e.target.value)}
                      style={{ marginBottom: 16, borderRadius: 8 }}
                    />
                    <div className="color-modal-grid">
                      {filteredColors?.map((opt) => (
                        <div
                          key={opt.colour}
                          className={`color-option${
                            selectedColor === opt.colour ? " selected" : ""
                          }`}
                          onClick={() => {
                            setSelectedColor(opt.colour);
                            setColorModalOpen(false);
                            form.setFieldsValue({ exteriorColor: opt.colour });
                          }}
                        >
                          <span
                            className="color-swatch-modal"
                            style={{
                              background: opt.color,
                              border: opt.border || "1px solid #d9d9d9",
                            }}
                          />
                          <span className="color-option-label">
                            {opt.colour}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Modal>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 12,
                      color: "#0A0A0B",
                    }}
                    label="Trim"
                    name="trim"
                  >
                    <TrimInput />
                  </Form.Item>
                  <Modal
                    open={trimModalOpen}
                    onCancel={() => setTrimModalOpen(false)}
                    footer={null}
                    title={
                      <div className="trim-modal-title-row">
                        <span>What is the Trim of your car?</span>
                      </div>
                    }
                    width={500}
                  >
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder="Search By Typing"
                      value={trimSearch}
                      onChange={(e) => setTrimSearch(e.target.value)}
                      className="trim-modal-search"
                    />
                    <div className="trim-modal-list">
                      {trimData
                        ?.filter((opt) =>
                          opt?.trim_name
                            ?.toLowerCase()
                            ?.includes(trimSearch.toLowerCase())
                        )
                        ?.map((opt) => (
                          <div
                            key={opt.trim_name}
                            className={`trim-modal-option${
                              selectedTrim === opt.value ? " selected" : ""
                            }`}
                            onClick={() => {
                              setSelectedTrim(opt.trim_name);
                              setTrimModalOpen(false);
                              form.setFieldsValue({ trim: opt.trim_name });
                            }}
                          >
                            {opt.trim_name}
                          </div>
                        ))}
                    </div>
                  </Modal>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 12,
                      color: "#0A0A0B",
                    }}
                    label="Regional Specs"
                    name="regionalSpecs"
                  >
                    <RegionalSpecsInput />
                  </Form.Item>
                  <Modal
                    open={regionalSpecsModalOpen}
                    onCancel={() => setRegionalSpecsModalOpen(false)}
                    footer={null}
                    title={
                      <div className="regionalspecs-modal-title-row">
                        <span>What is the Regional Specs of your car?</span>
                      </div>
                    }
                    width={500}
                  >
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder="Search By Typing"
                      value={regionalSpecsSearch}
                      onChange={(e) => setRegionalSpecsSearch(e.target.value)}
                      className="regionalspecs-modal-search"
                    />
                    <div className="regionalspecs-modal-list">
                      {updateData?.regional_specs
                        ?.filter((opt) =>
                          opt?.regional_spec
                            ?.toLowerCase()
                            ?.includes(regionalSpecsSearch.toLowerCase())
                        )
                        ?.map((opt) => (
                          <div
                            key={opt.regional_spec}
                            className={`regionalspecs-modal-option${
                              selectedRegionalSpecs === opt.regional_spec
                                ? " selected"
                                : ""
                            }`}
                            onClick={() => {
                              setSelectedRegionalSpecs(opt.regional_spec);
                              setRegionalSpecsModalOpen(false);
                              form.setFieldsValue({
                                regionalSpecs: opt.regional_spec,
                              });
                            }}
                          >
                            {opt.regional_spec}
                          </div>
                        ))}
                    </div>
                  </Modal>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 12,
                      color: "#0A0A0B",
                    }}
                    label="Body Type"
                    name="bodyType"
                  >
                    <div className="option-box-group">
                      {bodyTypes?.map((opt) => (
                        <div
                          key={opt}
                          className={`option-box${
                            selectedBodyType === opt ? " selected" : ""
                          }`}
                          onClick={() => {
                            setSelectedBodyType(opt);
                            form.setFieldsValue({ bodyType: opt });
                          }}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 12,
                      color: "#0A0A0B",
                    }}
                    label="Condition"
                    name="condition"
                  >
                    <div className="option-box-group">
                      {conditionOptions?.map((opt) => (
                        <div
                          key={opt.value}
                          className={`option-box${
                            selectedCondition === opt.value ? " selected" : ""
                          }`}
                          onClick={() => {
                            setSelectedCondition(opt.value);
                            form.setFieldsValue({ condition: opt.value });
                          }}
                        >
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={24}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 12,
                      color: "#0A0A0B",
                    }}
                    label="Badges"
                    name="badges"
                  >
                    <div className="option-box-group">
                      {badges?.map((opt) => (
                        <div
                          key={opt}
                          className={`option-box${
                            selectedBadges.includes(opt) ? " selected" : ""
                          }`}
                          onClick={() => {
                            let newBadges;
                            if (selectedBadges.includes(opt)) {
                              newBadges = selectedBadges?.filter(
                                (b) => b !== opt
                              );
                            } else {
                              newBadges = [...selectedBadges, opt];
                            }
                            setSelectedBadges(newBadges);
                            form.setFieldsValue({ badges: newBadges });
                          }}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: "#0A0A0B",
                    }}
                    label="Kilometers*"
                    name="kilometers"
                    rules={[
                      { required: false, message: "Please enter kilometers!" },
                    ]}
                    required={false}
                    validateTrigger="onBlur"
                  >
                    <Input
                      style={{
                        fontSize: 14,
                      }}
                      placeholder="Choose"
                      type="number"
                      min={0}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: "#0A0A0B",
                    }}
                    label="Year"
                    name="year"
                  >
                    <YearInput />
                  </Form.Item>
                  <Modal
                    open={yearModalOpen}
                    onCancel={() => setYearModalOpen(false)}
                    footer={null}
                    title={
                      <div className="year-modal-title-row">
                        <span>What is the Year of your car?</span>
                      </div>
                    }
                    width={500}
                  >
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder="Search By Typing"
                      value={yearSearch}
                      onChange={(e) => setYearSearch(e.target.value)}
                      className="year-modal-search"
                    />
                    <div className="year-modal-list">
                      {yearData
                        ?.filter((opt) => opt.year.includes(yearSearch))
                        ?.map((opt) => (
                          <div
                            key={opt.year}
                            className={`year-modal-option${
                              selectedYear === opt.year ? " selected" : ""
                            }`}
                            onClick={() => {
                              setSelectedYear(opt.year);
                              setYearModalOpen(false);
                              form.setFieldsValue({ year: opt.year });
                            }}
                          >
                            {opt.year}
                          </div>
                        ))}
                    </div>
                  </Modal>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: "#0A0A0B",
                    }}
                    label="Region"
                    name="region"
                  >
                    <RegionInput />
                  </Form.Item>
                  <Modal
                    open={regionModalOpen}
                    onCancel={() => setRegionModalOpen(false)}
                    footer={null}
                    title={
                      <div className="region-modal-title-row">
                        <span>Where is the Location of your car?</span>
                      </div>
                    }
                    width={500}
                  >
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder="Search By Typing"
                      value={regionSearch}
                      onChange={(e) => setRegionSearch(e.target.value)}
                      className="region-modal-search"
                    />
                    <div className="region-modal-list">
                      {updateData?.locations
                        ?.filter((opt) =>
                          opt?.location
                            ?.toLowerCase()
                            ?.includes(regionSearch?.toLowerCase())
                        )
                        ?.map((opt) => (
                          <div
                            key={opt?.location}
                            className={`region-modal-option${
                              selectedRegion === opt?.location
                                ? " selected"
                                : ""
                            }`}
                            onClick={() => {
                              setSelectedRegion(opt?.location);
                              setRegionModalOpen(false);
                              form.setFieldsValue({ region: opt?.location });
                            }}
                          >
                            {opt?.location}
                          </div>
                        ))}
                    </div>
                  </Modal>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: "#0A0A0B",
                    }}
                    label="Warranty Date (Optional)"
                    name="warrantyDate"
                  >
                    <DatePicker style={{ width: "100%" }} format="MM/DD/YYYY" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: "#0A0A0B",
                    }}
                    label="Accident History"
                    name="accidentHistory"
                  >
                    <Select placeholder="Select The accident history of your car">
                      {updateData?.accident_histories?.map((hist) => (
                        <Option key={hist.id} value={hist.id}>
                          {hist.accident_history}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: "#0A0A0B",
                    }}
                    label="Regional Specs"
                    name="regionalSpecs2"
                  >
                    <Select placeholder="Select the specs of your car">
                      {updateData?.regional_specs?.map((spec) => (
                        <Option key={spec.id} value={spec.id}>
                          {spec.regional_spec}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Card title="Additional Details" style={{ padding: " 0px 24px" }}>
              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: "#0A0A0B",
                    }}
                    label="Number of seats"
                    name="seats"
                  >
                    <div className="option-box-group">
                      {seats?.map((opt) => (
                        <div
                          key={opt}
                          className={`option-box${
                            selectedSeats === opt ? " selected" : ""
                          }`}
                          onClick={() => {
                            setSelectedSeats(opt);
                            form.setFieldsValue({ seats: opt });
                          }}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </Form.Item>
                </Col>
                <Col xs={24} md={4}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: "#0A0A0B",
                    }}
                    label="Number of doors"
                    name="doors"
                  >
                    <div className="option-box-group">
                      {doors?.map((opt) => (
                        <div
                          key={opt}
                          className={`option-box${
                            selectedDoors === opt ? " selected" : ""
                          }`}
                          onClick={() => {
                            setSelectedDoors(opt);
                            form.setFieldsValue({ doors: opt });
                          }}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </Form.Item>
                </Col>
                <Col xs={24} md={7}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: "#0A0A0B",
                    }}
                    label="Fuel Type"
                    name="fuelType"
                  >
                    <div className="option-box-group">
                      {fuelTypes?.map((opt) => (
                        <div
                          key={opt}
                          className={`option-box${
                            selectedFuelType === opt ? " selected" : ""
                          }`}
                          onClick={() => {
                            setSelectedFuelType(opt);
                            form.setFieldsValue({ fuelType: opt });
                          }}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: "#0A0A0B",
                    }}
                    label="Transmission Type"
                    name="transmissionType"
                  >
                    <div className="option-box-group">
                      {transmissionTypes?.map((opt) => (
                        <div
                          key={opt}
                          className={`option-box${
                            selectedTransmissionType === opt ? " selected" : ""
                          }`}
                          onClick={() => {
                            setSelectedTransmissionType(opt);
                            form.setFieldsValue({ transmissionType: opt });
                          }}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: "#0A0A0B",
                    }}
                    label="Drive Type"
                    name="driveType"
                  >
                    <div className="option-box-group">
                      {driveTypes?.map((opt) => (
                        <div
                          key={opt}
                          className={`option-box${
                            selectedDriveType === opt ? " selected" : ""
                          }`}
                          onClick={() => {
                            setSelectedDriveType(opt);
                            form.setFieldsValue({ driveType: opt });
                          }}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: "#0A0A0B",
                    }}
                    label="Engine CC"
                    name="engineCC"
                  >
                    <Input
                      style={{
                        fontSize: 14,
                      }}
                      placeholder="1600"
                      type="number"
                      min={0}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: "#0A0A0B",
                    }}
                    label="Consumption (1/100 km)"
                    name="consumption"
                  >
                    <Input
                      style={{
                        fontSize: 14,
                      }}
                      placeholder="20"
                      type="number"
                      min={0}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: "#0A0A0B",
                    }}
                    label="Extra Features"
                    name="extraFeatures"
                  >
                    <Select placeholder="Choose">
                      {updateData?.extra_features?.map((int1) => (
                        <Option key={int1.id} value={int1.id}>
                          {int1.extra_feature}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: "#0A0A0B",
                    }}
                    label="Interior"
                    name="interior"
                  >
                    <Select placeholder="Choose">
                      {updateData?.interiors?.map((int) => (
                        <Option key={int.id} value={int.id}>
                          {int.interior}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={18}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: "#0A0A0B",
                    }}
                    label="Number of Cylinders"
                    name="cylinders"
                  >
                    <div className="option-box-group">
                      {cylinders?.map((opt) => (
                        <div
                          key={opt}
                          className={`option-box${
                            selectedCylinders === opt ? " selected" : ""
                          }`}
                          onClick={() => {
                            setSelectedCylinders(opt);
                            form.setFieldsValue({ cylinders: opt });
                          }}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Form.Item style={{ marginTop: 16 }}>
              <div className="submit-btn-group">
                <Button
                  size="small"
                  className="btn-outline-blue"
                  onClick={() => handleEvaluateCar}
                  type="default"
                >
                  Evaluate Car
                </Button>
                <Button
                  size="small"
                  className="btn-outline-blue"
                  onClick={() => handleSaveDraft}
                  type="default"
                >
                  Save as draft
                </Button>
                <Button
                  size="small"
                  className="btn-solid-blue"
                  type="primary"
                  htmlType="submit"
                  onClick={() => handleCreateData}
                >
                  Create
                </Button>
                <Button
                  size="small"
                  className="btn-solid-blue"
                  onClick={() => handlePostAndNew}
                  type="primary"
                >
                  Create & New
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default Sell;
