import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import axios from 'axios';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';

const HastagPosts = () => {

    const [data, setData] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    const { etiqueta } = useParams();

    //En función de si el usuario sigue o no al usuario mostrará el botón de follow o unfollow
    const [showfollow, setShowFollow] = useState(true)
    useEffect(() => {
        setShowFollow(state && !state.followingHastags.includes(etiqueta))
    }, state)

    useEffect(() => {

        const fetchData = async () => {
            const result = await axios.get(`http://localhost:5000/getrecetashastag/${etiqueta}`, {
                headers: {
                    //le quitamos las comillas al token
                    'Authorization': "Bearer " + localStorage.getItem("jwt").slice(1, -1)
                },
            })

            setData(result.data.posts);

        }

        fetchData();


    }, [etiqueta])


    const followHastag = async () => {
        const result = await axios.put(`http://localhost:5000/followhastag`, { etiqueta }, {
            headers: {
                //le quitamos las comillas al token
                'Authorization': "Bearer " + localStorage.getItem("jwt").slice(1, -1)
            },
        });

        dispatch({ type: "UPDATEFOLLOWINGHASTAGS", payload: { followingHastags: result.data.result.followingHastags } });
        localStorage.setItem("User", JSON.stringify());
        setShowFollow(false);

    }


    const unfollowHastag = async () => {
        const result = await axios.put(`http://localhost:5000/unfollowhastag`, { etiqueta }, {
            headers: {
                //le quitamos las comillas al token
                'Authorization': "Bearer " + localStorage.getItem("jwt").slice(1, -1)
            }
        });


        dispatch({ type: "UPDATEFOLLOWINGHASTAGS", payload: { followingHastags: result.data.result.followingHastags } });
        localStorage.setItem("User", JSON.stringify());
        setShowFollow(true);
    }


    return (
        <div className="home">
            <Helmet>
                <title>Recetas: {etiqueta}</title>
            </Helmet>

            <h1 className="titulo">{etiqueta}</h1>
            {showfollow ?

                <Button style={{ margin: "10px" }}
                    variant="primary"
                    onClick={() => followHastag()}>
                    Seguir
                </Button>
                :
                <Button style={{ margin: "10px" }}
                    variant="primary"
                    onClick={() => unfollowHastag()}>
                    Unfollow
                </Button>
            }
            <br /><br />
            {
                data.map(item => {
                    return (
                        <Card style={{ width: '80%' }} key={item._id} className="mx-auto">
                            <h5><Link to={item.postedBy._id != state._id ? `/profile/${item.postedBy._id}` : '/profile'}>{item.postedBy.name}</Link></h5>
                            <Card.Img variant="top" src={item.photo} alt={"postedBy:" + item.postedBy.name + item.title} />
                            <Card.Body>

                                <Card.Title> <Link to={`/onerecipe/${item._id}`}><b>{item.title}</b></Link></Card.Title>
                                <br />

                            </Card.Body>
                        </Card>
                    )
                })
            }


        </div>
    );
};

export default HastagPosts;


