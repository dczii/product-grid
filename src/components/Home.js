import React, { Component } from 'react';
import superagent from 'superagent';
import jsonp from 'superagent-jsonp';
import { Row, Col } from 'react-grid-system';
import SearchWebIcon from 'mdi-react/SearchWebIcon';
import _ from 'lodash';
import moment from 'moment';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

import Header from './Header';
import Footer from './Footer';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: []
        };
    }  

    componentDidMount() {
        this.handleSearch();
    }
    handleSearch() {
        superagent.get('http://localhost:3000/products?_page=1&_limit=20')
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
                Creatella Products
                <Row className='grid-header-container'>
                    <Col xs={3} className='grid-header'>
                        Date
                    </Col>
                    <Col xs={3} className='grid-header'>
                        Face
                    </Col>
                    <Col xs={3} className='grid-header'>
                        Price
                    </Col>
                    <Col xs={3} className='grid-header'>
                        Size
                    </Col>
                </Row>
                    {this.state.results ? 
                        _.map(this.state.results, (val) => {
                            return(<Row className='grid-body-container' key={val.id}>
                                <Col xs={3}>
                                    { moment(val.date).isBefore(moment().subtract(7, 'days')) ?
                                        moment(val.date).format("MMM Do YY")
                                    :
                                        moment(val.date).startOf('day').fromNow()
                                    }
                                </Col>
                                <Col xs={3} style={{fontSize:val.size}}>
                                    {val.face}
                                </Col>
                                <Col xs={3}>
                                    {'$' + val.price.toFixed(2)}
                                </Col>
                                <Col xs={3}>
                                    {val.size}
                                </Col>
                            </Row>);
                        })
                    : ''}
            </Col>
            <Footer />
        </Row>
    );
  }
}

export default Home;
