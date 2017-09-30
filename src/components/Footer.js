import React, { Component } from 'react';
import { Col } from 'react-grid-system';

class Footer extends Component {
  render() {
    return (
    	<Col md={12} style={{marginTop:20}}>
    		Design and Codes by <a href="https://dczii.github.io/">DcZII</a>
    	</Col>
    );
  }
}

export default Footer;
