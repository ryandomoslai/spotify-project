$_$wp(1);
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
class App extends Component {
    constructor() {
        super();
        $_$wf(1), $_$w(1, 0);
        $_$w(1, 1), this.array = [];
        $_$w(1, 2), this.state = {
            user: {
                name: '',
                followers: 0
            }
        };
    }
    async componentDidMount() {
        $_$wf(1);
        let accessToken = ($_$w(1, 3), new URLSearchParams(window.location.search).get('access_token'));
        if ($_$w(1, 4), accessToken == null) {
            return $_$w(1, 5);
        }
        $_$w(1, 6), fetch('https://api.spotify.com/v1/me', { headers: { 'Authorization': 'Bearer ' + accessToken } }).then(response => {
            $_$wf(1);
            return $_$w(1, 7), response.json();
        }).then(data => {
            $_$wf(1);
            return $_$w(1, 8), this.setState({
                user: {
                    name: data.id,
                    followers: data.followers.total
                }
            });
        });
        const result = ($_$w(1, 9), await this.artistLoop(accessToken));
        $_$w(1, 10), $_$tracer.log(result, 'result', 1, 10);
    }
    async artistLoop(accessToken) {
        $_$wf(1);
        var artistRecurse = ($_$w(1, 11), '43ZHCT0cAZBISjO8DG9PnE');
        let fetchString = ($_$w(1, 12), 'https://api.spotify.com/v1/artists/' + artistRecurse + '/related-artists');
        const artists = ($_$w(1, 13), []);
        for (var i = 0; $_$w(1, 14), i < 10; i++) {
            const response = ($_$w(1, 15), await fetch(fetchString, { headers: { 'Authorization': 'Bearer ' + accessToken } }));
            const data = ($_$w(1, 16), await response.json().then(data => {
                $_$wf(1);
                $_$w(1, 17), artists[i] = data[0];
            }));
        }
        return $_$w(1, 18), artists;
    }
    renderArray() {
        $_$wf(1);
        $_$w(1, 19), $_$tracer.log(this.array, 'this.array', 1, 19);
    }
    render() {
        $_$wf(1);
        return $_$w(1, 20), (
            <div className='App'>
        {this.state.user.name === '' ? ($_$w(1, 21), (
                    <div>
            <header className='App-header'>
              <img src={logo} className='App-logo' alt='logo'/>
              <h1 className='App-title'>Click sign in to login!</h1>
              <button
                                onClick={() => {
                                    $_$wf(1);
                                    $_$w(1, 23), window.location = 'http://localhost:8888/login';
                                }}>Sign in
              </button>
            </header>
          </div>
                )) : ($_$w(1, 22), (
                    <div>
          <header className='App-header'>
            <img src={logo} className='App-logo' alt='logo'/>
            <h1 className='App-title'>{this.state.user.name} is logged in!</h1>
            <h1>They have {this.state.user.followers} followers!</h1>
          </header>
          <button
                            onClick={() => {
                                $_$wf(1);
                                $_$w(1, 24), this.renderArray();
                            }}>Sign in
            </button>
        </div>
                ))}
      </div>
        );
    }
}
export default App;
$_$wpe(1);