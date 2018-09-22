import React, { Component } from 'react';

class ArtistImage extends Component {

    constructor(props) {
        super(props)
    }

    // selectFavorite = () => {
    //     console.log(this.props.artist)
    //     console.log('yes')
    // }

    render() {
        return <img src={this.props.artist.images[0].url} style={{ height: '100px' }}/>
    }

}

export default ArtistImage;
