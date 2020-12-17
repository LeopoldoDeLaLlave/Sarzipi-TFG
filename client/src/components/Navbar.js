import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';
import axios from 'axios';
import M from 'materialize-css';

const NavBar = () => {

    const searchModal = useRef(null);
    const [search, setSearch] = useState('');
    const [userDetails, setUserDetails] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    const history = useHistory();


    useEffect(() => {
        M.Modal.init(searchModal.current);
    }, []);

    const renderList = () => {
        //Si hay algún valor (user) en el state se muestran los links de perfil y crrar post
        if (state) {
            return [

                <li key="1" className="nav-item"><i data-target="modal1" className="large material-icons modal-trigger" style={{ color: "black" }}>search</i></li>,
                <li key="2" className="nav-item"><Link to="/">Explora</Link></li>,
                <li key="3" className="nav-item"><Link to="/create">Subir recetas</Link></li>,
                <li key="4" className="nav-item dropdown">
                    <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Perfil</Link>

                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">

                        <Link className="dropdown-item" to="/profile">Perfil</Link>
                        <a className="dropdown-item"
                            onClick={() => {
                                localStorage.clear();
                                dispatch({ type: "CLEAR" });
                                history.push("/signin");
                            }}>
                            Logout
                    </a>
                    </div>
                </li>
            ];
            //Si no hay ningún valor (user) en el state se muestran los links de login y registro
        } else {
            return [
                <li key="6" className="nav-item"><Link to="/signin">Login</Link></li>,
                <li key="7" className="nav-item"><Link to="/signup">Signup</Link></li>
            ]
        }
    }

    const fetchUSers = async (query) => {
        setSearch(query);
        const results = await axios.post('http://localhost:5000/search-users', { query });
        console.log(results);
        setUserDetails(results.data.user);

    }
    return (

        <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light">
            <div className="hola">
                
            </div>
            <Link to={state ? "/myfollowingpost" : "/signin"} className="navbar-brand">Sarzipi</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse d-flex justify-content-end perro" id="navbarNavDropdown" >
                <ul className="navbar-nav ">

                    {renderList()}

                </ul>
            </div>
            <div id="modal1" className="modal" ref={searchModal} style={{ color: "black" }}>
                <div className="modal-content">
                    <input type="text"
                        placeholder="Search user"
                        value={search}
                        onChange={(e) => fetchUSers(e.target.value)}
                        required />
                    <ul className="collection">
                        {userDetails.map(item => {
                            return <Link to={item._id !== state._id ? "/profile/" + item._id : '/profile'} onClick={() => {
                                M.Modal.getInstance(searchModal.current).close()
                                setSearch('')
                            }}><li key={item._id} className="collection-item">{item.email}</li></Link>
                        })}
                    </ul>
                </div>

                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch('')}>close</button>
                </div>
            </div>
        </nav>

    );
};

export default NavBar;
