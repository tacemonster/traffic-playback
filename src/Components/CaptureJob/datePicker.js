import React, { Component } from "react";
import DatePicker from "react-datepicker";
import styles from './newCaptureJob.css';

const Date = (props) => {
  return (
    <div className="form-group">
      <DatePicker
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
