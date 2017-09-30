import React, { Component } from 'react';
import superagent from 'superagent';
import jsonp from 'superagent-jsonp';
import { Row, Col } from 'react-grid-system';
import SearchWebIcon from 'mdi-react/SearchWebIcon';
import _ from 'lodash';
import moment from 'moment';
import Header from './Header';
import Footer from './Footer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import ReactLoading from 'react-loading';
import InfiniteScroll from 'react-infinite-scroller';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allItems: [],
            results: [],
            sort: null,
            limit: 20,
            hasMore: true
        };
    }  

    componentDidMount() {
        this.loadAllItems();
        this.handleSearch();
    }

    onSortChange = (e,idx) => {
        this.setState({sort: idx, results: [], limit: 20},
            this.handleSearch.bind(this))
    }

    loadAllItems = () => {
        superagent.get('http://localhost:3000/products')
            .query({
                _sort: this.state.sort
            })
            .end((error, response) => {
               if (error) {
                   console.error(error);
               } else {
                   this.setState({ allItems: response.body });
               }
            });
    }

    handleSearch = (limit) => {
        let sort = this.state.sort;
        let newLimit = limit || this.state.limit;
        superagent.get('http://localhost:3000/products')
            .query({
                _limit: newLimit,
                _sort: sort
            })
            .end((error, response) => {
               if (error) {
                   console.error(error);
               } else {
                   this.setState({ results: response.body });
               }
            })
        if(!_.isNull(this.state.sort)) {
            this.loadAllItems()
        }
    }

    onLoadMore = () => {
        if(this.state.results.length > 0){
            let limit = this.state.limit + 20;
            let hasMore = this.state.limit < this.state.allItems.length;
            let newItems = _.take(this.state.allItems,limit);
            this.setState({limit: limit, hasMore: hasMore, results: newItems})
        }
    }    

  render() {
    return (
        <Row className="center">
            <Header />
            <Col md={12} >
                <p style={{marginBottom:20,}}>Creatella Products</p>
                <div className='sort-container'>
                    <p style={{display: 'inline-block'}}>SORT BY:</p>
                    <RadioButtonGroup name="sort" valueSelected={this.state.sort} onChange={this.onSortChange.bind(this)} style={{display: 'inline-block', width: 300}}>
                        <RadioButton value="id" label="id" className='sort-value' labelStyle={{textAlign:'left'}} />
                        <RadioButton value="size" label="Size" className='sort-value' labelStyle={{textAlign:'left'}} />
                        <RadioButton value="price" label="Price" className='sort-value' labelStyle={{textAlign:'left'}} />
                    </RadioButtonGroup>
                </div>
                {this.state.results.length > 0 ?
                    <Row className='grid-header-container grid-content-container'>
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
                : <ReactLoading type="bars" color="#4CAF50" className="load-icon"/> }
                <InfiniteScroll
                    loadMore={this.onLoadMore.bind(this)}
                    hasMore={this.state.hasMore}
                    useWindow={true}
                    loader={<ReactLoading type="bars" color="#4CAF50" className="load-icon"/>}
                >
                {this.state.results.length > 0 ? 
                    _.map(this.state.results, (val) => {
                        return(<Row className='grid-body-container grid-content-container' key={val.id} style={{display: 'flex', flexWrap: 'wrap'}}>
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
                </InfiniteScroll>
                {!this.state.hasMore ? 
                    <p style={{fontSize:20, marginTop:20}}>~ end of catalogue ~</p>
                    : null}
            </Col>
            <Footer />
        </Row>
    );
  }
}

export default Home;
