import React from "react";
import "./App.css";
import PlayBack from "./Components/Playback/Playback";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <PlayBack
          navLinks={[
            { title: "Home", route: "/" },

            {
              title: "Run A Completed Capture",
              route: "/runcapture"
            }
          ]}
        />
      </div>
    );
  }
}

export default App;
