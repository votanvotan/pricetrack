import React, { Component } from "react"
import { loadProgressBar } from 'axios-progress-bar'
import 'axios-progress-bar/dist/nprogress.css'

import { Link } from "gatsby"
import axios from "axios"
import moment from "moment"

import Layout from "../components/layout"

loadProgressBar()

export default class IndexComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            urls: [],
            loading: false,
            error: false
        }
    }

    componentDidMount() {
        this.setState({ loading: true })
        axios.get('/api/listUrls?helpers=1')
            .then(response => {
                let urls = response.data
                this.setState({ urls, loading: false })
            })
            .catch(err => {
                this.setState({ loading: false, error: true })
            })
    }

    formatPrice(price, plus_sign=false) {
        var sign = price > 0 ? '+' : ''
        return (plus_sign ? sign : '') + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    renderListUrl() {
        if (this.state.loading) return 'Loading ...'
        if (this.state.error) return 'Some thing went wrong'
        if (!this.state.urls.length) return 'Nothing'

        let dom = []
        for (let url of this.state.urls) {
            dom.push(
                <div className="media text-muted pt-3" key={url.url}>
                  <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect fill={url.color} width="100%" height="100%"/><text fill="#fff" dy=".3em" x="50%" y="50%">{url.domain.indexOf('shopee') > -1 ? 'S' : 'tiki'}</text></svg>
                  <p className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                    <strong className="d-block text-gray-dark">
                    <Link to={'/view/' + url.id}>
                      {url.info.name || url.domain}
                    </Link>
                    </strong>
                    
                        <span className="ml-2">{this.formatPrice(url.latest_price)} VND </span>
                        {
                            url.price_change ? 
                                <span style={{ fontWeight: 700, color: url.price_change < 0 ? '#28a745' : '#f44336' }}>
                                    ({this.formatPrice(url.price_change, true)} VND)
                                </span>
                                : ''
                        }
                    <br />
                    
                    <a href={url.url} target="_blank">{url.url.length > 100 ? url.url.slice(0, 100) + '...' : url.url}</a>
                    <br /><br />
                    <small>
                    <a href={url.helpers.query} target="_blank">Query</a> | &nbsp;
                    <a href={url.helpers.raw} target="_blank">Raw data</a> | &nbsp;
                    <a href={url.helpers.pull} target="_blank">Refresh data</a> | &nbsp;
                    Created at {moment(url.created_at).fromNow()} | &nbsp;
                    Last pull: {moment(url.last_pull_at).fromNow()}</small>
                  </p>
                </div>
            )
        }

        return dom
    }

    render() {
        return (
            <Layout>
                <div className="d-flex align-items-center p-3 my-3 text-white-50 bg-purple rounded shadow-sm">
                    <img className="mr-3" src="http://getbootstrap.com/docs/4.2/assets/brand/bootstrap-outline.svg" alt="" width="48" height="48" />
                    <div className="lh-100">
                      <h6 className="mb-0 text-white lh-100">Price Tracker</h6>
                      <small>beta</small>
                    </div>
                </div>

                <div className="my-3 p-3 bg-white rounded shadow-sm" id="listUrls">
                    {this.renderListUrl()}
                </div>
            </Layout>
        )
    }
}