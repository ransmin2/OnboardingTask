import React, { Fragment } from 'react';
import { Button, Modal, Icon, Form, Table, Label } from 'semantic-ui-react';
import axios from 'axios';
import Pagination from './Pagination';
import _ from 'lodash';



export class Product extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productList: [],
            id: '',
            name: '',
            price: '',
            currentPage: 1,
            postsPerPage: 10,
            column: null,
            direction: null,
            url: 'caret up',
            newProductModal: false,
            editProductModal: false,
            deleteProductModal: false
        };

        this.getProductData = this.getProductData.bind(this);
        this.addProduct = this.addProduct.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.initEditForm = this.initEditForm.bind(this);
        this.initDeleteForm = this.initDeleteForm.bind(this);
    }

    componentDidMount() {
        this.getProductData();
    }

    getProductData() {
        axios.get('api/Products').then(res => res.data)
            .then(result => {
                this.setState({ productList: result }, () => { console.log(this.state.productList) });
            },
                (error) => {
                    console.log(error);
                }
            )
    }

    handleNameChange = e => {
        this.setState({
            name: e.target.value
        });
    };

    handlePriceChange = e => {
        this.setState({
            price: parseFloat(e.target.value)
        });
    };

    handleBlur(e) {
        let num = parseFloat(this.state.price)
        let cleanNum = num.toFixed(2);
        this.setState({ price: cleanNum });
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    };


    addProduct(e) {

        e.preventDefault();
        const priceDecimal = parseFloat(this.state.price).toFixed(2);

        console.log(typeof (this.state.price));


        const productToAdd = {
            name: this.state.name,
            price: priceDecimal

        };

        axios.post('api/Products', productToAdd, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {

                console.log(res);

                console.log(res.data);


                const newProductList = this.state.productList.concat(res.data);
                this.setState({ productList: newProductList, newProductModal: false });
            })
            .catch(err => {
                console.log(productToAdd);
                console.log(err)
            });
    }


    updateProduct = async () => {

        const productToUpdate = {
            id: this.state.id,
            name: this.state.name,
            price: this.state.price
        };
        await axios.put('api/Products/' + this.state.id, productToUpdate)
            .then(res => {
                console.log(res);
                console.log(res.data);
                let productList = this.state.productList;
                const updatedProductList = productList.map(product => {
                    if (product.id === this.state.id) {
                        product.name = this.state.name
                        product.price = this.state.price
                    }
                    return product;
                })

                this.setState({
                    id: this.state.id,
                    name: this.state.name,
                    price: this.state.price,
                    editProductModal: false,
                    productList: updatedProductList,
                });

            })
            .catch((error) => console.log(error.response.request._response));
    }

    initEditForm(product) {
        this.setState({
            editProductModal: true,
            id: product.id,
            name: product.name,
            price: product.price,
        })
    }

    initDeleteForm(product) {
        this.setState({
            deleteProductModal: true,
            id: product.id,
            name: product.name,
            product: product.price,
        })
    }

    handleCancel = () => this.setState({ deleteProductModal: false })


    deleteProduct(id) {

        const { productList } = this.state;
        axios.delete('api/Products/' + id).then(result => {

            this.setState({
                productList: productList.filter(p => p.id !== id),
                deleteProductModal: false,
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
        const { column, productList, direction } = this.state

        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                productList: _.sortBy(productList, [clickedColumn]),
                direction: 'ascending',
                url: this.state.url == 'caret down' ? 'caret up' : 'caret down',

            })

            return
        }

        this.setState({
            productList: productList.reverse(),
            direction: direction === 'ascending' ? 'descending' : 'ascending',
            url: this.state.url == 'caret down' ? 'caret up' : 'caret down',
        })
    }


    render = () => {

        if (this.state.productList != null) {
            let productList = this.state.productList;
            const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
            const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
            const currentPosts = productList.slice(indexOfFirstPost, indexOfLastPost);
            console.log(currentPosts);

            return (
                <Fragment>
                    <div className="Menubar" style={{ marginTop: "50px" }}>
                        <Button
                            onClick={() => this.setState({ newProductModal: true })}
                            color="green">New Product</Button>
                        <Modal
                            style={{ height: "auto", top: "auto", left: "auto", bottom: "auto", right: "auto" }}
                            size="tiny"
                            open={this.state.newProductModal}
                            onOpen={() => this.setState({ newProductModal: true })}

                        >
                            <Modal.Header >Add a new Product</Modal.Header>
                            <Modal.Content>
                                <Form onSubmit={this.addProduct}>
                                    <Form.Field>
                                        <Label>Name</Label><br />
                                        <input
                                            type="text"
                                            onChange={this.handleNameChange}
                                            value={this.state.name}
                                            placeholder="Product Name"
                                            required minLength="3"
                                            maxLength="20" /> <br />
                                    </Form.Field>
                                    <Form.Field>
                                        <Label>Price</Label><br />
                                        <input
                                            type="number"
                                            value={this.state.price}
                                            placeholder="Product Price"
                                            onChange={this.handlePriceChange}
                                            onBlur={this.handleBlur}
                                            required /> <br />
                                    </Form.Field>
                                    <Button onClick={() => this.setState({ newProductModal: false })}>Cancel</Button>
                                    <Button type="submit" color="blue"><Icon name="save" />Save</Button>
                                </Form>
                            </Modal.Content>
                        </Modal>

                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell
                                        sorted={this.state.column === 'name' ? this.state.direction : null}
                                        onClick={this.handleSort('name')}
                                    >
                                        Name
                                    <span ><Icon name={this.state.url} /></span>
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        sorted={this.state.column === 'price' ? this.state.direction : null}
                                        onClick={this.handleSort('price')}
                                    >
                                        Price
                                    <span ><Icon name={this.state.url} /></span>
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {currentPosts.map((product) => {
                                    return (<Table.Row key={product.id}>
                                        <Table.Cell>{product.name}</Table.Cell>
                                        <Table.Cell><span>$ </span>{product.price}</Table.Cell>
                                        <Table.Cell>
                                            <Button
                                                onClick={() => this.initEditForm(product)}
                                                color="yellow"><Icon name="edit" />Edit
                                    </Button>
                                            <Modal
                                                style={{ height: "auto", top: "auto", left: "auto", bottom: "auto", right: "auto" }}
                                                size="tiny"
                                                open={this.state.editProductModal}
                                                onOpen={() => this.setState({ editProductModal: true })}
                                            >
                                                <Modal.Header >Edit Product</Modal.Header>
                                                <Modal.Content>
                                                    <Form onSubmit={() => this.updateProduct(product.id)}>
                                                        <Form.Field>
                                                            <Label>Name</Label><br />
                                                            <input type="text" name="name" placeholder={product.name}
                                                                onChange={this.handleChange} value={this.state.name} required minLength="3" maxLength="20" /><br />
                                                        </Form.Field>
                                                        <Form.Field>
                                                            <Label>Price</Label>
                                                            <input type="number" step="0.01" title="Currency" name="price" placeholder={product.price}
                                                                onChange={this.handleChange} value={this.state.price} required /><br />
                                                        </Form.Field>
                                                        <Button onClick={() => this.setState({ editProductModal: false })}>Cancel</Button>
                                                        <Button type="submit" color="blue"><Icon name="save" />Edit</Button>
                                                    </Form>
                                                </Modal.Content>
                                            </Modal>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Button
                                                onClick={() => this.initDeleteForm(product)}
                                                color="red" ><Icon name="trash" />Delete
                                        </Button>
                                            <Modal
                                                style={{ height: "auto", top: "auto", left: "auto", bottom: "auto", right: "auto" }}
                                                size="tiny"
                                                open={this.state.deleteProductModal}
                                                onOpen={() => this.setState({ deleteProductModal: true })}
                                            >
                                                <Modal.Header>Delete Product</Modal.Header>
                                                <Modal.Content>
                                                    <Modal.Description>
                                                        Are you sure?
                                              </Modal.Description>
                                                </Modal.Content>
                                                <Modal.Actions>
                                                    <Button onClick={this.handleCancel}>Cancel</Button>
                                                    <Button onClick={() => this.deleteProduct(product.id)} color="red">Delete  <Icon name="delete" /></Button>
                                                </Modal.Actions>
                                            </Modal>
                                        </Table.Cell>
                                    </Table.Row>)
                                })}
                            </Table.Body>

                            <Table.Footer>

                            </Table.Footer>
                        </Table>
                        <Pagination
                            postsPerPage={this.state.postsPerPage}
                            totalPosts={productList.length}
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