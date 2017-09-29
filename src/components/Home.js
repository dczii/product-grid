import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import SearchWebIcon from 'mdi-react/SearchWebIcon';
import Animate from 'react-animate.css'

import superagent from 'superagent';
import jsonp from 'superagent-jsonp';
import { Row, Col } from 'react-grid-system';
import Header from './Header';
import Footer from './Footer';
import request from 'superagent';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
        results: []
    };
  }  


  handleSearch() {
        superagent.get('http://localhost:3000/products')
            .end((error, response) => {
               if (error) {
                   console.error(error);
               } else {
                   this.setState({ results: response.body });
               }
            });
    }

  render() {
    return (
        <Row className="center">
            <Header />
            <Col md={12} >
                React Application HomePage
                <RaisedButton label='test' onClick={this.handleSearch.bind(this)}/>

            </Col>
            <Footer />
        </Row>
    );
  }
}

export default Home;
