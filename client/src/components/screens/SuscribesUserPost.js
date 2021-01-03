import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import axios from 'axios';
import { Card} from 'react-bootstrap';
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

    
    return (
        <div className="home">
            <Helmet>
                <title>{TITLE}</title>
            </Helmet>
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

export default Home;


