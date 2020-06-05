import React, { Component } from "react";
import DatePicker from "react-datepicker";
import styles from "./newPlayback.css";

import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

const Date = props => {
  return (
    <div className="tab">
      <DatePicker
        className="tab"
        selected={props.selected}
        onChange={props.onChange}
        onSelect={props.onSelect}
        showTimeSelect
        dateFormat="Pp"
      />
    </div>
  );
};

export default Date;
