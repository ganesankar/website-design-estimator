import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";



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

