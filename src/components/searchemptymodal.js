// // src/components/NoResultsModal.js
// import React from "react";
// import emptysearch from "../assets/images/emptysearch.gif";
// import searchicon from "../assets/images/search_icon.png";

// const Searchemptymodal = ({
//   visible,
//   onClose,
//   make,
//   setMake,
//   model,
//   setModel,
//   bodyType,
//   setBodyType,
//   selectedLocation,
//   setSelectedLocation,
//   onSave,
// }) => {
//   if (!visible) return null;

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         {/* Image */}
//         <img
//           src={emptysearch}
//           alt="No Results"
//           className="modal-image"
//           style={{ maxWidth: "100px", marginBottom: "15px" }}
//         />

//         {/* Heading */}
//         <p
//           style={{
//             fontSize: "16px",
//             color: "#0A0A0B",
//             fontWeight: 700,
//             marginBottom: "4px",
//             textAlign: "center",
//           }}
//         >
//           We didn’t find anything that matches this search
//         </p>

//         {/* Subheading */}
//         <p
//           style={{
//             fontSize: "12px",
//             color: "#898384",
//             fontWeight: 400,
//             marginTop: 0,
//             textAlign: "center",
//           }}
//         >
//           you could try to remove some filters:
//         </p>

//         {/* Filters */}
//         <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
//           {make !== "All" && (
//             <span
//               style={{
//                 background: "#fff",
//                 padding: "5px 10px",
//                 borderRadius: "6px",
//                 margin: "5px",
//                 fontSize: "12px",
//                 cursor: "pointer",
//                 color: "#898384",
//                 borderColor: "#DAE1E7",
//                 borderStyle: "solid",
//                 borderWidth: "1px",
//               }}
//               onClick={() => setMake("All")}
//             >
//               {make}
//             </span>
//           )}

//           {model !== "All Models" && (
//             <span
//               style={{
//                 background: "#fff",
//                 padding: "5px 10px",
//                 borderRadius: "6px",
//                 margin: "5px",
//                 fontSize: "12px",
//                 cursor: "pointer",
//                 color: "#898384",
//                 borderColor: "#DAE1E7",
//                 borderStyle: "solid",
//                 borderWidth: "1px",
//               }}
//               onClick={() => setModel("All Models")}
//             >
//               {model}
//             </span>
//           )}

//           {bodyType !== "All Body Types" && (
//             <span
//               style={{
//                 background: "#fff",
//                 padding: "5px 10px",
//                 borderRadius: "6px",
//                 margin: "5px",
//                 fontSize: "12px",
//                 cursor: "pointer",
//                 color: "#898384",
//                 borderColor: "#DAE1E7",
//                 borderStyle: "solid",
//                 borderWidth: "1px",
//               }}
//               onClick={() => setBodyType("All Body Types")}
//             >
//               {bodyType}
//             </span>
//           )}

//           {selectedLocation !== "Baghdad" && (
//             <span
//               style={{
//                 background: "#fff",
//                 padding: "5px 10px",
//                 borderRadius: "6px",
//                 margin: "5px",
//                 fontSize: "12px",
//                 cursor: "pointer",
//                 color: "#898384",
//                 borderColor: "#DAE1E7",
//                 borderStyle: "solid",
//                 borderWidth: "1px",
//               }}
//               onClick={() => setSelectedLocation("Baghdad")}
//             >
//               {selectedLocation}
//             </span>
//           )}
//         </div>

//         {/* Info text above buttons */}
//         <p
//           style={{
//             fontSize: "12px",
//             color: "#555",
//             textAlign: "center",
//             marginTop: "15px",
//           }}
//         >
//           Or save the search and be notified as soon as we have something for you.
//         </p>

//         {/* Buttons */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             gap: "10px",
//             marginTop: "15px",
//             marginLeft: "10px",
//             marginRight: "10px",
//           }}
//         >
//           <button
//             style={{
//               border: "1px solid #008ad5",
//               background: "white",
//               color: "#008ad5",
//               padding: "8px 20px",
//               borderRadius: "25px",
//               fontSize: "14px",
//               fontWeight: 500,
//               cursor: "pointer",
//             }}
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//           <button
//             style={{
//               background: "#008ad5",
//               color: "#fff",
//               border: "none",
//               padding: "8px 20px",
//               borderRadius: "25px",
//               fontSize: "14px",
//               fontWeight: 500,
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               gap: "6px",
//             }}
//             onClick={() => {
//               onClose();
//               onSave();
//             }}
//           >
//             <img src={searchicon} alt="Save Search" /> Save Search
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Searchemptymodal;

