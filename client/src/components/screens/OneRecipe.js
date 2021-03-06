import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { Card, Form, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';

const OneRecipe = () => {

    //Nos indica si la acción de pulsar like está siendo ejecutada en ese momento
    var pulsado = false;
    const [data, setData] = useState(null);
    const { state, dispatch } = useContext(UserContext);
    const { postid } = useParams();
    const history = useHistory();


    useEffect(() => {

        const fetchData = async () => {
            const result = await axios.get(`http://localhost:5000/receta/${postid}`, {
                headers: {
                    //le quitamos las comillas al token
                    'Authorization': "Bearer " + localStorage.getItem("jwt").slice(1, -1)
                },
            })
            setData(result.data.receta);

        }

        fetchData();


    }, [])




    //Pone o quita un like a una publicación
    const likePost = async (id) => {
        if (!pulsado) {//Solo se ejecuta si no se está ejecuntando la acción para no poder dar más de un like
            pulsado = true;
            const postInfo = { postId: id }


            //Nos devuelve un objeto indicando si ese usuario ya ha dado like a la foto
            const presente = await axios.put('http://localhost:5000/checklikes', postInfo, {
                headers: {
                    //le quitamos las comillas al token
                    'Authorization': "Bearer " + localStorage.getItem("jwt").slice(1, -1)
                },
            });
            //Si el usuario no ha dado like al pulsar le da like, si ya le ha dado like le da dislike
            if (!presente.data.presente) {
                const result = await axios.put('http://localhost:5000/like', postInfo, {
                    headers: {
                        //le quitamos las comillas al token
                        'Authorization': "Bearer " + localStorage.getItem("jwt").slice(1, -1)
                    },
                });

                setData(result.data);
            } else {
                const unlikeResult = await axios.put('http://localhost:5000/unlike', postInfo, {
                    headers: {
                        //le quitamos las comillas al token
                        'Authorization': "Bearer " + localStorage.getItem("jwt").slice(1, -1)
                    },
                });

                setData(unlikeResult.data);

            }

            pulsado = false;//Al terminar la acción se puede volver a pulsar
        }


    }

    //Pone un comentario en la publicación
    const makeComment = async (text, postID) => {
        const commentResult = await axios.put('http://localhost:5000/comment', { postID, text }, {
            headers: {
                //le quitamos las comillas al token
                'Authorization': "Bearer " + localStorage.getItem("jwt").slice(1, -1)
            },
        });

        console.log(commentResult.data);



        setData(commentResult.data);

    }

    //Se encarga de borrar un comentario
    //Solo puede borrarlos el autor del comentario
    const deleteComment = async (postid, commentid) => {

        const deleteComentResult = await axios.delete(`http://localhost:5000/deletecomment/${postid}/${commentid}`, {
            headers: {
                //le quitamos las comillas al token
                'Authorization': "Bearer " + localStorage.getItem("jwt").slice(1, -1)
            },
        });





        setData(deleteComentResult.data);


    }

    //Elimina el post
    const deletePost = async (postid) => {

        const result = await axios.delete(`http://localhost:5000/deletepost/${postid}`, {
            headers: {
                //le quitamos las comillas al token
                'Authorization': "Bearer " + localStorage.getItem("jwt").slice(1, -1)
            },
        });
        history.push('/myfollowingpost');
    }

    return (
        <div className="home">
            <Helmet>
                <title>{data ? `Sarzipi: ${data.title}` : "Sarzipi"}</title>
            </Helmet>
            {
                data ?
                    <Card style={{ width: '80%' }} key={data._id} className="mx-auto">
                        <h5>
                            <Link to={data.postedBy._id != state._id ? `/profile/${data.postedBy._id}` : '/profile'}>{data.postedBy.name}</Link> {data.postedBy._id == state._id
                                && <i className="material-icons" style={{
                                    float: "right"
                                }}
                                    onClick={() => deletePost(data._id)}
                                >delete</i>
                            }
                        </h5>
                        <Card.Img variant="top" src={data.photo} alt={"postedBy:" + data.postedBy.name + data.title} />
                        <Card.Body>
                            <i className={data.likes.find(i => i == state._id) ? "material-icons corazonRojo" : "material-icons corazonBlanco"}
                                onClick={() => likePost(data._id)}>favorite</i>
                            <h6>{data.likes.length} likes</h6>

                            <Card.Title><b>{data.title}</b></Card.Title>
                            {
                                data.etiquetas.map(etiqueta => {
                                    return (
                                        <div >
                                            <div className="etiqueta"><Link to={`/recetas/${etiqueta.text}`}>{etiqueta.text}</Link></div>
                                        </div>
                                        

                                    )
                                    console.log(etiqueta);
                                })
                            }
                            <br /><br />
                            <Card.Text>{data.body}</Card.Text>
                            <br />
                            {
                                data.comments.map(record => {
                                    console.log(record);
                                    return (
                                        <h6 key={record._id}>
                                            <span style={{ fontWeight: "500" }}>{record.postedBy.name + " "}</span>:{" " + record.text}
                                            {(record.postedBy._id == state._id || data.postedBy._id == state._id)
                                                && <i className="material-icons" style={{
                                                    float: "right"
                                                }}
                                                    onClick={() => deleteComment(data._id, record._id)}
                                                >delete</i>
                                            }
                                        </h6>
                                    )
                                }

                                )
                            }
                            <Form onSubmit={(e) => {
                                e.preventDefault();

                                //Para comentar hay que escribir algo
                                if (e.target[0].value.length > 0) {
                                    makeComment(e.target[0].value, data._id);
                                    //Vacíamos la caja de comentarios
                                    e.target[0].value = "";
                                }

                            }}>
                                <Form.Group>

                                    <Form.Control type="text"
                                        placeholder="Pon un comentario"
                                        required />
                                    <br />


                                </Form.Group>
                                <Button variant="primary"
                                    type="submit"
                                    id="btnPost">
                                    Comentar
                                    </Button>

                            </Form>
                        </Card.Body>
                    </Card>
                    :
                    <h1>loading...</h1>

            }


        </div>
    );
};

export default OneRecipe;