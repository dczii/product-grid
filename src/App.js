import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './App.css';
import Home from './components/Home';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchField: false,
      searchValue: '',
      results: []
    };
  }  
  render() {
    return (
      <MuiThemeProvider>
        <Home />
      </MuiThemeProvider>
    );
  }
}

export default App;
