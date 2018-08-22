import React, { Component } from 'react';

class SearchBar extends Component {

    constructor() {
        super()
        this.accessToken = ""
    }

    componentDidMount() {
        this.accessToken = new URLSearchParams(window.location.search).get('access_token')
    }

    onTextChange(query) {
        fetch('https://api.spotify.com/v1/search?q=' + query +
        '&type=artist&limit=10', {
            headers: { 'Authorization': 'Bearer ' + this.accessToken }
        }).then(response => response.json())
          .then(data => console.log(data))
    }

    render() {
        return (
            <div>
                <input type="text" onKeyUp={event =>
                    this.onTextChange(event.target.value)} />
            </div>
        );
    }
}

export default SearchBar
