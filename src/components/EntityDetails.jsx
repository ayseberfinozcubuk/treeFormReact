import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const EntityDetails = () => {
  const { id } = useParams(); // Get ID from route
  const [emitter, setEmitter] = useState(null);

  useEffect(() => {
    // Fetch the specific emitter details from API
    axios
      .get(`http://localhost:5000/api/Emitter/${id}`)
      .then((response) => setEmitter(response.data))
      .catch((error) =>
        console.error("Error fetching emitter details:", error)
      );
  }, [id]);

  if (!emitter) return <p>Loading...</p>;

  // Dynamically generate the details from the emitter object
  const renderDetails = () => {
    return Object.entries(emitter).map(([key, value]) => (
      <p key={key}>
        <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
        {Array.isArray(value) ? `[${value.length}]` : value}
      </p>
    ));
  };

  return (
    <div>
      <h1>Emitter Details</h1>
      {renderDetails()}
    </div>
  );
};

export default EntityDetails;
