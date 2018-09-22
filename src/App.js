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
    this.relatedArray = []

    this.startSearch = this.startSearch.bind(this)
    this.selectFavorite = this.selectFavorite.bind(this)
    this.changeStatus = this.changeStatus.bind(this)

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
      console.log(newPathArray)
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

  changeStatus(artistName) {
    for (let i = 0; i < this.relatedArray.length; i++) {
      console.log(this.relatedArray[i])
    }
  }

  upload(array) {
    console.log(array)
  }
  
  render() {

    let artistProfileImage = ''
    if (!!this.state.selectedQuery) {
      artistProfileImage = this.state.selectedQuery.images[0].url
    }
    this.relatedArray = []

    if (!!this.state.path) {
      let currentPath = this.state.path
      //console.log(currentPath)

      let i = 0
      while (currentPath != null) {
        //console.log(currentPath.item.name)
        this.relatedArray[i] = currentPath.item
        currentPath = currentPath.parent
        i += 1
      }
      //.log(relatedArray)
      this.relatedArray.splice(-1, 1)  // This is a temporary fix to see if it can display multiple artists
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
        {this.state.path && !this.state.foundArtists &&
          <div style= {{width: '500px', 'margin': '0 auto'}}>
            <div>
              <h1>Select your favorite of these artists:</h1>
            </div>
            {this.relatedArray.map(related => 
              <div style={{display: 'inline'}}>

              <img src={related.images[0].url} style={{ height: '100px', width: '100px'}} onClick={() => {
                this.handleClick(related.name, this.relatedArray)
                }}/> 
              </div>
            )}
            <br></br>
          </div>
        }
        {this.state.path && !!this.state.foundArtists && 
          <div style={{ width: '500px', 'margin': '0 auto' }}>
            {this.relatedArray.map(related =>
              <div style={{ display: 'inline' }}>
              <ArtistImage artist={related} changeStatus={this.changeStatus} onclick={() => {
                  console.log('test')
                  }}/>
              </div>
            )}
            <button onClick={() => {
              this.upload(this.relatedArray)
            }}>Upload</button>
            <br></br>
 
          </div>
        }

        {/* {this.state.favoriteSelected &&
          <div>
            {favoriteArray.map(favorite =>
              <div>
                <img src={favorite.images[0].url} style={{ height: '100px' }} />
              </div>
            )}
          </div>
        } */}


      </div>
    );
  }
}

export default App;
