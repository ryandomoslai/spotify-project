import React, { Component } from 'react';

class ArtistImage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            // Set your state here
        }
    }

    handleClick() {
        if (!!this.state.selected) {
            this.setState({
                selected: false
            })
        } else {
            this.setState({
                selected: true
            })
            this.props.changeStatus()
        }
    }

    render() {

        let style = {
            height: '100px',
            width: '100px'
        }
        if (!!this.state.selected) {
            style = {
                height: '100px',
                width: '100px',
                filter: 'brightness(200%)'
            }
        }

        return <img src={this.props.artist.images[0].url} style={style} onClick={() => {
            this.handleClick()
        }}/>
    }

}

export default ArtistImage;
