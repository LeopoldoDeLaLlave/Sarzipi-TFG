import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import materialize from 'materialize-css';
import { Form, Button} from 'react-bootstrap'
import { Helmet } from 'react-helmet'

const CreatePost = () => {




    const history = useHistory();

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [photo, setPhoto] = useState("");

    //Título de la página
    const TITLE = 'Subir Receta'
    //Nos indica si la acción de pulsar like está siendo ejecutada en ese momento
    const [pulsado, setPulsado] = useState(false);


    //Cuando se produce un cambio en foto se ejecuta este código
    useEffect(() => {


        if (photo) {

            const newPost = {
                title,
                body,
                photo
            };

            axios.post('http://localhost:5000/createpost', newPost, {
                headers: {
                    //le quitamos las comillas al token
                    'Authorization': "Bearer " + localStorage.getItem("jwt").slice(1, -1)
                },
            }).then((response) => {
                materialize.toast({ html: "Created post", classes: "##69f0ae green accent-2" });
                history.push('/');
            }, (error) => {
                console.log(error.response);
                materialize.toast({ html: error.response.data.error, classes: "#b71c1c red darken-4" });

            });
            //setPulsado(false);
        }
    }, [photo]);



    //Subimos la foto a cloudinary y guardamos la url en el estado
    const postDetails = (e) => {
        if (!pulsado) {
            setPulsado(true);
            e.preventDefault();
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", "insta-clone");
            data.append("cloud_name", "dniykkyhc");



            axios.post('https://api.cloudinary.com/v1_1/dniykkyhc/image/upload', data).then((response) => {
                setPhoto(response.data.url);
            }, (error) => {
                console.log(error);
            });;
        }
    }


    return (
        <div className="card input-file" style={{
            margin: "30px auto",
            maxWidth: "500px",
            padding: "20px",
            textAlign: "center"
        }}>
            <Helmet>
                <title>{TITLE}</title>
            </Helmet>

            <Form onSubmit={(e) => postDetails(e)} id="formularioSubirPost">
                <Form.Group>

                    <Form.Control type="text"
                        placeholder="Título"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required />
                    <br />
                    

                </Form.Group>
                <Form.Group >
                    <Form.Label>Cuerpo</Form.Label>
                    <Form.Control as="textarea"
                        rows={3}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required />
                </Form.Group>
                <Form.Group>
                    <Form.File id="exampleFormControlFile1"
                        label="Seleccionar foto"
                        onChange={(e) => setImage(e.target.files[0])} required />
                </Form.Group>

                <Button variant="primary"
                    type="submit"
                    id="btnPost">
                    Submit
                </Button>               
            </Form>
        </div>

    )
}

export default CreatePost;