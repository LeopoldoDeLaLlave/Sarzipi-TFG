import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const UserProfile = () => {



    const [userProfile, setUserProfile] = useState(null);
    const { state, dispatch } = useContext(UserContext);
    const { userid } = useParams();


    const [showfollow, setShowFollow] = useState(true)
    useEffect(() => {
        setShowFollow(state && !state.following.includes(userid))
    }, state)


    useEffect(() => {


        const fetch = async () => {
            const result = await axios.get(`http://localhost:5000/user/${userid}`, {
                headers: {
                    //le quitamos las comillas al token
                    'Authorization': "Bearer " + localStorage.getItem("jwt").slice(1, -1)
                },
            })
            setUserProfile(result.data);
        }

        fetch();
    }, [])

    const followUser = async () => {
        const result = await axios.put(`http://localhost:5000/follow`, { followId: userid }, {
            headers: {
                //le quitamos las comillas al token
                'Authorization': "Bearer " + localStorage.getItem("jwt").slice(1, -1)
            },
        });


        dispatch({ type: "UPDATE", payload: { following: result.data.result.following, followers: result.data.result.followers } });
        localStorage.setItem("User", JSON.stringify());

        setUserProfile((prevState) => {
            return {
                ...prevState,
                user: {
                    ...prevState.user,
                    followers: [...prevState.user.followers, result.data.result._id]
                }
            }
        });

        setShowFollow(false);
    }


    const unfollowUser = async () => {
        const result = await axios.put(`http://localhost:5000/unfollow`, { unfollowId: userid }, {
            headers: {
                //le quitamos las comillas al token
                'Authorization': "Bearer " + localStorage.getItem("jwt").slice(1, -1)
            }
        });


        dispatch({ type: "UPDATE", payload: { following: result.data.result.following, followers: result.data.result.followers } });
        localStorage.setItem("User", JSON.stringify());

        setUserProfile((prevState) => {

            const newFollowers = prevState.user.followers.filter(item => item != result.data.result._id);

            return {
                ...prevState,
                user: {
                    ...prevState.user,
                    followers: newFollowers
                }
            }
        });
        setShowFollow(true);
    }
    return (
        <>
            {userProfile ?
                <div style={{ maxWidth: "550px", margin: "0px auto" }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-around",
                        margin: "18px 0px",
                        borderBottom: "1px solid grey"
                    }}>
                        <Helmet>
                            <title>{userProfile.user.name}</title>
                        </Helmet>
                        <div>
                            <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                                src={userProfile.user.pic} />

                        </div>
                        <div>
                            <h4>{userProfile.user.name}</h4>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "108%"
                            }}>
                                <h6>{userProfile.posts.length} posts</h6>
                                <h6>{userProfile.user.followers.length} followers</h6>
                                <h6>{userProfile.user.following.length} following</h6>
                            </div>
                            {showfollow ?
                                <button style={{ margin: "10px" }}
                                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                    onClick={() => followUser()}>
                                    Follow
                                    </button>
                                :
                                <button style={{ margin: "10px" }}
                                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                    onClick={() => unfollowUser()}>
                                    Unfollow
                                    </button>
                            }
                        </div>
                    </div>

                    <div className="gallery">
                        {
                            userProfile.posts.map(item => {
                                return (
                                    <img className="item" src={item.photo} alt={item.title + item.body} />
                                )
                            })
                        }

                    </div>
                </div>
                : <h2>loading...</h2>
            }
        </>
    );
};

export default UserProfile;
