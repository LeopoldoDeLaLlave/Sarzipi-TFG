import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import materialize from 'materialize-css';
import { useHistory, useParams } from 'react-router-dom'
import { UserContext } from '../../App';
import { Helmet } from 'react-helmet';

const Profile = () => {



    const { state, dispatch } = useContext(UserContext);
    const { userid } = useParams();

    const history = useHistory();


    useEffect(() => {


        const fetch = async () => {
            const result = await axios.put(`http://localhost:5000/confirmaccount/${userid}`);
            console.log(result.data)

            if (result.data.error) {
                materialize.toast({ html: "No se pudo confirmar el usuario", classes: "#b71c1c red darken-4" });
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
                <title>Confirmar</title>
            </Helmet>

            <h1>Cargando...</h1>

        </div>

    );
};

export default Profile;