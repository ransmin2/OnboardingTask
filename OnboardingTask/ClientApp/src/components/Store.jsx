import React, { Fragment } from 'react';
import { Button, Modal, Icon, Form, Table, Label } from 'semantic-ui-react';
import axios from 'axios';
import Pagination from './Pagination';
import _ from 'lodash';


export class Store extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            storeList: [],
            id: '',
            name: '',
            address: '',
            currentPage: 1,
            postsPerPage: 10,
            column: null,
            direction: null,
            url: 'caret up',
            newStoreModal: false,
            editStoreModal: false,
            deleteStoreModal: false
        };

        this.getStoreData = this.getStoreData.bind(this);
        this.addStore = this.addStore.bind(this);
        this.updateStore = this.updateStore.bind(this);
        this.deleteStore = this.deleteStore.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.initEditForm = this.initEditForm.bind(this);
    }

    componentDidMount() {
        this.getStoreData();
    }

    getStoreData() {
        axios.get('api/Stores').then(response => response.data)
            .then(result => {
                this.setState({ storeList: result }, () => { console.log(this.state.storeList) });
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

    handleAddressChange = e => {
        this.setState({
            address: e.target.value
        });
    };

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    };


    addStore(e) {

        e.preventDefault();
        const storeToAdd = {
            name: this.state.name,
            address: this.state.address
        };
        axios.post('api/Stores', storeToAdd)
            .then(res => {

                console.log(res);

                console.log(res.data);
                const newStoreList = this.state.storeList.concat(res.data);
                this.setState({ storeList: newStoreList, newStoreModal: false });
            })
            .catch(err => {

                console.log(err)
            });
    }


    updateStore = async () => {

        const storeToUpdate = {
            id: this.state.id,
            name: this.state.name,
            address: this.state.address
        };

        await axios.put('api/Stores/' + this.state.id, storeToUpdate)
            .then(res => {
                console.log(res);
                console.log(res.data);
                let storeList = this.state.storeList;
                const updatedStoreList = storeList.map(store => {
                    if (store.id === this.state.id) {
                        store.name = this.state.name
                        store.address = this.state.address
                    }
                    return store;
                })

                this.setState({
                    id: this.state.id,
                    name: this.state.name,
                    address: this.state.address,
                    editStoreModal: false,
                    storeList: updatedStoreList
                });

            })
            .catch((error) => console.log(error.response.request._response));
    }

    initEditForm(store) {
        this.setState({
            editStoreModal: true,
            id: store.id,
            name: store.name,
            address: store.address,
        })
    }

    initDeleteForm(store) {
        this.setState({
            deleteStoreModal: true,
            id: store.id,
            name: store.name,
            address: store.address,
        })
    }

    handleCancel = () => this.setState({ deleteStoreModal: false })


    deleteStore(id) {
        console.log(id);
        const { storeList } = this.state;
        axios.delete('api/Stores/' + id).then(result => {

            this.setState({
                storeList: storeList.filter(s => s.id !== id),
                deleteStoreModal: false,
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
        const { column, storeList, direction } = this.state

        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                storeList: _.sortBy(storeList, [clickedColumn]),
                direction: 'ascending',
                url: this.state.url === 'caret down' ? 'caret up' : 'caret down',

            })

            return
        }

        this.setState({
            storeList: storeList.reverse(),
            direction: direction === 'ascending' ? 'descending' : 'ascending',
            url: this.state.url === 'caret down' ? 'caret up' : 'caret down',
        })
    }


    render = () => {
        if (this.state.storeList != null) {
            let storeList = this.state.storeList;
            const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
            const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
            const currentPosts = storeList.slice(indexOfFirstPost, indexOfLastPost);

            return (
                <Fragment>
                    <div className="Menubar" style={{ marginTop: "50px" }}>
                        <Button
                            onClick={() => this.setState({ newStoreModal: true })}
                            color="green">New Store</Button>
                        <Modal
                            style={{ height: "auto", top: "auto", left: "auto", bottom: "auto", right: "auto" }}
                            size="small"
                            open={this.state.newStoreModal}
                            onOpen={() => this.setState({ newStoreModal: true })}

                        >
                            <Modal.Header >Add a new store</Modal.Header>
                            <Modal.Content>
                                <Form onSubmit={this.addStore}>
                                    <Form.Field>
                                        <Label>Name</Label><br />
                                        <input type="text" onChange={this.handleNameChange} value={this.state.name} placeholder="Store Name"
                                            required minLength="3" maxLength="20" /> <br />
                                    </Form.Field>
                                    <Form.Field>
                                        <Label>Address</Label><br />
                                        <input type="text" placeholder="Store Address" onChange={this.handleAddressChange} value={this.state.address}
                                            required /> <br />
                                    </Form.Field>
                                    <Button onClick={() => this.setState({ newStoreModal: false })}>Cancel</Button>
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
                                        sorted={this.state.column === 'address' ? this.state.direction : null}
                                        onClick={this.handleSort('address')}
                                    >
                                        Address
                                    <span ><Icon name={this.state.url} /></span>
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {currentPosts.map((store) => {
                                    return (<Table.Row key={store.id}>
                                        <Table.Cell>{store.name}</Table.Cell>
                                        <Table.Cell>{store.address}</Table.Cell>
                                        <Table.Cell>
                                            <Button
                                                onClick={() => this.initEditForm(store)}
                                                color="yellow"><Icon name="edit" />Edit
                                    </Button>
                                            <Modal
                                                style={{ height: "auto", top: "auto", left: "auto", bottom: "auto", right: "auto" }}
                                                size="small"
                                                open={this.state.editStoreModal}
                                                onOpen={() => this.setState({ editStoreModal: true })}
                                            >
                                                <Modal.Header >Edit Store</Modal.Header>
                                                <Modal.Content>
                                                    <Form onSubmit={() => this.updateStore(store.id)}>
                                                        <Form.Field>
                                                            <Label>NAME</Label><br />
                                                            <input type="text" name="name" placeholder={store.name}
                                                                onChange={this.handleChange} value={this.state.name} required minLength="3" maxLength="20" /><br />
                                                        </Form.Field>
                                                        <Form.Field>
                                                            <Label>ADDRESS</Label>
                                                            <input type="text" name="address" placeholder={store.address}
                                                                onChange={this.handleChange} value={this.state.address} required /><br />
                                                        </Form.Field>
                                                        <Button onClick={() => this.setState({ editStoreModal: false })}>Cancel</Button>
                                                        <Button type="submit" color="blue"><Icon name="save" />Edit</Button>
                                                    </Form>
                                                </Modal.Content>
                                            </Modal>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Button
                                                onClick={() => this.initDeleteForm(store)}
                                                color="red" ><Icon name="trash" />Delete
                                        </Button>
                                            <Modal
                                                style={{ height: "auto", top: "auto", left: "auto", bottom: "auto", right: "auto" }}
                                                size="tiny"
                                                open={this.state.deleteStoreModal}
                                                onOpen={() => this.setState({ deleteStoreModal: true })}
                                            >
                                                <Modal.Header>Delete Store</Modal.Header>
                                                <Modal.Content>
                                                    <Modal.Description>
                                                        Are you sure you want to delete this store details?
                                              </Modal.Description>
                                                </Modal.Content>
                                                <Modal.Actions>
                                                    <Button onClick={this.handleCancel}>Cancel</Button>
                                                    <Button onClick={() => this.deleteStore(store.id)} color="red">Delete  <Icon name="delete" /></Button>
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
                            totalPosts={storeList.length}
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
