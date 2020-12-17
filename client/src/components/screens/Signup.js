import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import materialize from 'materialize-css';
import { Helmet } from 'react-helmet';

const Signup = () => {

    const history = useHistory();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [url, setUrl] = useState(undefined);

    //Título de la página
    const TITLE = 'Iniciar Sesión'

    useEffect(() => {
        if (url) {
            uploadFields();
        }
    }, [url]);


    const uploadFields = () => {
        const newUser = {
            name,
            email,
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
        <div className="myCard">
            <Helmet>
                <title>{TITLE}</title>
            </Helmet>
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <form onSubmit={(e) => postData(e)}>
                    <input type="text"
                        placeholder="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required />
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
                    <div className="file-field input-field">
                        <div className="btn #64b5f6 blue darken-1">
                            <span>Upload pic</span>
                            <input type="file" onChange={(e) => setProfileImage(e.target.files[0])} />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" />
                        </div>
                    </div>
                    <button className="btn waves-effect waves-light #64b5f6 blue darken-1">
                        SignUp
                    </button>
                </form>

                <h5>
                    <Link to="/signin">Already have an account?</Link>
                </h5>
            </div>
        </div>
    );
};

export default Signup;