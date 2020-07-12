import React, { Component } from "react";
import classnames from "classnames";
import _ from 'lodash';
import {
  FormGroup,
  Input,
  Card,
  ListGroup,
  ListGroupItem,
  Button,
  TabContent,
  TabPane,
  Container,
  Row,
  Col,
} from "reactstrap";
import ReactDatetime from "react-datetime";

import analytics from "../utils/analytics";
import api from "../utils/api";
import isLocalHost from "../utils/isLocalHost";

export default class GetNew extends Component {
  state = {
    todos: [],
    showMenu: false,
    iconTabs: 1,
    plainTabs: 1,
  };
  toggleNavs = (e, state, index) => {
    e.preventDefault();
    this.setState({
      [state]: index,
    });
  };
  componentDidMount() {
    /* Track a page view */
    analytics.page();

    // Fetch all todos
    api.readAllQuestions().then((todos) => {
      if (todos.message === "unauthorized") {
        if (isLocalHost()) {
          alert(
            "FaunaDB key is not unauthorized. Make sure you set it in terminal session where you ran `npm start`. Visit http://bit.ly/set-fauna-key for more info"
          );
        } else {
          alert(
            "FaunaDB key is not unauthorized. Verify the key `FAUNADB_SERVER_SECRET` set in Netlify enviroment variables is correct"
          );
        }
        return false;
      }

      console.log("all todos", todos);
      var newArr = [];
      todos.forEach(function (e) {
        newArr.push(e.data);
      });
      const newtodo = _.orderBy(newArr, "order", "asc");
      this.setState({
        todos: newtodo,
      });
    });
  }
  saveTodo = (e) => {
    e.preventDefault();
    const { todos } = this.state;
    const todoValue = this.inputElement.value;

    if (!todoValue) {
      alert("Please add Todo title");
      this.inputElement.focus();
      return false;
    }

    // reset input to empty
    this.inputElement.value = "";

    const todoInfo = {
      title: todoValue,
      completed: false,
    };
    // Optimistically add todo to UI
    const newTodoArray = [
      {
        data: todoInfo,
        ts: new Date().getTime() * 10000,
      },
    ];

    const optimisticTodoState = newTodoArray.concat(todos);

    this.setState({
      todos: optimisticTodoState,
    });
    // Make API request to create new todo
    api
      .create(todoInfo)
      .then((response) => {
        console.log(response);
        /* Track a custom event */
        analytics.track("todoCreated", {
          category: "todos",
          label: todoValue,
        });
        // remove temporaryValue from state and persist API response
        const persistedState = removeOptimisticTodo(todos).concat(response);
        // Set persisted value to state
        this.setState({
          todos: persistedState,
        });
      })
      .catch((e) => {
        console.log("An API error occurred", e);
        const revertedState = removeOptimisticTodo(todos);
        // Reset to original state
        this.setState({
          todos: revertedState,
        });
      });
  };
  
 
  closeModal = (e) => {
    this.setState({
      showMenu: false,
    });
    analytics.track("modalClosed", {
      category: "modal",
    });
  };
  openModal = () => {
    this.setState({
      showMenu: true,
    });
    analytics.track("modalOpened", {
      category: "modal",
    });
  };
  

