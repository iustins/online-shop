import React, { Component } from 'react';
import { attemptLogin } from '../../helpers';
import Head from 'next/head';
import Link from 'next/link';

export default class Login extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            isLoggedIn: false
        };
    }

    _attemptLogin = (event) => {
        event.preventDefault();

        let data = new FormData();
        data.append("email", document.getElementById('email').value);
        data.append("password", document.getElementById('password').value);

        attemptLogin(data, response => {
            if (response.success)
            {
                let appState = {
                    isLoggedIn: true,
                    user: response.data
                };

                localStorage["appState"] = JSON.stringify(appState);

                this.setState({
                    isLoggedIn: appState.isLoggedIn,
                    user: appState.user
                });

                document.getElementById('goToDashboard').click();
            }
            else
            {
                console.log('The login failed');
            }
        });
    };

    render()
    {
        return(
            <div className="page-container">
                <Head>
                    <title>Online-Shop Admin - Login</title>
                    <link rel="stylesheet" type="text/css" href="/static/login_assets/fonts/font-awesome-4.7.0/css/font-awesome.min.css"/>
                    <link rel="stylesheet" type="text/css" href="/static/login_assets/css/util.css"/>
                    <link rel="stylesheet" type="text/css" href="/static/login_assets/css/main.css"/>
                </Head>

                <div className="limiter">
                    <div className="container-login100">
                        <div className="wrap-login100">
                            <form onSubmit={ event => this._attemptLogin(event) } className="login100-form validate-form">
                                <span className="login100-form-title p-b-43">
						            Admin Panel Login
					            </span>

                                <div className="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
                                    <input className="input100" type="text" name="email" id="email"/>
                                        <span className="focus-input100"></span>
                                        <span className="label-input100">Email</span>
                                </div>

                                <div className="wrap-input100 validate-input" data-validate="Password is required">
                                    <input className="input100" type="password" name="password" id="password" />
                                        <span className="focus-input100"></span>
                                        <span className="label-input100">Password</span>
                                </div>

                                <div className="flex-sb-m w-full p-t-3 p-b-32">
                                    <div className="contact100-form-checkbox">
                                        <input className="input-checkbox100" id="ckb1" type="checkbox" name="remember-me" />
                                            <label className="label-checkbox100" htmlFor="ckb1">
                                                Remember me
                                            </label>
                                    </div>

                                    <div>
                                        <a href="#" className="txt1">
                                            Forgot Password?
                                        </a>
                                    </div>
                                </div>

                                <div className="container-login100-form-btn">
                                    <button className="login100-form-btn">
                                        Login
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>

                <div style={ { display: 'none' } }>
                    <Link href="/admin/dashboard">
                        <a id="goToDashboard">Dashboard</a>
                    </Link>
                </div>

                <script src="/static/login_assets/js/jquery-3.2.1.min.js"></script>
                <script src="/static/login_assets/js/main.js"></script>
            </div>
        );
    }
};
