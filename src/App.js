import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ArtistNode from './artistStructure/artistNode';
import SearchBar from './SearchBar';
import ArtistImage from './ArtistImage';

class App extends Component {

  constructor() {
    super()

    this.array = []
    this.artistChains = []
    this.found = false
    this.string = ""
    this.accessToken = ""
    this.selectedArtists = []
    this.selectedSongs = []

    this.startSearch = this.startSearch.bind(this)
    this.selectFavorite = this.selectFavorite.bind(this)
    this.changeStatus = this.changeStatus.bind(this)
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      user: {
        name: "",
        followers: 0,
      },
      playlistName: 'Enter the name of your playlist.'
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
    if (!!this.state.path) {
      console.log('yippee')
    }
  }

  async startSearch(query) {
    await this.setState({ 
      selectedQuery: query
    })



    let fetchString = 'https://api.spotify.com/v1/artists/' +
      query.id +
      '/related-artists'
    const response = await fetch(fetchString, {
      headers: { 'Authorization': 'Bearer ' + this.accessToken }
    })
    const data = await response.json()

    let relatedArtists = data.artists

    let path = new ArtistNode(null, query)

    for (let i = 0; i < 5; i ++) {
      let newNode = new ArtistNode(path, relatedArtists[i])
      path = newNode
    }
    this.setState({
      path: path
    })
    
    return path
    // let depth = 0
    // await this.recurseSearch(query, depth, path, this.accessToken, [])
    // await this.recurseSearch(query, 1, path, this.accessToken, [])
    // await this.recurseSearch(query, depth, path, this.accessToken, [])
  }

  async recurseSearch(artistRecurse, maxDepth, path, accessToken, artistArray) {
    let fetchString = 'https://api.spotify.com/v1/artists/' +
      artistRecurse.id +
      '/related-artists'
    const response = await fetch(fetchString, {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    })
    const data = await response.json()

    let relatedArtists = data.artists

    try {
        if (this.found) return;
        if (maxDepth == 2) {   // If maximum recurse depth reached  
          this.found = true
          let newNode = new ArtistNode(path, relatedArtists[0])
          path = newNode
          return path
        } else {   // Else go another level of depth in the artist chain
          let newNode = new ArtistNode(path, relatedArtists[0])
          artistArray.push(relatedArtists[0].name)
          return await this.recurseSearch(relatedArtists[0], maxDepth += 1, newNode, accessToken, artistArray)
        }
     // }
    } catch (err) { return }
  }

  selectFavorite() {
    let path = this.state.path
    // TODO: MAKE IT SO THAT WHEN CLICKED, A STREAM OF THE "SELECTED" ARTIST'S RELATED IS FOUND AND DISPLAYED
  }

  findChildArtists(preferred, artists) {
  }

  async handleClick(related, relatedArray) {
    if (!!this.state.foundArtists) {

    } else {
      let newPathArray = []

      for (let i = 0; i < relatedArray.length; i++) {
        let fetchString = 'https://api.spotify.com/v1/artists/' +
          relatedArray[i].id +
          '/related-artists'
        const response = await fetch(fetchString, {
          headers: { 'Authorization': 'Bearer ' + this.accessToken }
        })
        const data = await response.json()

        let relatedArtists = data.artists
        if (relatedArray[i].name == related) {
          newPathArray[i] = relatedArtists.splice(0, 7)
        } else {
          newPathArray[i] = relatedArtists.splice(0, 2)
        }

      }

      let coolerPath = this.state.path

      for (let i = 0; i < newPathArray.length; i++) {
        for (let k = 0; k < newPathArray[i].length; k++) {
          coolerPath = new ArtistNode(coolerPath, newPathArray[i][k])
        }
        // while (newPathArray[i].parent != null) {
        //   console.log(newPathArray[i])
        //   coolerPath = new ArtistNode(coolerPath, newPathArray[i].item)
        //   newPathArray[i] = newPathArray[i].parent
        // }
      }
      this.setState({
        path: coolerPath,
        foundArtists: true
      })
    }
  }

  changeStatus(artist) {
    for (let i = 0; i < this.selectedArtists.length; i++) {
      if (this.selectedArtists[i] == artist) {
        this.selectedArtists.splice(i, 1)

        return
      }
    }
    this.selectedArtists.push(artist)

  }

  async upload() {
    for (let i = 0; i < this.selectedArtists.length; i++) {
      let fetchString = 'https://api.spotify.com/v1/artists/' +
        this.selectedArtists[i].id +
        '/top-tracks?country=US'
      const response = await fetch(fetchString, {
        headers: { 'Authorization': 'Bearer ' + this.accessToken }
      })
      const data = await response.json()

      let track = data.tracks[0]
      this.selectedSongs.push(track)
    }
    this.setState({
      sending: true
    })
  }

