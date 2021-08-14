import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu, Segment } from "semantic-ui-react";
import "./NavMenu.css";

class NavMenu extends Component {
    state = {};

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });

    render() {
        const { activeItem } = this.state;

        return (
            <Segment inverted >
                <Menu inverted secondary stackable>
                    <Menu.Item
                        name="Home"
                        active={activeItem === "Home"}
                        onClick={this.handleItemClick}
                        as={Link}
                        to="/"
                    >
                        <strong>ONBOARDING TASK</strong>
          </Menu.Item>
                    <Menu.Item
                        name="Customer"
                        active={activeItem === "customer"}
                        onClick={this.handleItemClick}
                        as={Link}
                        to="/customer"
                    >
                        Customers
          </Menu.Item>

                    <Menu.Item
                        name="Product"
                        active={activeItem === "product"}
                        onClick={this.handleItemClick}
                        as={Link}
                        to="/product"
                    >
                        Products
          </Menu.Item>

                    <Menu.Item
                        name="Store"
                        active={activeItem === "Store"}
                        onClick={this.handleItemClick}
                        as={Link}
                        to="/store"
                    >
                        Stores
          </Menu.Item>

                    <Menu.Item
                        name="Sale"
                        active={activeItem === "Sale"}
                        onClick={this.handleItemClick}
                        as={Link}
                        to="/sale"
                    >
                        Sales
          </Menu.Item>
                </Menu>
            </Segment>
        );
    }
}

export default NavMenu