import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import materialize from 'materialize-css';
import { Form, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

const CreatePost = () => {




    const history = useHistory();

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [photo, setPhoto] = useState("");

    const [etiqueta0, setEtiqueta0] = useState("");
    const [etiqueta1, setEtiqueta1] = useState("");
    const [etiqueta2, setEtiqueta2] = useState("");
    const [etiqueta3, setEtiqueta3] = useState("");
    const [etiqueta4, setEtiqueta4] = useState("");


    //Título de la página
    const TITLE = 'Subir Receta'
    //Nos indica si la acción de subir posts está siendo ejecutada en ese momento
    const [pulsado, setPulsado] = useState(false);


    //Una vez subida la foto a cloudinary y conseguida su url, se ejecuta este
    //código para guardar el post en la base de datos
    useEffect(() => {


        if (photo) {

            //Aquí guardaremos las etiquetas del post
            var etiquetas = [];

            //vamos a llenar el array con las etiquetas
            if(etiqueta0.replace(/\s/g, '').length > 0){
                etiquetas.push({'text' : etiqueta0.replace(/\s/g, '')});
            }

            if(etiqueta1.replace(/\s/g, '').length > 0){
                etiquetas.push({'text' : etiqueta1.replace(/\s/g, '')});
            }

            if(etiqueta2.replace(/\s/g, '').length > 0){
                etiquetas.push({'text' : etiqueta2.replace(/\s/g, '')});
            }

            if(etiqueta3.replace(/\s/g, '').length > 0){
                etiquetas.push({'text' : etiqueta3.replace(/\s/g, '')});
            }

            if(etiqueta4.replace(/\s/g, '').length > 0){
                etiquetas.push({'text' : etiqueta4.replace(/\s/g, '')});
            }
            


            const newPost = {
                title,
                body,
                photo,
                etiquetas
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
                console.log("hola");
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

    //Se encarga de cambiar el valor de cada etiqueta
    //para ello recibe el valor que va a tomar la etiqueta
    //y el número de etiqueta al que le corresponde el valor
    const ponerEtiquetas = (valor, nEtiqueta) => {
        switch (nEtiqueta) {
            case 0:
                setEtiqueta0(valor.toLowerCase());
                break;
            case 1:
                setEtiqueta1(valor.toLowerCase());
                break;
            case 2:
                setEtiqueta2(valor.toLowerCase());
                break;
            case 3:
                setEtiqueta3(valor.toLowerCase());
                break;
            case 4:
                setEtiqueta4(valor.toLowerCase());
                break;
        }

    }

    return (
        <div >
            <Helmet>
                <title>{TITLE}</title>
            </Helmet>

            <Form onSubmit={(e) => postDetails(e)} className="mx-auto customForm" id="formularioSubirPost">
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
                <h3>Etiquetas</h3>
                <Form.Group>

                    <Form.Control type="text"
                        value={etiqueta0}
                        onChange={(e) => ponerEtiquetas(e.target.value, 0)}
                    />

                </Form.Group>
                <Form.Group>

                    <Form.Control type="text"
                        value={etiqueta1}
                        onChange={(e) => ponerEtiquetas(e.target.value, 1)}
                    />

                </Form.Group>
                <Form.Group>

                    <Form.Control type="text"
                        value={etiqueta2}
                        onChange={(e) => ponerEtiquetas(e.target.value, 2)}
                    />

                </Form.Group>

                <Form.Group>

                    <Form.Control type="text"
                        value={etiqueta3}
                        onChange={(e) => ponerEtiquetas(e.target.value, 3)}
                    />

                </Form.Group>

                <Form.Group>

                    <Form.Control type="text"
                        value={etiqueta4}
                        onChange={(e) => ponerEtiquetas(e.target.value, 4)}
                    />

                </Form.Group>



                <br />
                <Form.Group>
                    <Form.File id="exampleFormControlFile1"
                        label="Seleccionar foto"
                        accept=".jpg,.png"
                        onChange={(e) => setImage(e.target.files[0])} required />
                </Form.Group>

                <Button variant="primary"
                    type="submit"
                    id="btnPost">
                    Subir
                </Button>
            </Form>
            <br/><br/><br/>
        </div>

    )
}

export default CreatePost;