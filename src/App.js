import React from 'react';
import logo from './logo.svg';
import './App.css';

import GameBoard from './GameBoard';

export default class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <GameBoard />
      </div>
      // <div className="App">
      //   <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <p>
      //       Backgammon
      //     </p>
      //   </header>
      // </div>
    );
  }
}
