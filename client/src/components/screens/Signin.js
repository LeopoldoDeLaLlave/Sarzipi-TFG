import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../../App';
import axios from 'axios';
import materialize from 'materialize-css';
import { Helmet } from 'react-helmet'

const Signin = () => {

    //Título de la página
    const TITLE = 'Registro'

    const { state, dispatch } = useContext(UserContext);

    const history = useHistory();

    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const postData = async (e) => {
        e.preventDefault();
        const newUser = {
            email,
            password
        };
        axios.post('http://localhost:5000/signin', newUser).then((response) => {
            localStorage.setItem("jwt", JSON.stringify(response.data.token));
            localStorage.setItem("user", JSON.stringify(response.data.user));
            //Al hacer login ponemos en el context el usuario
            dispatch({ type: "USER", payload: response.data.user });
            materialize.toast({ html: "Signedin Succes", classes: "##69f0ae green accent-2" });
            history.push('/');
        }, (error) => {
            materialize.toast({ html: error.response.data.error, classes: "#b71c1c red darken-4" });

        });;
    }
    return (
        <div className="myCard">
            <Helmet>
                <title>{TITLE}</title>
            </Helmet>
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <form onSubmit={(e) => postData(e)}>
                    <input type="email"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                    <input type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                    <button className="btn waves-effect waves-light #64b5f6 blue darken-1">
                        Login
                    </button>
                </form>

                <h5>
                    <Link to="/signup">Don't have an account?</Link>
                </h5>
            </div>
        </div>
    );
};

export default Signin;