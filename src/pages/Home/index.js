import React, { useEffect } from "react";
import styles from "./index.module.scss";


const HomeScreen = () => {

  useEffect(() => {
    // to do fetch data from follow api
    // https://api.thunder.softoo.co/vis/api/dashboard/ssu/fixed
  }, []);

  return (
    <div className={`${styles.homePage}`}>
      Home page
    </div>
  );
};

export default HomeScreen;