  async confirm() {
    let fetchString = 'https://api.spotify.com/v1/users/' +
      this.state.user.name +
      '/playlists'
    let response = await fetch(fetchString, {
      method: 'POST',
      headers: { 
        'Authorization': 'Bearer ' + this.accessToken,
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({ name: this.state.playlistName})
    })
    let data = await response.json()
    console.log(data)
    
    let playlistId = data.id
    let songUris = []
    for (let i = 0; i < this.selectedSongs.length; i++) {
      songUris.push(this.selectedSongs[i].uri)
    }
    console.log(songUris)
    fetchString = 'https://api.spotify.com/v1/playlists/' +
      playlistId +
      '/tracks'
    response = await fetch(fetchString, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + this.accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: songUris})
    })
    data = await response.json()
    console.log(data)
  }

  handleChange(event) {
    this.setState({ playlistName: event.target.value });
  }
  
  render() {

    let artistProfileImage = ''
    if (!!this.state.selectedQuery) {
      artistProfileImage = this.state.selectedQuery.images[0].url
    }
    let relatedArray = []

    if (!!this.state.path) {
      let currentPath = this.state.path
      //console.log(currentPath)

      let i = 0
      while (currentPath != null) {
        //console.log(currentPath.item.name)
        relatedArray[i] = currentPath.item
        currentPath = currentPath.parent
        i += 1
      }
      //.log(relatedArray)
      relatedArray.splice(-1, 1)  // This is a temporary fix to see if it can display multiple artists
    }

    
    // let favoriteArray = []

    // if (!!this.state.favoriteSelected) {
    //   let path = new ArtistNode(null, relatedArray[0])
    //   let favoritePath = this.recurseSearch(relatedArray[0], 2, path, this.accessToken, [])
    //   console.log(favoritePath)

    //   let i = 0
    //   while (favoritePath != null) {
    //     favoriteArray[i] = favoritePath.item
    //     favoritePath = favoritePath.parent
    //     i += 1
    //   }

    // }

    return (
      <div className="App">
        {!this.state.sending &&
          <div>
          {this.state.user.name === "" ?
            <div>
              <header className="App-header">
                <h1 className="App-title">Click sign in to login!</h1>
                <button onClick={() => {
                  window.location = window.location.href.includes('localhost')
                    ? 'http://localhost:8888/login'
                    : 'https://quick-playlists-backend.herokuapp.com/login'
                }}>Sign in
                </button>
              </header>
            </div>
              : <div>
            <SearchBar selectArtist={this.startSearch} />
          </div>
          }
          </div>
        }

        {this.state.path && !this.state.sending && 
        <div>
          <h1>{this.state.path.item.name}</h1>
        </div>
        }
        {this.state.selectedQuery && !this.state.sending &&
          <div>
          <img src={artistProfileImage} style={{ height: '100px'}}/>
            <h1>{this.state.selectedQuery.name}</h1>
            <h1>{this.state.related}</h1>
          </div>
        }
        {this.state.path && !this.state.foundArtists && !this.state.sending &&
          <div style= {{width: '500px', 'margin': '0 auto'}}>
            <div>
              <h1>Select your favorite of these artists:</h1>
            </div>
            {relatedArray.map(related => 
              <div style={{display: 'inline'}}>

              <img src={related.images[0].url} style={{ height: '100px', width: '100px'}} onClick={() => {
                this.handleClick(related.name, relatedArray)
                }}/> 
              </div>
            )}
            <br></br>
          </div>
        }
        {this.state.path && !!this.state.foundArtists && !this.state.sending && 
          <div style={{ width: '500px', 'margin': '0 auto' }}>
            {relatedArray.map(related =>
              <div style={{ display: 'inline' }}>
              <ArtistImage artist={related} changeStatus={this.changeStatus} onclick={() => {
                  }}/>
              </div>
            )}
            <button onClick={() => {
              this.upload()
            }}>Upload</button>
            <br></br>
 
          </div>
        }

        {this.state.sending &&
          <div>
            <h1>
              Add this playlist to your account?
            </h1>
            <input type="text" name="name" value={this.state.playlistName} onChange={this.handleChange}/>
            {this.selectedSongs.map(track =>
              <h4>{track.name}</h4>
            )}
          <button onClick={() => {
            this.confirm()
          }}>Confirm</button>
          </div>
        }
      </div>
    );
  }
}

export default App;
