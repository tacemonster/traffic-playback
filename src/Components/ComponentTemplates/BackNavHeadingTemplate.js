import React from "react";
import BackNavButton from "./BackNavButton";

function BackNavHeadingTemplate(props) {
  return (
    <div className="row justify-content-end">
      <BackNavButton />
      <h1
        className={
          props.classNameGenericHeading + "col-12 generic-heading yellow"
        }
      >
        {props.children}
      </h1>
    </div>
  );
}

export default BackNavHeadingTemplate;
