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
            { title: 'Playback Jobs', route: '/playback' },
            { title: 'Capture Jobs', route: '/capture' },
            {
              title: "Run A Completed Capture",
              route: "/runcapture"
            },
            { title: 'Statistic', route: '/stats' },
            { title: 'Real Time', route: '/realtime' },
          ]}
        />
      </div>
    );
  }
}

export default App;
