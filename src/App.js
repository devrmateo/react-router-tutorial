import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom'
import './App.css'

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100) //fake async
  },
  signout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
}

const Public = () => <h3>Public</h3>
const Protected = () => <h3>Protected</h3>

class Login extends Component {
  state = {
    redirectToReferrer: false
  }

  login = () => (
    fakeAuth.authenticate(() => {
      this.setState({
        redirectToReferrer: true
      })
    })
  )

  render() {

    const { redirectToReferrer } = this.state;
    const { referrer } = this.props.location.state || { referrer: {
        pathname: '/'
    }};

    if (redirectToReferrer === true) {
      return (
        <Redirect
            to={referrer}
        />
      )
    }
    return (
      <div>
        <button
          onClick={this.login}
        >
          Log in
        </button>
        <p>You must log in to view the page at {referrer}.</p>
      </div>
    )
  }
}

const AuthButton = withRouter(({ history }) => (
  fakeAuth.isAuthenticated
  ? (
      <p>
        <button
          onClick={() => {
            fakeAuth.signout(() => history.push('/'))
          }}
        >
          Sign out
        </button>
      </p>
    )
  :
    <p>You are not logged in.</p>
))

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route { ...rest } render={(props) => (
    fakeAuth.isAuthenticated === true
    ? <Component {...props} />
    : <Redirect to={{
        pathname: '/login',
        state: {
          referrer: props.location.pathname
        }
      }} />
    )} />
  )

class App extends Component {
  render() {
    return (
      <Router>
        <div>
        <AuthButton />
          <ul>
            <li>
              <Link to='/public'>Public Page</Link>
            </li>
            <li>
              <Link to='/protected'>Protected Page</Link>
            </li>
          </ul>

          <Route path='/public' component={Public} />
          <Route path='/login' component={Login} />
          <PrivateRoute path='/protected' component={Protected} />
        </div>
      </Router>
    );
  }
}

export default App;
