import React from "react";
import BackNavButton from "./BackNavButton";
import TemplateStyles from "./TemplateStyles";

function BackNavHeadingTemplate(props) {
  return (
    <div className={TemplateStyles.BackNavHeadingRow}>
      <h1 className={TemplateStyles.BackNavHeading}>{props.children}</h1>
      <BackNavButton />
    </div>
  );
}

export default BackNavHeadingTemplate;
