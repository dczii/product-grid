import React, { Component } from 'react';
import superagent from 'superagent';
import { Row, Col } from 'react-grid-system';
import _ from 'lodash';
import moment from 'moment';
import Header from './Header';
import Footer from './Footer';
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
        //Initiate all Items and partial loaded items
        this.loadAllItems();
        this.handleSearch();
    }

    //Function when sorting is triggered. all items will become 0 again to refresh the results.
    onSortChange = (e,idx) => {
        this.setState({sort: idx, results: [], limit: 20},
            this.handleSearch.bind(this))
    }

    //Function to run when loading all items
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

    //Function to run when partial items need to be loaded
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
    let url = 'http://localhost:3000/ads/?r=';

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
                    _.map(this.state.results, (val, idx) => {
                        return(<Row className='grid-body-container grid-content-container' key={val.id} style={{display: 'flex', flexWrap: 'wrap'}}>
                            {/* Sponsoed ADS which will only show every ater 20 items. */}
                           {(idx % 20) === 0 && idx !== 0 ?
                                <Col xs={12} className='sponsor-container'>
                                    <span style={{float:'left'}}>Sponsor</span>
                                    <img src={url + Math.floor(Math.random()*1000)}/>
                                </Col>
                                : ''}
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
