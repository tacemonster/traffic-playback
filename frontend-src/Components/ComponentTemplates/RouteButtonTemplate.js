import React from 'react';
import {useHistory }from "react-router-dom";
import TemplateStyles from './TemplateStyles.js';

//This button is used to navigate to a custom route in the app.
// To specify which route to navigate to simply specify the route in the route property.
// You can customize the button name through props.children.
//If props.children is not specified, then the button's name defaults to success.
function RouteButtonTemplate(props){ 
    let history = useHistory(); //push props.route to history or back home (/) if not specified.

    return (
    <button onClick={() =>{history.push(props.route || "/")}}  className={TemplateStyles.NavListButton}>
        {props.children || "Select"}
    </button>);
}

export default RouteButtonTemplate;