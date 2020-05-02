import React from 'react'
import {useHistory }from "react-router-dom"
import TemplateStyles from './TemplateStyles'

//This button template is used to navigate backwards in the app.
function BackNavButton(props){
    let history = useHistory();
    return (  
    <button onClick={() =>{history.goBack()}}  className={TemplateStyles.BackNavButton}>
        Back
    </button>);
}

export default BackNavButton;