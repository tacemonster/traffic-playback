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
            { title: "In Progress Jobs", route: "/inprogressjobs" },
            { title: "Completed Jobs", route: "/completedjobs" }
          ]}
        />
      </div>
    );
  }
}

export default App;
