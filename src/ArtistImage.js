import React, { Component } from 'react';

class ArtistImage extends Component {
    render() {
        return <img src={this.props.artist.images[0].url} style={{ height: '100px' }} onClick={this.selectFavorite} />
    }
}

export default ArtistImage;
