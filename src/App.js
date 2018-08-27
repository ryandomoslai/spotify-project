import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ArtistNode from './artistStructure/artistNode';
import SearchBar from './SearchBar';

class App extends Component {

  constructor() {
    super()

    this.array = []
    this.found = false
    this.string = ""
    this.accessToken = ""

    this.startSearch = this.startSearch.bind(this)

    this.state = {
      user: {
        name: "",
        followers: 0,
      }
    }
  }

  async componentDidMount() {
    this.accessToken = new URLSearchParams(window.location.search).get('access_token')
    if (this.accessToken == null) {
      return;
    }
    fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': 'Bearer ' + this.accessToken }
    }).then(response => response.json())
      .then(data => this.setState({
        user: {
          name: data.id,
          followers: data.followers.total
        }
      }))
  }

  async startSearch(query) {
    await this.setState({ 
      selectedQuery: query
    })
    console.log(query.id)

    let fetchString = 'https://api.spotify.com/v1/artists/' +
      query.id

    let artistRecurse = await fetch(
      fetchString, {
        headers: { 'Authorization': 'Bearer ' + this.accessToken }
      }).then(response => response.json())

    let artistDest = "2CvCyf1gEVhI0mX6aFXmVI"  // Paul Simon
    let path = new ArtistNode(null, artistRecurse)
    let artistArray = []
    let result = await this.recurseSearch(artistRecurse, artistDest, path, this.accessToken, artistArray)
    await this.setState({
      related: result
    })
  }

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
            path: path
          })
          return path
        } else {
          let newNode = new ArtistNode(path, relatedArtists[i])
          artistArray.push(relatedArtists[i].name)
          this.recurseSearch(relatedArtists[i], artistDest, newNode, accessToken, artistArray)
        }
      }
    } catch (err) { return }
  }
  
  render() {

    let artistProfileImage = ''
    if (!!this.state.selectedQuery) {
      artistProfileImage = this.state.selectedQuery.images[0].url
    }
    let relatedArray = []
    if (!!this.state.path) {
      let currentPath = this.state.path
      let i = 0
      while (currentPath != null) {
        relatedArray[i] = currentPath.item
        currentPath = currentPath.parent
        i += 1
      }
    }

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
        {this.state.path && 
        <div>
          <h1>{this.state.path.item.name}</h1>
        </div>
        }
        <SearchBar selectArtist={this.startSearch} />
        {this.state.selectedQuery &&
          <div>
          <img src={artistProfileImage} style={{ height: '100px'}}/>
            <h1>{this.state.selectedQuery.name}</h1>
            <h1>{this.state.related}</h1>
          </div>
        }
        {this.state.path &&
          <div>
            {relatedArray.map(related => 
              <div>
                <img src={related.images[0].url} style={{ height: '100px'}}/>
                <br />
              </div>
            )}
          </div>
        }

      </div>
    );
  }
}

export default App;
