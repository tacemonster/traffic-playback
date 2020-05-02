import React from 'react';
import GenericStyles from './TemplateStyles'
import RouteButtonTemplate from './RouteButtonTemplate';


//This component generates a single job listing which consists of text,
//and several buttons we can use to perform actions on that particular job listing.
function NavListing(props)
{
    var handlerIter = 0;

    let buttons = props.buttons.map((button) => { 

         let ret_val = <RouteButtonTemplate  route={button.route} >{button.name} </RouteButtonTemplate>
         handlerIter++;

         return ret_val;
        })

     

return (
         <section className={"row justify-center row-custom"}>
             <div className={"col-6 col-md-4"}> {props.value}</div>
             <div className={"col-12 col-md-4 row justify-center"}>
                 {buttons}
             </div>
         </section>
        );
}


export default NavListing;