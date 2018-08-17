import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {


  constructor() {
    super();

    this.array = []

    this.state = {
      user: {
        name: "",
        followers: 0,
      }
    }
  }
  async componentDidMount() {
    let accessToken = new URLSearchParams(window.location.search).get('access_token')
    if (accessToken == null) {
      return;
    }
    fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(response => response.json())
      .then(data => this.setState({
        user: {
          name: data.id,
          followers: data.followers.total
        }
      }))

    let artistRecurse = await fetch(  // David Bowie
      'https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy', {
        headers: { 'Authorization': 'Bearer ' + accessToken }
      }).then(response => response.json())

    let artistDest = "0UKfenbZb15sqhfPC6zbt3"  // Divo
    let path = artistRecurse.name + " "
    let count = 0

    this.recurseSearch(artistRecurse, artistDest, path, accessToken, count)

  }

  async artistLoop(accessToken) {
    var artistRecurse = "0oSGxfWSnnOXhD2fKuz2Gy" // David Bowie
    const artists = []


    for (var i = 0; i < 20; i ++) {
      let fetchString = 'https://api.spotify.com/v1/artists/' +
        artistRecurse +
        '/related-artists'
      const response = await fetch(fetchString, {
        headers: { 'Authorization': 'Bearer ' + accessToken }
      })
      const data = await response.json()
      artistRecurse = data.artists[i].id
      artists.push(data.artists[i])

    }
    return artists
  }

  async recurseSearch(artistRecurse, artistDest, path, accessToken, count) {
    let fetchString = 'https://api.spotify.com/v1/artists/' +
      artistRecurse.id +
      '/related-artists'
    const response = await fetch(fetchString, {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    })
    const data = await response.json()

    let relatedArtists = data.artists

    for (let i = 0; i < relatedArtists.length; i++) {
      let artist = relatedArtists[i]
      if (relatedArtists[i].id === artistDest) {
        console.log('success')
        console.log(path)
        return
      } else if (count === 5) {
        return
      } else {
        let newpath = path + relatedArtists[i].name + ' '
        this.recurseSearch(relatedArtists[i], artistDest, newpath, accessToken, count++)
      }
    }
  }

  
  render() {
    return (
      <div className="App">
        {this.state.user.name === "" ?
          <div>
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">Click sign in to login!</h1>
              <button onClick={() => {
                window.location = 'http://localhost:8888/login'
              }}>Sign in
              </button>
            </header>
          </div>
            : <div>
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">{this.state.user.name} is logged in!</h1>
            <h1>They have {this.state.user.followers} followers!</h1>
          </header>
        </div>
        }
      </div>
    );
  }
}

export default App;
