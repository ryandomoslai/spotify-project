import React, { Component } from 'react';

class SearchBar extends Component {

    constructor() {
        super()
        this.accessToken = ""

        this.state = {
            query: {
                list: []
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

    render() {

        const queryList = this.state.query.list.map((query) =>
            <li>{query.name}</li>
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
