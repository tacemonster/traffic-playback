import React from "react";
import logo from "./logo.svg";
import "./App.css";
import PlayBack from "./Components/Playback/Playback";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <PlayBack
          navLinks={[
            { title: "Home", route: "/" },
            { title: "In Progress Jobs", route: "/inprogressjobs" },
            { title: "Completed Jobs", route: "/completedjobs" },
            { title: 'Statistic', route: '/stats' },
            { title: 'Real Time', route: '/realtime' },
          ]}
        />
      </div>
    );
  }
}

export default App;
