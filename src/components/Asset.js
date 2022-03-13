import React from "react";
import Spinner from "react-bootstrap/Spinner";
import styles from "../styles/Asset.module.css";
import NoResults from "../assets/no-results.png";

const Asset = ({ spinner, noResults, src, message }) => {
  return (
    <div className={`${styles.Asset} p-4`}>
      {noResults && <img src={NoResults} alt="Not found" />}
      {spinner && <Spinner animation="border" />}
      {src && <img src={src} alt={message} />}
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
};

export default Asset;
