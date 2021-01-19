import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Card, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { UserContext } from '../../App';
import { Helmet } from 'react-helmet';

const Profile = () => {


    const [myPics, setMyPics] = useState([]);
    //Esta variable nos indica si se está editando la biografía del usuario
    const [editandoBio, setEditandoBio] = useState(false);
    const { state, dispatch } = useContext(UserContext);
    const [profileImage, setProfileImage] = useState("");
    const [bio, setBio] = useState("");

    useEffect(() => {


        const fetch = async () => {
            const result = await axios.get('http://localhost:5000/mypost', {
                headers: {
                    //le quitamos las comillas al token
                    'Authorization': "Bearer " + localStorage.getItem("jwt").slice(1, -1)
                },
            })
            setMyPics(result.data.myPosts);
            setBio(state.bio);
        }

        fetch();
    }, [])

    useEffect(() => {

        if (profileImage) {
            const data = new FormData();
            data.append("file", profileImage);
            data.append("upload_preset", "insta-clone");
            data.append("cloud_name", "dniykkyhc");



            axios.post('https://api.cloudinary.com/v1_1/dniykkyhc/image/upload', data).then((response) => {
                //setUrl(response.data.url);
                axios.put('http://localhost:5000/updatepic', { pic: response.data.url }, {
                    headers: {
                        //le quitamos las comillas al token
                        'Authorization': "Bearer " + localStorage.getItem("jwt").slice(1, -1)
                    }
                }).then((res) => {
                    localStorage.setItem("user", JSON.stringify({ ...state, pic: res.data.pic }));
                    dispatch({ type: "UPDATEPIC", payload: res.data.pic });
                    window.location.reload();
                })
            }, (error) => {
                console.log(error);
            });
        }
    }, [profileImage]);

    //Actualiza la foto de perfil
    const updatePhoto = (file) => {
        setProfileImage(file);

    }

    //Actualiza la biografía
    const updateBio = (e) => {
        
        axios.put('http://localhost:5000/updatebio', { bio}, {
            headers: {
                //le quitamos las comillas al token
                'Authorization': "Bearer " + localStorage.getItem("jwt").slice(1, -1)
            }
        }).then((res) => {
            localStorage.setItem("user", JSON.stringify({ ...state, bio: res.data.bio }));
            dispatch({ type: "UPDATEBIO", payload: res.data.bio });
            window.location.reload();
        })
        setEditandoBio(false);
    }


    return (
        <div style={{ maxWidth: "80%", margin: "0px auto" }}>
            <Helmet>
                <title>{state ? `Sarzipi: ${state.name}` : "Sarzipi"}</title>
            </Helmet>

            <div style={{
                margin: "18px 0px",
                borderBottom: "1px solid grey"
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-around"
                }}>
                    
                    <div>
                        <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                            src={state ? state.pic : "loading..."} />
                    </div>

                    <div>
                        <h4>{state ? state.name : "Loading..."}</h4>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "30%"
                        }}>
                            <h6>{myPics.length} posts</h6>
                            <h6>{state ? state.followers.length : "0"} followers</h6>
                            <h6>{state ? state.following.length : "0"} following</h6>
                        </div>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%"
                        }}>
                            {editandoBio ?
                                <Form onSubmit={(e) => updateBio(e)}>

                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                        <Form.Control as="textarea" rows={3}
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)} />
                                    </Form.Group>

                                    <Button variant="primary" type="submit">
                                        Actualizar
                                </Button>

                                </Form>
                                :
                                <p>{state.bio}</p>
                            }
                        </div>
                        <div style={{

                        }}>
                            <button onClick={() => {
                                setEditandoBio(!editandoBio)
                                setBio(state.bio);}}>
                                    editar bio</button>
                        </div>
                    </div>


                </div>
                <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Update pic</span>
                        <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
            </div>

            {
                myPics.map(item => {
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
            <br /><br /><br />
        </div>

    );
};

export default Profile;