// src/components/NoResultsModal.js
import React from "react";
import emptysearch from "../assets/images/emptysearch.gif";
import searchicon from "../assets/images/search_icon.png";
import { message } from "antd";
import { carAPI } from "../services/api";
import { handleApiResponse, handleApiError } from "../utils/apiUtils";

const Searchemptymodal = ({
  visible,
  onClose,
  make,
  setMake,
  model,
  setModel,
  bodyType,
  setBodyType,
  selectedLocation,
  setSelectedLocation,
  toastmessage,
     
}) => {
  if (!visible) return null;

  const [messageApi, contextHolder] = message.useMessage();

 const handleSaveSearch = async () => {
  try {
    const searchparams = {
      search_query: "",
      make: make || "",
      model: model || "",
      year_min: "",
      year_max: "",
      price_min: "",
      price_max: "",
      location: selectedLocation || "",
      body_type: bodyType || "",
      fuel_type: "",
      transmission: "",
      min_kilometers: "",
      max_kilometers: "",
      number_of_cylinders: "",
      min_consumption: "",
      max_consumption: "",
      colour: "",
      number_of_seats: "",
      extra_features: [],
      number_of_doors: "",
      interior: "",
      payment_options: "",
      page: 1,
      limit: 10,
      newest_listing: true,
    };

    const response = await carAPI.postsavesearches(searchparams);
    const data = handleApiResponse(response);

    if (data?.message) {
      messageApi.open({
        type: "success",
        content: data?.message,
        onClose: () => {
         
          onClose();
        },
      });
    } else {
      message.success({
        content: "Search saved successfully!",
        onClose: () => {
          onClose();
        },
      });
    }

    // ✅ also trigger parent toast immediately (if you still want that)
    toastmessage(data?.message);
  } catch (error) {
    const errorData = handleApiError(error);
    message.error(errorData.message || "Failed to save search");
  }
};


  return (
    <div className="modal-overlay" onClick={onClose}>
      {contextHolder}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Image */}
        <img
          src={emptysearch}
          alt="No Results"
          className="modal-image"
          style={{ maxWidth: "100px", marginBottom: "15px" }}
        />

        {/* Heading */}
        <p
          style={{
            fontSize: "16px",
            color: "#0A0A0B",
            fontWeight: 700,
            marginBottom: "4px",
            textAlign: "center",
          }}
        >
          We didn’t find anything that matches this search
        </p>

        {/* Subheading */}
        <p
          style={{
            fontSize: "12px",
            color: "#898384",
            fontWeight: 400,
            marginTop: 0,
            textAlign: "center",
          }}
        >
          you could try to remove some filters:
        </p>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {make !== "All" && (
            <span style={filterStyle} onClick={() => setMake("All")}>
              {make}
            </span>
          )}

          {model !== "All Models" && (
            <span style={filterStyle} onClick={() => setModel("All Models")}>
              {model}
            </span>
          )}

          {bodyType !== "All Body Types" && (
            <span
              style={filterStyle}
              onClick={() => setBodyType("All Body Types")}
            >
              {bodyType}
            </span>
          )}

          {selectedLocation !== "Baghdad" && (
            <span
              style={filterStyle}
              onClick={() => setSelectedLocation("Baghdad")}
            >
              {selectedLocation}
            </span>
          )}
        </div>

        {/* Info text above buttons */}
        <p
          style={{
            fontSize: "12px",
            color: "#555",
            textAlign: "center",
            marginTop: "15px",
          }}
        >
          Or save the search and be notified as soon as we have something for
          you.
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "15px",
            marginLeft: "10px",
            marginRight: "10px",
          }}
        >
          <button style={cancelBtnStyle} onClick={onClose}>
            Cancel
          </button>
          <button style={saveBtnStyle} onClick={handleSaveSearch}>
            <img src={searchicon} alt="Save Search" /> Save Search
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles for reusability
const filterStyle = {
  background: "#fff",
  padding: "5px 10px",
  borderRadius: "6px",
  margin: "5px",
  fontSize: "12px",
  cursor: "pointer",
  color: "#898384",
  borderColor: "#DAE1E7",
  borderStyle: "solid",
  borderWidth: "1px",
};

const cancelBtnStyle = {
  border: "1px solid #008ad5",
  background: "white",
  color: "#008ad5",
  padding: "8px 20px",
  borderRadius: "25px",
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",
};

const saveBtnStyle = {
  background: "#008ad5",
  color: "#fff",
  border: "none",
  padding: "8px 20px",
  borderRadius: "25px",
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

export default Searchemptymodal;
