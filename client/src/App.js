import React from "react";
import { Switch, Route } from "react-router-dom";
import './App.css';

// Importing components for routing and navigation
import Navigation from "./components/common/navigation/Navigation";
import Home from "./components/common/home/Home";
import Register from "./components/user/Register";
import Login from "./components/user/Login";
import userService from "./services/user-services";
import Logout from "./components/user/Logout";
import Create from "./components/events/create/Create";
import NotFound from "./components/common/notFound/NotFound";
import Edit from "./components/events/edit/Edit";
import Profile from "./components/user/profile/Profile";
import Details from "./components/events/details/Details";
import isLoggedIn from "./utils/auth";

// Utility function to render components with additional props
function renderCmp(Cmp, otherProps) {
    return function (props) {
        return <Cmp {...props} {...otherProps} />;
    };
}

// Main App component handling routing and authentication state
class App extends React.Component {
    constructor(props) {
        super(props);
        // Initialize state with authentication status
        this.state = { isLoggedIn };
    }

    // Handles user registration and updates login state
    register = (data, history) => {
        userService.register(data).then(() => {
            this.setState({ isLoggedIn: true });
            history.push('/'); // Redirect to home page after successful registration
        });
    };

    // Handles user logout and updates login state
    logout = (history) => {
        userService.logout().then(() => {
            this.setState({ isLoggedIn: false });
            history.push('/'); // Redirect to home page after logout
            return null;
        });
    };

    // Handles user login and updates login state
    login = (data, history) => {
        userService.login(data).then(() => {
            this.setState({ isLoggedIn: true });
            history.push('/'); // Redirect to home page after successful login
        });
    };

    // Renders the main application layout with navigation and routes
    render() {
        const { isLoggedIn } = this.state;

        return (
            <div className="App">
                {/* Navigation component with login status and logout functionality */}
                <Navigation isLoggedIn={isLoggedIn} logout={this.logout} />
                {/* Switch component to handle route matching */}
                <Switch>
                    {/* Home route, accessible to all users */}
                    <Route path="/" exact component={renderCmp(Home, { isLoggedIn })} />
                    {/* Conditional routes for unauthenticated users */}
                    {!isLoggedIn && (
                        <Route
                            path="/register"
                            component={renderCmp(Register, { register: this.register })}
                        />
                    )}
                    {!isLoggedIn && (
                        <Route path="/login" component={renderCmp(Login, { login: this.login })} />
                    )}
                    {/* Conditional routes for authenticated users */}
                    {isLoggedIn && (
                        <Route
                            path="/logout"
                            component={renderCmp(Logout, { logout: this.logout })}
                        />
                    )}
                    {isLoggedIn && <Route path="/create" component={Create} />}
                    {isLoggedIn && (
                        <Route path="/details/:id" component={renderCmp(Details)} />
                    )}
                    {isLoggedIn && <Route path="/edit/:id" component={renderCmp(Edit)} />}
                    {isLoggedIn && <Route path="/profile" component={renderCmp(Profile)} />}
                    {/* Fallback route for unmatched paths */}
                    <Route path="*" component={NotFound} />
                </Switch>
            </div>
        );
    }
}

export default App;