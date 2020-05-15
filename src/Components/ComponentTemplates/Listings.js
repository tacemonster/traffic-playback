import React from "react";
import RouteButtonTemplate from "./RouteButtonTemplate";
import TemplateStyles from "./TemplateStyles";

//This component generates a single job listing which consists of text,
//and several buttons we can use to perform actions on that particular job listing.
function NavListing(props) {
  var handlerIter = 0;

  let buttons = props.buttons.map(button => {
    let ret_val = (
      <RouteButtonTemplate route={button.route}>
        {button.name}{" "}
      </RouteButtonTemplate>
    );
    handlerIter++;

    return ret_val;
  });

  return (
    <section className={TemplateStyles.customRow}>
      <div className={TemplateStyles.NavHeadingText}> {props.value}</div>
      <div className={TemplateStyles.NavHeadingButtons}>{buttons}</div>
    </section>
  );
}

export default NavListing;
