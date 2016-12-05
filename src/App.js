import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import NavigationBar from './Components/NavigationBar';
import Footer from './Components/Footer';
import HomeView from './Views/HomeView';
import LoginView from './Views/LoginView';
import RegisterView from './Views/RegisterView';
import ListNewsView from './Views/ListNewsView';
import $ from 'jquery';
import KinveyRequester from './KinveyRequester';

export default class App extends Component {
    constructor (props) {
      super(props);
      this.state = {
        username: null,
        userID: null
      };
    }

    componentDidMount(){
      $(document).on({
        ajaxStart: function () {$("#loadingBox").show()},
          ajaxStop: function () {$("#loadingBox").hide()}
          });
      $(document).ajaxError(this.handleAjaxError.bind(this));

      this.setState ({
            username: sessionStorage.getItem("username"),
            userID: sessionStorage.getItem("userId")
        });

      this.showHomeView();

      $('#errorBox, #infoBox').click(function () {$(this).hide()});
    }



    handleAjaxError(event, response) {
        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error.";
        if (response.responseJSON &&
            response.responseJSON.description)
            errorMsg = response.responseJSON.description;
        this.showError(errorMsg);
    }
    showInfo(message) {
        $('#infoBox').text(message).show();
        setTimeout(function() {
            $('#infoBox').fadeOut();
        }, 3000);
    }

    showError(errorMsg) {
        $('#errorBox').text("Error: " + errorMsg).show();
    }




    render() {
    return (
      <div className="App">
        <header>
          <NavigationBar
              username={this.state.username}
              homeClicked={this.showHomeView.bind(this)}
              loginClicked={this.showLoginView.bind(this)}
              registerClicked={this.showRegisterView.bind(this)}
              newsClicked={this.showNewsView.bind(this)}
              createNewsClicked={this.showCreateNewsView.bind(this)}
             logoutClicked={this.logout.bind(this)}

          />
          <div id="loadingBox">Loading...</div>
          <div id="infoBox">Info msg</div>
          <div id="errorBox">Error msg</div>
        </header>
        <div id="main">
        </div>
        <Footer />
      </div>
    );
  }
    showView(reactComponent){
        ReactDOM.render(
            reactComponent,
            document.getElementById('main')
        );
        $('#errorBox').hide();
    }

    showHomeView(){
      this.showView(<HomeView username={this.state.username}/>);
    }

    showLoginView(){
      this.showView(<LoginView onsubmit={this.login.bind(this)}/>);

    }

    login(username,password) {
      KinveyRequester.loginUser(username,password).then(loginSuccess.bind(this));
      
      function loginSuccess(userInfo) {
        this.saveAuthInSession(userInfo);
        this.showInfo("Login Successfull");
        this.showBookView();
      }

    }

    saveAuthInSession(userInfo) {
        sessionStorage.setItem('authToken', userInfo._kmd.authtoken);
        sessionStorage.setItem('userId', userInfo._id);
        sessionStorage.setItem('username', userInfo.username);

        // This will update the entire app UI (e.g. the navigation bar)
        this.setState({
            username: userInfo.username,
            userId: userInfo._id
        });
    }


    showRegisterView() {
      this.showView(<RegisterView onsubmit={this.register.bind(this)}/>);
    }

    register (username, password) {
        KinveyRequester.registerUser(username,password).then(registerSuccess.bind(this));

        function registerSuccess(userInfo) {
            this.saveAuthInSession(userInfo);
            this.showInfo("Registration Successfull");
            this.showBookView();
        }
    }

    showNewsView (){
      alert("show news");
      this.showView(<ListNewsView />);

    }

    showCreateBookView() {

    }

    logout() {
        sessionStorage.clear();
        // This will update the entire app UI (e.g. the navigation bar)
        this.setState({
            username: null,
            userId: null
        });
        this.showHomeView();
    }
}
