import React from "react";
import { Link } from "react-router-dom";
import TemplateStyles from "../ComponentTemplates/TemplateStyles";

//This stateless  component returns the navbutton of the navbar.
function NavButton(props) {
  return (
    <div
      className={props.buttonClass}
      onClick={e => props.navDrawerButtonClick(e)}
    >
      {""}
    </div>
  );
}

//This stateless component returns the contents of the navbar when it is retracted.
function RetractedNavContents(props) {
  return (
    <React.Fragment>
      <NavButton
        buttonClass={props.buttonClass}
        navDrawerButtonClick={props.navDrawerButtonClick}
      />
      <span className="light-red">App={"{--Playback--}"}</span>
      <div className="white">. . .</div>
    </React.Fragment>
  );
}
//This component returns rendered contents for the navdrawer when it is extended.
function ExtendedNavContents(props) {
  var keyIndex = 0;

  const linkArray = props.navLinks.map(link => {
    keyIndex++;

    return (
      <li key={keyIndex} className="nav-link link">
        <Link to={link.route}>
          <span className="white">{"{"}</span>
          <span onClick={props.navDrawerButtonClick} className="yellow">
            {link.title}
          </span>
          <span className="white">{"};"}</span>
        </Link>
      </li>
    );
  });

  return (
    <React.Fragment>
      <NavButton
        buttonClass={props.buttonClass}
        navDrawerButtonClick={props.navDrawerButtonClick}
      />
      <ul>{linkArray}</ul>
    </React.Fragment>
  );
}

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { extended: false };
    this.navDrawerButtonClick = this.navDrawerButtonClick.bind(this);
  }

  navDrawerButtonClick() {
    this.setState({ extended: !this.state.extended });
  }

  render() {
    var nav_contents = this.state.extended ? (
      <ExtendedNavContents
        navLinks={this.props.navLinks}
        buttonClass={TemplateStyles.NavButton}
        navDrawerButtonClick={this.navDrawerButtonClick}
      />
    ) : (
      <RetractedNavContents
        buttonClass={TemplateStyles.NavButton}
        navDrawerButtonClick={this.navDrawerButtonClick}
      />
    );

    return <nav className={TemplateStyles.NavBar}>{nav_contents}</nav>;
  }
}

export default NavBar;
