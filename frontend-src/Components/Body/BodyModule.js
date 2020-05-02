
import React from 'react';
import  './BodyModuleStyle.css';


class Body extends React.Component {

    constructor(props)
    {
        super(props)
    }

    render()
    {
        return (
        <div className={"app-body w-100 container-sm app-body align-items-center"}>
            <div className="body">
                {this.props.children}
            </div>
        </div>);
    }

   
}

export default Body;
