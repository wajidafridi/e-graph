import React from "react";
import { Link } from "react-router-dom";
// @import styles
import styles from "./index.module.scss";

const NotFound = () => {
  return (
    <div className={styles.errorPage}>
      <div className={`section ${styles.errorContainer}`}>
        <h2>Page Not Found</h2>
        <p className={styles.description}>The requested page does not exist.</p>
        <Link to="/" className="home-link">
          Go to Home Page
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
