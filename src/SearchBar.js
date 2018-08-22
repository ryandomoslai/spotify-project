import React, { Component } from 'react';

class SearchBar extends Component {

    constructor() {
        super()
        this.accessToken = ""
        
        this.selectArtist = this.selectArtist.bind(this)

        this.state = {
            query: {
                list: [],
                selected: {}
            }
        }
    }

    componentDidMount() {
        this.accessToken = new URLSearchParams(window.location.search).get('access_token')
    }

    async onTextChange(query) {
        let queryFetch = await fetch(
            'https://api.spotify.com/v1/search?q=' + 
            query + '&type=artist&limit=10', {
            headers: { 'Authorization': 'Bearer ' + this.accessToken }
        }).then(response => response.json())

        this.setState({
            query: {
                list: queryFetch.artists.items
            }
        })
    }

    selectArtist(query) {
        this.props.selectArtist(query)
    }

    render() {
        const queryList = this.state.query.list.map((query) =>
            <li onClick={() => {this.selectArtist(query)}}>{query.name}</li>
        )
        return (
            <div>
                <input type="text" onKeyUp={event =>
                    this.onTextChange(event.target.value)} />
                <ul>{queryList}</ul>
            </div>
        );
    }
}

export default SearchBar
