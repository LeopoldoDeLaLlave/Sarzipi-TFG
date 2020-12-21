import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../../App';
import axios from 'axios';
import materialize from 'materialize-css';
import { Form, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet'

const Signin = () => {

    //Título de la página
    const TITLE = 'Iniciar sesión'

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
            history.push('/myfollowingpost');
        }, (error) => {
            materialize.toast({ html: error.response.data.error, classes: "#b71c1c red darken-4" });

        });;
    }
    return (
        <div className="myCard">
            <Helmet>
                <title>{TITLE}</title>
            </Helmet>

            <Form onSubmit={(e) => postData(e)} className="mx-auto" id="formularioInicioSesion">
                <h1 >Sarzipi</h1>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email"
                        placeholder="Introduce el email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control type="password"
                        placeholder="Introduce la ontraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                </Form.Group>


                <Button variant="primary" type="submit">
                    Iniciar sesión
                </Button>
                <br /><br />
                <Form.Label>
                    <h3>
                        <Link to="/signup">¿No tienes cuenta?</Link>
                    </h3>
                </Form.Label>
            </Form>
        </div>
    );
};

export default Signin;