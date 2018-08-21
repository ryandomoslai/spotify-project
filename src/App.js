import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ArtistTree from './artistStructure/artistTree';

class App extends Component {


  constructor() {
    super();

    this.array = []
    this.found = false
    this.string = ""

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

    if (this.state.pathString) {

    } else {
      let artistRecurse = await fetch(  // David Bowie
        'https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy', {
          headers: { 'Authorization': 'Bearer ' + accessToken }
        }).then(response => response.json())

      let artistDest = "1JHzh1ETQTMoFb2CgncnTL"  // Talking Heads
      let path = artistRecurse.name + ', '
      let artistTree = new ArtistTree(artistRecurse.name)
      console.log(artistTree)

      await this.recurseSearch(artistRecurse, artistDest, path, accessToken, artistTree)
    }
  }

  async recurseSearch(artistRecurse, artistDest, path, accessToken, artistTree) {
    let fetchString = 'https://api.spotify.com/v1/artists/' +
      artistRecurse.id +
      '/related-artists'
    const response = await fetch(fetchString, {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    })
    const data = await response.json()

    let relatedArtists = data.artists

    try {for (let i = 0; i < relatedArtists.length; i++) {
      if (this.found) return;
      if (artistTree.getChildren().includes(relatedArtists[i].name)) {
      } else if (relatedArtists[i].id === artistDest) {
        this.found = true
        artistTree.setChild(relatedArtists[i].name)
        console.log(artistTree)
        this.setState({
          pathString: toString(artistTree)
        })
        return
      } else {
        let newpath = ""
        artistTree.setChild(relatedArtists[i].name)
        this.recurseSearch(relatedArtists[i], artistDest, newpath, accessToken, artistTree)
      }
    }
  } catch(err) {return}
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
        {this.state.pathString && 
        <div>
          <h1>{this.state.pathString}</h1>
        </div>
        }
      </div>
    );
  }
}

export default App;
