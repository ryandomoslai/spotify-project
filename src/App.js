import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: {
        name: "",
        followers: 0,
      }
    }
  }
  componentDidMount() {
    let accessToken = new URLSearchParams(window.location.search).get('access_token');
    if (!accessToken)
      return;
    fetch('https://api.spotify.com/v1/artists/3WrFJ7ztbogyGnTHbHJFl2/related-artists', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(response => response.json())
      .then(data => console.log(data))
  }

  render() {
    console.log(this.state)
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">{this.state.user.name}'s Playlists</h1>
          <h1>They have {this.state.user.followers} followers!</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={() => {
          window.location = 'http://localhost:8888/login'
          }}>Sign in
        </button>
      </div>
    );
  }
}

export default App;
