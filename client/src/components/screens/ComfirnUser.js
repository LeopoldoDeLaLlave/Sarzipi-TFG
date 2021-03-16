import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom'
import { UserContext } from '../../App';
import { Helmet } from 'react-helmet';

const Profile = () => {



    const { state, dispatch } = useContext(UserContext);
    const { userid } = useParams();

    const history = useHistory();

    //En caso de que haya error se volverá true
    const error = false;

    useEffect(() => {


        const fetch = async () => {
            console.log('saludoooos')
            const result = await axios.put(`http://localhost:5000/confirmaccount/${userid}`);
            console.log(result)
            if (result.error) {
                error = true;
            } else {
                localStorage.clear();
                dispatch({ type: "CLEAR" });
                history.push('/signin');
            }

        }

        fetch();

    }, [])




    return (
        <div style={{ maxWidth: "80%", margin: "0px auto" }}>
            <Helmet>
                <title>{"Confirmar"}</title>
            </Helmet>

            <h1>{error ? "Hubo un error en la confimación" : "Cargando..."}</h1>

        </div>

    );
};

export default Profile;