import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import axios from 'axios';
import { Card, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

const Home = () => {

    //Nos indica si la acción de pulsar like está siendo ejecutada en ese momento
    var pulsado = false;
    const [data, setData] = useState([]);
    const { state, dispatch } = useContext(UserContext);

    //Título de la página
    const TITLE = 'Sarzipi'

    useEffect(() => {

        const fetchData = async () => {
            const result = await axios.get('http://localhost:5000/getsubpost', {
                headers: {
                    //le quitamos las comillas al token
                    'Authorization': "Bearer " + localStorage.getItem("jwt").slice(1, -1)
                },
            })

            setData(result.data.posts);

        }

        fetchData();


    }, [])

    const likePost = async (id) => {
        if (!pulsado) {//Solo se ejecuta si no se está ejecuntando la acción
            console.log("hola");
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
                const newData = data.map(item => {

                    if (item._id == result.data._id) {
                        return result.data;
                    } else {
                        return item;
                    }
                }
                )
                setData(newData);
            } else {
                const unlikeResult = await axios.put('http://localhost:5000/unlike', postInfo, {
                    headers: {
                        //le quitamos las comillas al token
                        'Authorization': "Bearer " + localStorage.getItem("jwt").slice(1, -1)
                    },
                });
                const newData = data.map(item => {

                    if (item._id == unlikeResult.data._id) {
                        return unlikeResult.data;
                    } else {
                        return item;
                    }
                }
                )
                setData(newData);

            }

            pulsado = false;//Al terminar la cción se puede volver a pulsar
        }


    }

    const makeComment = async (text, postID) => {
        const commentResult = await axios.put('http://localhost:5000/comment', { postID, text }, {
            headers: {
                //le quitamos las comillas al token
                'Authorization': "Bearer " + localStorage.getItem("jwt").slice(1, -1)
            },
        });


        const newData = data.map(item => {

            if (item._id == commentResult.data._id) {
                return commentResult.data;
            } else {
                return item;
            }
        }
        )

        setData(newData);

    }


    const deletePost = async (postid) => {

        const result = await axios.delete(`http://localhost:5000/deletepost/${postid}`, {
            headers: {
                //le quitamos las comillas al token
                'Authorization': "Bearer " + localStorage.getItem("jwt").slice(1, -1)
            },
        });
        const newData = data.filter(item => {
            return item._id != result.data._id
        })
        setData(newData);
    }

    return (
        <div className="home">
            <Helmet>
                <title>{TITLE}</title>
            </Helmet>
            {
                data.map(item => {
                    return (
                        <Card style={{ width: '80%' }} key={item._id} className="mx-auto">
                            <h5>
                                <Link to={item.postedBy._id != state._id ? `/profile/${item.postedBy._id}` : '/profile'}>{item.postedBy.name}</Link> {item.postedBy._id == state._id
                                    && <i className="material-icons" style={{
                                        float: "right"
                                    }}
                                        onClick={() => deletePost(item._id)}
                                    >delete</i>
                                }
                            </h5>
                            <Card.Img variant="top" src={item.photo} alt={"postedBy:" + item.postedBy.name + item.title} />
                            <Card.Body>
                                <i 
                                    className={item.likes.find(i=>i==state._id)? "material-icons corazonRojo":"material-icons corazonBlanco"}
                                    onClick={() => likePost(item._id)}>favorite</i>
                                <h6>{item.likes.length} likes</h6>

                                <Card.Title><b>{item.title}</b></Card.Title>
                                <Card.Text>{item.body}</Card.Text>
                                <br />
                                {
                                    item.comments.map(record => {
                                        return (
                                            <h6 key={record._id}><span style={{ fontWeight: "500" }}>{record.postedBy.name + " "}</span>:{" " + record.text}</h6>
                                        )
                                    }

                                    )
                                }
                                <Form onSubmit={(e) => {
                                    e.preventDefault();

                                    //Para comentar hay que escribir algo
                                    if (e.target[0].value.length > 0) {
                                        makeComment(e.target[0].value, item._id);
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
                    )
                })
            }


        </div>
    );
};

export default Home;


