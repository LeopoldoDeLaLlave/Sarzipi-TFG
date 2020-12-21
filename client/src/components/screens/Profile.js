import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../App';

const Profile = () => {


    const [myPics, setMyPics] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    const [profileImage, setProfileImage] = useState("");

    useEffect(() => {


        const fetch = async () => {
            const result = await axios.get('http://localhost:5000/mypost', {
                headers: {
                    //le quitamos las comillas al token
                    'Authorization': "Bearer " + localStorage.getItem("jwt").slice(1, -1)
                },
            })
            setMyPics(result.data.myPosts);
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

    const updatePhoto = (file) => {
        setProfileImage(file);

    }

    return (
        <div style={{ maxWidth: "80%", margin: "0px auto" }}>


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
                            width: "108%"
                        }}>
                            <h6>{myPics.length} posts</h6>
                            <h6>{state ? state.followers.length : "0"} followers</h6>
                            <h6>{state ? state.following.length : "0"} following</h6>
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

            <div className="gallery">
                {
                    myPics.map(item => {
                        return (

                            <img className="item" src={item.photo} alt={item.title + item.body} />
                        )
                    })
                }

            </div>
            <br /><br /><br />
        </div>

    );
};

export default Profile;
