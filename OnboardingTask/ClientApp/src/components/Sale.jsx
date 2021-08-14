import React, { Fragment } from 'react';
import { Button, Modal, Dropdown, Icon, Form, Table, Label } from 'semantic-ui-react';
import axios from 'axios';
import moment from 'moment';
import Pagination from './Pagination';
import _ from 'lodash';



export class Sale extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            saleList: [],
            id: '',
            customer: '',
            product: '',
            store: '',
            date: '',
            currentPage: 1,
            postsPerPage: 10,
            currentPosts: null,
            column: null,
            direction: null,
            url: 'caret up',
            customerListData: [],
            selectedCustomer: null,
            productListData: [],
            selectedProduct: null,
            storeListData: [],
            selectedStore: null,
            newStoreModal: false,
            editStoreModal: false,
            deleteStoreModal: false
        };

        this.getSaleData = this.getSaleData.bind(this);
        this.getCustomerData = this.getCustomerData.bind(this);
        this.getProductData = this.getProductData.bind(this);
        this.getStoreData = this.getStoreData.bind(this);
        this.addSale = this.addSale.bind(this);
        this.initEditForm = this.initEditForm.bind(this);
        this.updateSale = this.updateSale.bind(this);
    }

    componentDidMount() {
        this.getSaleData();
        this.getCustomerData();
        this.getProductData();
        this.getStoreData();

    }

    getSaleData() {
        axios.get('api/Sales').then(response => response.data)
            .then(result => {

                this.setState({ saleList: result, editSaleModal: false }, () => { console.log(this.state.saleList) });
            },
                (error) => {
                    console.log(error);
                }
            )
    }



    getCustomerData() {
        axios.get("api/Customers").then(response => response.data)
            .then(result => {
                this.setState({ customerListData: result });
            },
                (error) => {
                    console.log(error);
                }
            )
    }

    getProductData() {
        axios.get('api/Products').then(res => res.data)
            .then(result => {
                this.setState({ productListData: result });
            },
                (error) => {
                    console.log(error);
                }
            )
    }

    getStoreData() {
        axios.get('api/Stores').then(response => response.data)
            .then(result => {
                this.setState({ storeListData: result });
            },
                (error) => {
                    console.log(error);
                }
            )
    }

    handleDateChange = e => {
        this.setState({
            date: e.target.value
        })
    }

    handleCustomerDataChange = (e, data) => {
        console.log(`Customer id=${data.value} `);
        this.setState({ selectedCustomer: data.value });
    }


    handleProductDataChange = (e, data) => {
        console.log(`Product id=${data.value} `);
        this.setState({ selectedProduct: data.value });
    }

    handleStoreDataChange = (e, data) => {
        console.log(`Store id=${data.value} `);
        this.setState({ selectedStore: data.value });
    }


    getSaleIndividualData(id) {
        axios.get('api/Sales/' + id).then(response => {
            const newSaleList = this.state.saleList.concat(response.data);
            this.setState({ saleList: newSaleList, newSaleModal: false });
        },
            (error) => {
                console.log(error);
            })
    }

    addSale(e) {

        e.preventDefault();
        const salesToAdd = {
            DateSold: this.state.date,
            customerId: this.state.selectedCustomer,
            productId: this.state.selectedProduct,
            storeId: this.state.selectedStore
        };

        console.log(salesToAdd);

        axios.post('api/Sales', salesToAdd)
            .then(res => {

                console.log(res);

                console.log(res.data);

                this.getSaleIndividualData(res.data.id);
            })
            .catch(err => {

                console.log(err)
            });


    }


    updateSale() {

        const salesToUpdate = {
            id: this.state.id,
            DateSold: this.state.date,
            customerId: this.state.selectedCustomer,
            productId: this.state.selectedProduct,
            storeId: this.state.selectedStore
        };
        console.log(salesToUpdate);

        axios.put('api/Sales/' + this.state.id, salesToUpdate)
            .then(res => {
                console.log(res);

                if (res.status === 200) {
                    console.log(res.data);
                    this.getSaleData();
                }
            })
            .catch((error) => console.log(error));
    }

    initEditForm(sale) {
        this.setState({
            editSaleModal: true,
            id: sale.id,
            customer: sale.customer,
            product: sale.product,
            store: sale.store,
            dateSold: sale.date,
        })
    }

    initDeleteForm(sale) {
        this.setState({
            deleteSaleModal: true,
            id: sale.id,
            customer: sale.customer,
            product: sale.product,
            store: sale.store,
            dateSold: sale.date,
        })
    }

    handleCancel = () => this.setState({ deleteSaleModal: false })


    deleteSale(id) {
        console.log(id);
        const { saleList } = this.state;
        axios.delete('api/Sales/' + id).then(result => {

            this.setState({
                saleList: saleList.filter(sale => sale.id !== id),
                deleteSaleModal: false,
            });
        });
    }

    paginate = (pageNumber) => {
        this.setState({
            currentPage: pageNumber
        });
    }

    onSelectRange = (value) => {
        this.setState({ postsPerPage: value });
        console.log(value);
    }

    handleSort = clickedColumn => () => {
        const { column, saleList, direction } = this.state

        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                saleList: _.sortBy(saleList, [clickedColumn]),
                direction: 'ascending',
                url: this.state.url === 'caret down' ? 'caret up' : 'caret down',

            })

            return
        }

        this.setState({
            saleList: saleList.reverse(),
            direction: direction === 'ascending' ? 'descending' : 'ascending',
            url: this.state.url === 'caret down' ? 'caret up' : 'caret down',
        })
    }


    render = () => {


        let saleList = this.state.saleList;
        let customerListData = this.state.customerListData;
        let productListData = this.state.productListData;
        let storeListData = this.state.storeListData;

        if (saleList && customerListData && productListData && storeListData != null) {

            const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
            const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
            const currentPosts = saleList.slice(indexOfFirstPost, indexOfLastPost);


            return (
                <Fragment>
                    <div className="Menubar" style={{ marginTop: "50px" }}>
                        <Button
                            onClick={() => this.setState({ newSaleModal: true })}
                            color="green">New Sale</Button>
                        <Modal
                            style={{ height: "auto", top: "auto", left: "auto", bottom: "auto", right: "auto" }}
                            size="tiny"
                            open={this.state.newSaleModal}
                            onOpen={() => this.setState({ newSaleModal: true })}

                        >
                            <Modal.Header >Add a new sale</Modal.Header>
                            <Modal.Content>
                                <Form onSubmit={this.addSale}>
                                    <Form.Field>
                                        <Label>Date sold</Label><br />
                                        <input type="date" onChange={this.handleDateChange} value={this.state.date} placeholder="YYYY-MM-DD"
                                            defaultValue={this.state.saleList.date} required /> <br />
                                    </Form.Field>
                                    <Form.Field>
                                        <Label>Customer</Label><br />
                                        <Dropdown

                                            options={customerListData.map(customer => {
                                                return {
                                                    key: customer.id,
                                                    text: customer.name,
                                                    value: customer.id,
                                                }
                                            })}
                                            placeholder='Customer Name'
                                            onChange={this.handleCustomerDataChange}
                                            value={this.state.selectedCustomer}
                                            selection /> <br />
                                    </Form.Field>
                                    <Form.Field>
                                        <Label>Product</Label><br />
                                        <Dropdown
                                            clearable
                                            options={productListData.map(product => {
                                                return {
                                                    key: product.id,
                                                    text: product.name,
                                                    value: product.id
                                                }
                                            })}
                                            placeholder='Product Name'
                                            onChange={this.handleProductDataChange}
                                            value={this.state.selectedProduct}
                                            selection /> <br />
                                    </Form.Field>
                                    <Form.Field>
                                        <Label>Store</Label><br />
                                        <Dropdown
                                            clearable
                                            options={storeListData.map(store => {
                                                return {
                                                    key: store.id,
                                                    text: store.name,
                                                    value: store.id
                                                }
                                            })}
                                            placeholder='Store Name'
                                            onChange={this.handleStoreDataChange}
                                            value={this.state.selectedStore}
                                            selection /> <br />
                                    </Form.Field>
                                    <Button onClick={() => this.setState({ newSaleModal: false })}>Cancel</Button>
                                    <Button type="submit" color="blue" ><Icon name="save" />Save</Button>
                                </Form>
                            </Modal.Content>
                        </Modal>

                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell
                                        sorted={this.state.column === 'customer' ? this.state.direction : null}
                                        onClick={this.handleSort('customer')}
                                    >
                                        Customer
                                    <span ><Icon name={this.state.url} /></span>
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        sorted={this.state.column === 'product' ? this.state.direction : null}
                                        onClick={this.handleSort('product')}
                                    >
                                        Product
                                    <span ><Icon name={this.state.url} /></span>
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        sorted={this.state.column === 'store' ? this.state.direction : null}
                                        onClick={this.handleSort('store')}
                                    >
                                        Store
                                    <span ><Icon name={this.state.url} /></span>
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        sorted={this.state.column === 'date' ? this.state.direction : null}
                                        onClick={this.handleSort('date')}
                                    >
                                        Date Sold
                                    <span ><Icon name={this.state.url} /></span>
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {currentPosts.map((sale) => {
                                    return (<Table.Row key={sale.id}>
                                        <Table.Cell>{sale.customer.name}</Table.Cell>
                                        <Table.Cell>{sale.product.name}</Table.Cell>
                                        <Table.Cell>{sale.store.name}</Table.Cell>
                                        <Table.Cell>{moment(sale.dateSold).format("MMM DD YYYY")}</Table.Cell>
                                        <Table.Cell>
                                            <Button
                                                onClick={() => this.initEditForm(sale)}
                                                color="yellow"><Icon name="edit" />Edit
                                    </Button>
                                            <Modal
                                                style={{ height: "auto", top: "auto", left: "auto", bottom: "auto", right: "auto" }}
                                                size="tiny"
                                                open={this.state.editSaleModal}
                                                onOpen={() => this.setState({ editSaleModal: true })}
                                            >
                                                <Modal.Header >Edit Sale</Modal.Header>
                                                <Modal.Content>
                                                    <Form onSubmit={() => this.updateSale(sale.id)}>
                                                        <Form.Field>
                                                            <Label>Date sold</Label><br />
                                                            <input type="date" onChange={this.handleDateChange} value={this.state.date} placeholder="YYYY-MM-DD"
                                                                defaultValue={this.state.saleList.date} required /> <br />
                                                        </Form.Field>
                                                        <Form.Field>
                                                            <Label>Customer</Label><br />
                                                            <Dropdown

                                                                options={customerListData.map(customer => {
                                                                    return {
                                                                        key: customer.id,
                                                                        text: customer.name,
                                                                        value: customer.id
                                                                    }
                                                                })}
                                                                placeholder={sale.customer.name}
                                                                onChange={this.handleCustomerDataChange}
                                                                value={this.state.selectedCustomer}
                                                                selection /> <br />
                                                        </Form.Field>
                                                        <Form.Field>
                                                            <Label>Product</Label><br />
                                                            <Dropdown
                                                                clearable
                                                                options={productListData.map(product => {
                                                                    return {
                                                                        key: product.id,
                                                                        text: product.name,
                                                                        value: product.id
                                                                    }
                                                                })}
                                                                placeholder={sale.product.name}
                                                                onChange={this.handleProductDataChange}
                                                                value={this.state.selectedProduct}
                                                                selection /> <br />
                                                        </Form.Field>
                                                        <Form.Field>
                                                            <Label>Store</Label><br />
                                                            <Dropdown
                                                                clearable
                                                                options={storeListData.map(store => {
                                                                    return {
                                                                        key: store.id,
                                                                        text: store.name,
                                                                        value: store.id
                                                                    }
                                                                })}
                                                                placeholder={sale.store.name}
                                                                onChange={this.handleStoreDataChange}
                                                                value={this.state.selectedStore}
                                                                selection /> <br />
                                                        </Form.Field>
                                                        <Button onClick={() => this.setState({ editSaleModal: false })}>Cancel</Button>
                                                        <Button type="submit" color="blue"><Icon name="save" />Edit</Button>
                                                    </Form>
                                                </Modal.Content>
                                            </Modal>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Button
                                                onClick={() => this.initDeleteForm(sale)}
                                                color="red" ><Icon name="trash" />Delete
                                        </Button>
                                            <Modal
                                                style={{ height: "auto", top: "auto", left: "auto", bottom: "auto", right: "auto" }}
                                                size="tiny"
                                                open={this.state.deleteSaleModal}
                                                onOpen={() => this.setState({ deleteSaleModal: true })}
                                            >
                                                <Modal.Header>Delete Sale</Modal.Header>
                                                <Modal.Content>
                                                    <Modal.Description>
                                                        Are you sure?
                                              </Modal.Description>
                                                </Modal.Content>
                                                <Modal.Actions>
                                                    <Button onClick={this.handleCancel}>Cancel</Button>
                                                    <Button onClick={() => this.deleteSale(sale.id)} color="red">Delete  <Icon name="delete" /></Button>
                                                </Modal.Actions>
                                            </Modal>
                                        </Table.Cell>
                                    </Table.Row>
                                    )
                                })}
                            </Table.Body>

                            <Table.Footer>

                            </Table.Footer>
                        </Table>
                        <Pagination
                            postsPerPage={this.state.postsPerPage}
                            totalPosts={saleList.length}
                            paginate={this.paginate}
                            handleSelectRange={this.onSelectRange}
                        />
                    </div>
                </Fragment>
            );
        } else {
            return <div>Loading Data....</div>
        }

    }
}