import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Product } from './components/Product';
import { Customer } from './components/Customer';
import { Store } from './components/Store';
import { Sale } from './components/Sale';
import './custom.css';

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Layout>
                <Route exact path='/' component={Home} />
                <Route path='/product' component={Product} />
                <Route path='/customer' component={Customer} />
                <Route path='/store' component={Store} />
                <Route path='/sale' component={Sale} />

            </Layout>
        );
    }
}
