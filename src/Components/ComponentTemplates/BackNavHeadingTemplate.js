import React from "react";
import BackNavButton from "./BackNavButton";
import TemplateStyles from "./TemplateStyles";

function BackNavHeadingTemplate(props) {
  return (
    <div className={TemplateStyles.BackNavHeadingRow}>
      <h3 className={TemplateStyles.listingHeader}>{props.children}</h3>
    </div>
  );
}

export default BackNavHeadingTemplate;