  getSection = (item) => {
    if (
      item.type === "input" ||
      item.disabled ||
      (item.options && item.options.length === 0)
    ) {
      return <Input disabled placeholder="Regular" type="text" />;
    }
    switch (item.type) {
      case "text":
        return (
          <Input
            placeholder={item.placeholder}
            type="text"
            value={item.value}
          />
        );
      case "number":
        return (
          <Input
            placeholder={item.placeholder}
            type="number"
            value={item.value}
          />
        );
      case "textarea":
        return (
          <Input
            placeholder={item.placeholder}
            rows="3"
            type="textarea"
            value={item.value}
          />
        );
      case "toggle":
        return (
          <>
            <label className="custom-toggle">
              <input type="checkbox" />
              <span className="custom-toggle-slider rounded-circle" />
            </label>
            <span className="clearfix" />
          </>
        );
      case "checkbox":
        return (
          <>
            <div className="custom-control custom-checkbox mb-3">
              <input
                className="custom-control-input"
                id="customCheck1"
                type="checkbox"
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                Unchecked
              </label>
            </div>
            <div className="custom-control custom-checkbox mb-3">
              <input
                className="custom-control-input"
                defaultChecked
                id="customCheck2"
                type="checkbox"
              />
              <label className="custom-control-label" htmlFor="customCheck2">
                Checked
              </label>
            </div>
            <div className="custom-control custom-checkbox mb-3">
              <input
                className="custom-control-input"
                disabled
                id="customCheck3"
                type="checkbox"
              />
              <label className="custom-control-label" htmlFor="customCheck3">
                Disabled Unchecked
              </label>
            </div>
            <div className="custom-control custom-checkbox mb-3">
              <input
                className="custom-control-input"
                defaultChecked
                disabled
                id="customCheck4"
                type="checkbox"
              />
              <label className="custom-control-label" htmlFor="customCheck4">
                Disabled Checked
              </label>
            </div>
          </>
        );
      case "radio":
        return (
          <>
            <div className="custom-control custom-radio mb-3">
              <input
                className="custom-control-input"
                id="customRadio5"
                name="custom-radio-2"
                type="radio"
              />
              <label className="custom-control-label" htmlFor="customRadio5">
                Unchecked
              </label>
            </div>
            <div className="custom-control custom-radio mb-3">
              <input
                className="custom-control-input"
                defaultChecked
                id="customRadio6"
                name="custom-radio-2"
                type="radio"
              />
              <label className="custom-control-label" htmlFor="customRadio6">
                Checked
              </label>
            </div>
            <div className="custom-control custom-radio mb-3">
              <input
                className="custom-control-input"
                disabled
                id="customRadio7"
                name="custom-radio-2"
                type="radio"
              />
              <label className="custom-control-label" htmlFor="customRadio7">
                Disabled unchecked
              </label>
            </div>
            <div className="custom-control custom-radio mb-3">
              <input
                className="custom-control-input"
                defaultChecked
                disabled
                id="customRadio8"
                name="custom-radio-2"
                type="radio"
              />
              <label className="custom-control-label" htmlFor="customRadio8">
                Disabled checkbox
              </label>
            </div>
          </>
        );
      case "slider":
        return <div></div>;
      case "options":
        return <div></div>;
      case "scale":
        return <div></div>;

      case "date":
        return (
          <ReactDatetime
            inputProps={{
              placeholder: "Date Picker Here",
            }}
            timeFormat={false}
            renderDay={(props, currentDate, selectedDate) => {
              let classes = props.className;
              if (
                this.state.startDate &&
                this.state.endDate &&
                this.state.startDate._d + "" === currentDate._d + ""
              ) {
                classes += " start-date";
              } else if (
                this.state.startDate &&
                this.state.endDate &&
                new Date(this.state.startDate._d + "") <
                  new Date(currentDate._d + "") &&
                new Date(this.state.endDate._d + "") >
                  new Date(currentDate._d + "")
              ) {
                classes += " middle-date";
              } else if (
                this.state.endDate &&
                this.state.endDate._d + "" === currentDate._d + ""
              ) {
                classes += " end-date";
              }
              return (
                <td {...props} className={classes}>
                  {currentDate.date()}
                </td>
              );
            }}
            onChange={(e) => this.setState({ startDate: e })}
          />
        );

      default:
    }
  };
  render() {
    const { todos } = this.state;
    return (
      <div className="app">
        <main className="profile-page" ref="main">
          <section className="section-profile-cover section-shaped my-0">
            {/* Circles background */}
            <div className="shape shape-style-1 shape-default alpha-4">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            {/* SVG separator */}
            <div className="separator separator-bottom separator-skew">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
              >
                <polygon
                  className="fill-white"
                  points="2560 0 2560 100 0 100"
                />
              </svg>
            </div>
          </section>
          <section className="section">
            <Container>
              <Card className="card-profile shadow mt--300">
                <div className="px-4">
                  <Row className="justify-content-center">
                    <Col className="order-lg-2" lg="3"></Col>
                    <Col
                      className="order-lg-3 text-lg-right align-self-lg-center"
                      lg="4"
                    >
                      <div className="card-profile-actions py-4 mt-lg-0">
                        <Button
                          className="mr-4"
                          color="info"
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                          size="sm"
                        >
                          PREVIOUS
                        </Button>
                        <Button
                          className="float-right"
                          color="default"
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                          size="sm"
                        >
                          NEXT
                        </Button>
                      </div>
                    </Col>
                    <Col className="order-lg-1" lg="4"></Col>
                  </Row>
                  <Row>
                    <Col sm="3">
                      <div className="nav-wrapper">
                        <ListGroup>
                          {todos &&
                            todos.length > 0 &&
                            todos.map((item, i) => (
                              <ListGroupItem
                                key={item.id}
                                className={classnames("", {
                                  active: this.state.iconTabs === i + 1,
                                })}
                                onClick={(e) =>
                                  this.toggleNavs(e, "iconTabs", i + 1)
                                }
                              >
                                {item.title}
                              </ListGroupItem>
                            ))}{" "}
                        </ListGroup>
                      </div>
                    </Col>
                    <Col sm="9">
                      <TabContent activeTab={"iconTabs" + this.state.iconTabs}>
                        {todos &&
                          todos.length > 0 &&
                          todos.map((item, i) => (
                            <TabPane tabId={`iconTabs${i + 1}`} key={item.id}>
                              <h4 class="mb-1">
                                {i + 1} {item.title}
                              </h4>
                              <p class="mt-0">{item.desc}</p>
                              {item.questions &&
                                item.questions.length > 0 &&
                                item.questions.map((q, j) => (
                                  <div
                                    tabId={`tabquest${j + 1}`}
                                    key={`tabquest${j + 1}`}
                                  >
                                    <small class="text-uppercase font-weight-bold">
                                      {i + 1} {q.title}
                                    </small>

                                    <p class="text-muted mb-0">{q.desc}</p>
                                    <FormGroup>{this.getSection(q)}</FormGroup>

                                    <hr />
                                  </div>
                                ))}{" "}
                            </TabPane>
                          ))}{" "}
                      </TabContent>
                    </Col>
                  </Row>

                  <div className="mt-5 py-5 border-top text-center">
                    <Row className="justify-content-center">
                      <Col lg="9"></Col>
                    </Row>
                  </div>
                </div>
              </Card>
            </Container>
          </section>
        </main>
      </div>
    );
  }
}

function removeOptimisticTodo(todos) {
  // return all 'real' todos
  return todos.filter((todo) => {
    return todo.ref;
  });
}
