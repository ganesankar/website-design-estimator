import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import {
  UncontrolledCollapse,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

import Landing from "./views/Landing.js";
import Getall from "./views/Getall.js";
import GetNew from "./views/GetNew.js";
import DemoNavbar from "./components/DemoNavbar.js";
import "./App.css";

export default class App extends Component {
  state = {
    todos: [],
    showMenu: false,
  };
  componentDidMount() {}
  render() {
    return (
      <BrowserRouter>
      <DemoNavbar />
        <Switch>
          <Route path="/" exact render={(props) => <Landing {...props} />} />
          <Route path="/all" exact render={(props) => <Getall {...props} />} />
          <Route path="/new" exact render={(props) => <GetNew {...props} />} />

          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    );
  }
}

function removeOptimisticTodo(todos) {
  // return all 'real' todos
  return todos.filter((todo) => {
    return todo.ref;
  });
}

function getTodoId(todo) {
  if (!todo.ref) {
    return null;
  }
  return todo.ref["@ref"].id;
}
