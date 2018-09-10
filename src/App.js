import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ArtistNode from './artistStructure/artistNode';
import SearchBar from './SearchBar';

class App extends Component {

  constructor() {
    super()

    this.array = []
    this.artistChains = []
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

    let artistDest = "2CvCyf1gEVhI0mX6aFXmVI"  // Paul Simon
    let path = new ArtistNode(null, query)

    let depth = 0
    await this.recurseSearch(query, depth, path, this.accessToken, [])
    await this.recurseSearch(query, 1, path, this.accessToken, [])
    // await this.recurseSearch(query, depth, path, this.accessToken, [])
  }

  async recurseSearch(artistRecurse, depth, path, accessToken, artistArray) {
    let fetchString = 'https://api.spotify.com/v1/artists/' +
      artistRecurse.id +
      '/related-artists'
    const response = await fetch(fetchString, {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    })
    const data = await response.json()

    let relatedArtists = data.artists

    try {
      //for (let i = 0; i < relatedArtists.length; i++) {
        if (this.found) return;
        // if (artistArray.includes(relatedArtists[0].name)) {
        //   this.recurseSearch(relatedArtists[1], depth += 1, path, accessToken, artistArray) // Avoiding infinite loop of searching the same two artists
        // } else 
        if (depth == 2) {   // If maximum recurse depth reached  
          this.found = true
          let newNode = new ArtistNode(path, relatedArtists[0])
          newNode.setFirstRelated(relatedArtists[1])  // This is totally temporary to see if it works
          newNode.setSecondRelated(relatedArtists[2])  // This is totally temporary to see if it works
          path = newNode

          if (!!this.state.path) {
            this.setState(prevState => ({
              path: [...prevState.path, path]
            }))
          } else {
            this.setState({
              path: [path]
            })
          }

          return path
        } else {   // Else go another level of depth in the artist chain
          let newNode = new ArtistNode(path, relatedArtists[0])
          newNode.setFirstRelated(relatedArtists[1])
          newNode.setSecondRelated(relatedArtists[2])
          artistArray.push(relatedArtists[0].name)
          this.recurseSearch(relatedArtists[0], depth += 1, newNode, accessToken, artistArray)
        }
     // }
    } catch (err) { return }
  }
  
  render() {

    let artistProfileImage = ''
    if (!!this.state.selectedQuery) {
      artistProfileImage = this.state.selectedQuery.images[0].url
    }
    let relatedArray = []
    if (!!this.state.path) {
      let currentPath = this.state.path[0]

      let i = 0
      while (currentPath != null) {
        if (currentPath.firstRelated !== null) {
          relatedArray[i] = currentPath.item
          relatedArray[i].firstRelated = currentPath.firstRelated
          relatedArray[i].secondRelated = currentPath.secondRelated
          currentPath = currentPath.parent
        }

        i += 1
      }
      console.log(relatedArray)
      relatedArray.splice(-1, 1)  // This is a temporary fix to see if it can display multiple artists
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
          <h1>{this.state.path[0].item.name}</h1>
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
                <img src={related.firstRelated.images[0].url} style={{ height: '100px' }} />
                <img src={related.images[0].url} style={{ height: '100px' }} />
                <img src={related.secondRelated.images[0].url} style={{ height: '100px' }} />
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
