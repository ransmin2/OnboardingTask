import React, { Fragment } from "react";
import { Button, Modal, Icon, Form, Table, Label } from "semantic-ui-react";
import axios from "axios";
import Pagination from "./Pagination";
import _ from "lodash";

export class Customer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customerList: [],
            id: "",
            name: "",
            address: "",
            currentPage: 1,
            postsPerPage: 10,
            currentPosts: null,
            column: null,
            direction: null,
            url: "caret up",
            newCustomerModal: false,
            editCustomerModal: false,
            deleteCustomerModal: false,
        };

        this.getCustomerData = this.getCustomerData.bind(this);
        this.addCustomer = this.addCustomer.bind(this);
        this.updateCustomer = this.updateCustomer.bind(this);
        this.deleteCustomer = this.deleteCustomer.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.initEditForm = this.initEditForm.bind(this);
    }

    componentDidMount() {
        this.getCustomerData();
    }

    getCustomerData() {
        axios
            .get("api/Customers")
            .then((result) => {
                console.log(result.data);
                this.setState({ customerList: result.data });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    handleNameChange = (e) => {
        this.setState({
            name: e.target.value,
        });
    };

    handleAddressChange = (e) => {
        this.setState({
            address: e.target.value,
        });
    };

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    addCustomer(e) {
        e.preventDefault();
        const user = {
            name: this.state.name,
            address: this.state.address,
        };
        axios
            .post("api/Customers", user)
            .then((res) => {
                console.log(res);

                console.log(res.data);
                const newCustomerList = this.state.customerList.concat(res.data);
                this.setState({
                    customerList: newCustomerList,
                    newCustomerModal: false,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    updateCustomer = async () => {
        // console.log('id', this.state.id);
        const user = {
            id: this.state.id,
            name: this.state.name,
            address: this.state.address,
        };
        console.log(user);

        await axios
            .put("api/Customers/" + this.state.id, user)
            .then((res) => {
                console.log(res);
                console.log(res.data);
                let customerList = this.state.customerList;
                const updatedCustomerList = customerList.map((customer) => {
                    if (customer.id === this.state.id) {
                        customer.name = this.state.name;
                        customer.address = this.state.address;
                    }
                    return customer;
                });

                this.setState({
                    id: this.state.id,
                    name: this.state.name,
                    address: this.state.address,
                    editCustomerModal: false,
                    customerList: updatedCustomerList,
                });
            })
            .catch((error) => console.log(error.response.request._response));
    };

    initEditForm(customer) {
        this.setState({
            editCustomerModal: true,
            id: customer.id,
            name: customer.name,
            address: customer.address,
        });
    }

    initDeleteForm(customer) {
        this.setState({
            deleteCustomerModal: true,
            id: customer.id,
            name: customer.name,
            address: customer.address,
        });
    }

    handleCancel = () => this.setState({ deleteCustomerModal: false });

    deleteCustomer(id) {
        console.log(id);
        const { customerList } = this.state;
        axios.delete("api/Customers/" + id).then((result) => {
            this.setState({
                customerList: customerList.filter((c) => c.id !== id),
                deleteCustomerModal: false,
            });
        });
    }

    paginate = (pageNumber) => {
        this.setState({
            currentPage: pageNumber,
        });
    };

    onSelectRange = (value) => {
        this.setState({ postsPerPage: value });
        console.log(value);
    };

    handleSort = (clickedColumn) => () => {
        const { column, customerList, direction } = this.state;

        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                customerList: _.sortBy(customerList, [clickedColumn]),
                direction: "ascending",
                url: this.state.url == "caret down" ? "caret up" : "caret down",
            });

            return;
        }

        this.setState({
            customerList: customerList.reverse(),
            direction: direction === "ascending" ? "descending" : "ascending",
            url: this.state.url == "caret down" ? "caret up" : "caret down",
        });
    };

    render() {

        if (this.state.customerList != null) {
            let customerList = this.state.customerList;
            const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
            const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
            let currentPosts = customerList.slice(indexOfFirstPost, indexOfLastPost);
            return (
                <Fragment>
                    <div className="Menubar" style={{ marginTop: "50px" }}>
                        <Button
                            onClick={() => this.setState({ newCustomerModal: true })}
                            color="green"
                        >
                            New Customer
            </Button>
                        <Modal
                            style={{
                                height: "auto",
                                top: "auto",
                                left: "auto",
                                bottom: "auto",
                                right: "auto",
                            }}
                            size="tiny"
                            open={this.state.newCustomerModal}
                            onOpen={() => this.setState({ newCustomerModal: true })}
                        >
                            <Modal.Header>Add a new customer</Modal.Header>
                            <Modal.Content>
                                <Form onSubmit={this.addCustomer}>
                                    <Form.Field>
                                        <Label>NAME</Label>
                                        <br />
                                        <input
                                            type="text"
                                            onChange={this.handleNameChange}
                                            value={this.state.name}
                                            placeholder="Your Name"
                                            required
                                            minLength="3"
                                            maxLength="20"
                                        />{" "}
                                        <br />
                                    </Form.Field>
                                    <Form.Field>
                                        <Label>ADDRESS</Label>
                                        <br />
                                        <input
                                            type="text"
                                            placeholder="Your Address"
                                            onChange={this.handleAddressChange}
                                            value={this.state.address}
                                            required
                                        />{" "}
                                        <br />
                                    </Form.Field>
                                    <Button
                                        onClick={() => this.setState({ newCustomerModal: false })}
                                    >
                                        Cancel
                  </Button>
                                    <Button type="submit" color="blue">
                                        <Icon name="save" />
                    Save
                  </Button>
                                </Form>
                            </Modal.Content>
                        </Modal>

                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell
                                        sorted={
                                            this.state.column === "name" ? this.state.direction : null
                                        }
                                        onClick={ this.handleSort("name")}
                                    >
                                        Name
                    <span>
                                            <Icon name={this.state.url} />
                                        </span>
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        sorted={
                                            this.state.column === "address"
                                                ? this.state.direction
                                                : null
                                        }
                                        onClick={ this.handleSort("address")}
                                    >
                                        Address
                    <span>
                                            <Icon name={this.state.url} />
                                        </span>
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {currentPosts.map((customer) => {
                                    return (
                                        <Table.Row key={customer.id}>
                                            <Table.Cell>{customer.name}</Table.Cell>
                                            <Table.Cell>{customer.address}</Table.Cell>
                                            <Table.Cell>
                                                <Button
                                                    onClick={() => this.initEditForm(customer)}
                                                    color="yellow"
                                                >
                                                    <Icon name="edit" />
                          Edit
                        </Button>
                                                <Modal
                                                    style={{
                                                        height: "auto",
                                                        top: "auto",
                                                        left: "auto",
                                                        bottom: "auto",
                                                        right: "auto",
                                                    }}
                                                    size="tiny"
                                                    open={this.state.editCustomerModal}
                                                    onOpen={() =>
                                                        this.setState({ editCustomerModal: true })
                                                    }
                                                >
                                                    <Modal.Header>Edit Customer</Modal.Header>
                                                    <Modal.Content>
                                                        <Form
                                                            onSubmit={() => this.updateCustomer(customer.id)}
                                                        >
                                                            <Form.Field>
                                                                <Label>NAME</Label>
                                                                <br />
                                                                <input
                                                                    type="text"
                                                                    onChange={this.handleChange}
                                                                    value={this.state.name}
                                                                    name="name"
                                                                    placeholder={customer.name}
                                                                    required
                                                                    minLength="3"
                                                                    maxLength="20"
                                                                />
                                                                <br />
                                                            </Form.Field>
                                                            <Form.Field>
                                                                <Label>ADDRESS</Label>
                                                                <input
                                                                    type="text"
                                                                    name="address"
                                                                    placeholder={customer.address}
                                                                    onChange={this.handleChange}
                                                                    value={this.state.address}
                                                                    required
                                                                />
                                                                <br />
                                                            </Form.Field>
                                                            <Button
                                                                onClick={() =>
                                                                    this.setState({ editCustomerModal: false })
                                                                }
                                                            >
                                                                Cancel
                              </Button>
                                                            <Button type="submit" color="blue">
                                                                <Icon name="save" />
                                Edit
                              </Button>
                                                        </Form>
                                                    </Modal.Content>
                                                </Modal>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Button
                                                    onClick={() => this.initDeleteForm(customer)}
                                                    color="red"
                                                >
                                                    <Icon name="trash" />
                          Delete
                        </Button>
                                                <Modal
                                                    dimmer="blurring"
                                                    style={{
                                                        height: "auto",
                                                        top: "auto",
                                                        left: "auto",
                                                        bottom: "auto",
                                                        right: "auto",
                                                    }}
                                                    size="tiny"
                                                    open={this.state.deleteCustomerModal}
                                                    onOpen={() =>
                                                        this.setState({ deleteCustomerModal: true })
                                                    }
                                                >
                                                    <Modal.Header>Delete Customer</Modal.Header>
                                                    <Modal.Content>
                                                        <Modal.Description>Are you sure?</Modal.Description>
                                                    </Modal.Content>
                                                    <Modal.Actions>
                                                        <Button onClick={this.handleCancel}>Cancel</Button>
                                                        <Button
                                                            onClick={() => this.deleteCustomer(customer.id)}
                                                            color="red"
                                                        >
                                                            Delete <Icon name="delete" />
                                                        </Button>
                                                    </Modal.Actions>
                                                </Modal>
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>

                            <Table.Footer></Table.Footer>
                        </Table>
                        <Pagination
                            postsPerPage={this.state.postsPerPage}
                            totalPosts={customerList.length}
                            paginate={this.paginate}
                            handleSelectRange={this.onSelectRange}
                        />
                    </div>
                </Fragment>
            );
        } else {
            return <div>Loading Data...</div>;
        }
    }
}


