import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ArtistNode from './artistStructure/artistNode';

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
      // The recursive section
      let artistRecurse = await fetch(  // David Bowie
        'https://api.spotify.com/v1/artists/0oSGxfWSnnOXhD2fKuz2Gy', {
          headers: { 'Authorization': 'Bearer ' + accessToken }
        }).then(response => response.json())

      let artistDest = "1dfeR4HaWDbWqFHLkxsg1d"  // Queen
      let path = new ArtistNode(null, artistRecurse)
      let artistArray = []

      let result = await this.recurseSearch(artistRecurse, artistDest, path, accessToken, artistArray)
      console.log(result)
    }
  }

  // async recurseSearch(artistRoot, artistDest, accessToken, stack) {
  //   if (this.found) return
  //   let fetchString = 'https://api.spotify.com/v1/artists/' +
  //     artistRoot.item.id +
  //     '/related-artists'
  //   const response = await fetch(fetchString, {
  //     headers: { 'Authorization': 'Bearer ' + accessToken }
  //   })
  //   const data = await response.json()
  //   let relatedArtists = data.artists

  //   if (artistRoot.item.id === artistDest) {
  //     console.log("found it")
  //     this.found = true
  //     console.log(artistRoot)
  //     return artistRoot
  //   } else {
  //     for (let i = 0; i < relatedArtists.length; i++) {
  //       if (artistRoot.parent === relatedArtists[i]) {
  //         return
  //       }
  //       let newNode = new ArtistNode(artistRoot, relatedArtists[i])
  //       return this.recurseSearch(newNode, artistDest, accessToken)
  //     }
  //   }
  // }

  async recurseSearch(artistRecurse, artistDest, path, accessToken, artistArray) {
    let fetchString = 'https://api.spotify.com/v1/artists/' +
      artistRecurse.id +
      '/related-artists'
    const response = await fetch(fetchString, {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    })
    const data = await response.json()

    let relatedArtists = data.artists

    try {
      for (let i = 0; i < relatedArtists.length; i++) {
        if (this.found) return;
        if (artistArray.includes(relatedArtists[i].name)) {
        } else if (relatedArtists[i].id === artistDest) {
          this.found = true
          let newNode = new ArtistNode(path, relatedArtists[i])
          path = newNode
          console.log(path)
          this.setState({
            pathString: toString(path)
          })
          return
        } else {
          let newNode = new ArtistNode(path, relatedArtists[i])
          artistArray.push(relatedArtists[i].name)
          this.recurseSearch(relatedArtists[i], artistDest, newNode, accessToken, artistArray)
        }
      }
    } catch (err) { return }
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
