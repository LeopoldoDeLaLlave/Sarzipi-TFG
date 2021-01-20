import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import materialize from 'materialize-css';
import { Form, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

const Signup = () => {

    const history = useHistory();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [url, setUrl] = useState(undefined);

    //Título de la página
    const TITLE = 'Registro'

    useEffect(() => {
        if (url) {
            uploadFields();
        }
    }, [url]);


    const uploadFields = () => {
        const newUser = {
            name: name.replace(/\s/g, '').toLowerCase(),
            email: email.replace(/\s/g, '').toLowerCase(),
            password,
            pic: url
        };
        axios.post('http://localhost:5000/signup', newUser).then((response) => {
            materialize.toast({ html: response.data.message, classes: "##69f0ae green accent-2" });
            history.push('/signin');
        }, (error) => {
            materialize.toast({ html: error.response.data.error, classes: "#b71c1c red darken-4" });

        });;
    }

    const postData = async (e) => {

        e.preventDefault();
        if (profileImage) {
            uploadPic(e);
        } else {
            uploadFields();
        }



    }

    //Subimos la foto a cloudinary y guardamos la url en el estado
    const uploadPic = (e) => {



        e.preventDefault();
        const data = new FormData();
        data.append("file", profileImage);
        data.append("upload_preset", "insta-clone");
        data.append("cloud_name", "dniykkyhc");



        axios.post('https://api.cloudinary.com/v1_1/dniykkyhc/image/upload', data).then((response) => {
            setUrl(response.data.url);
        }, (error) => {
            console.log(error);
        });

    }


    return (
        <div >
            <Helmet>
                <title>{TITLE}</title>
            </Helmet>

            <h1>Sarzipi</h1>
            <Form onSubmit={(e) => postData(e)}>
                <Form.Group >
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control type="text"
                        placeholder="Introduce el nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required />
                </Form.Group>
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



                <Form.Group>
                    <Form.File id="exampleFormControlFile1"
                        label="Foto de perfil"
                        onChange={(e) => setProfileImage(e.target.files[0])} />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Crear cuenta
                </Button> 
                <br/><br/>
                <Form.Label>
                    <h3>
                        <Link to="/signin">¿Ya tienes cuenta?</Link>
                    </h3>
                </Form.Label>
            </Form>

        </div>

    );
};

export default Signup;