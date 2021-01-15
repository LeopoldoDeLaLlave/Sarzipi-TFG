import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';
import axios from 'axios';
import M from 'materialize-css';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'

const NavBar = () => {

    const searchModal = useRef(null);
    const searchTab = useRef(null);
    const [searchUser, setSearchUser] = useState('');
    const [searchHastag, setSearchHastag] = useState('');
    const [claseNavbar, setclaseNavbar] = useState('');
    const [userDetails, setUserDetails] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    const history = useHistory();


    useEffect(() => {
        M.Modal.init(searchModal.current);
        M.Tabs.init(searchTab.current);
    }, []);

    const renderList = () => {
        //Si hay algún valor (user) en el state se muestran los links de perfil y crear post
        if (state) {
            return [

                <Nav.Link ><i data-target="modal1" className="large material-icons modal-trigger" style={{ color: "black" }}>search</i></Nav.Link>,
                <Nav.Link ><Link to="/">Explora</Link></Nav.Link>,
                <Nav.Link ><Link to="/create">Subir recetas</Link></Nav.Link>,
                <NavDropdown title="Perfil" id="collasible-nav-dropdown">
                    <NavDropdown.Item><Link to="/profile">Perfil</Link></NavDropdown.Item>
                    <NavDropdown.Item >
                        <p
                            onClick={() => {
                                localStorage.clear();
                                dispatch({ type: "CLEAR" });
                                history.push("/signin");
                            }}>
                            Logout
                        </p>
                    </NavDropdown.Item>
                </NavDropdown>
            ];
            //Si no hay ningún valor (user) en el state se muestran los links de login y registro
        } else {
            return [
                <Nav.Link ><Link to="/signin">Signin</Link></Nav.Link>,
                <Nav.Link ><Link to="/signup">Signup</Link></Nav.Link>
            ]
        }
    }

    const fetchUSers = async (query) => {
        setSearchUser(query);
        const results = await axios.post('http://localhost:5000/search-users', { query });
        setUserDetails(results.data.user);

    }

    //Cambia la clase del navbar para que al desplegarse el navegador cuando
    //la pantalla es pequeña se vea geis

    const cambiaClase = () => {
        if (claseNavbar == "") {
            setclaseNavbar("navbarGris")
        } else {
            setclaseNavbar("")
        }
    }
    return (



        <Navbar collapseOnSelect expand="lg" id="miNabvar" fixed="top">
            <Navbar.Brand ><Link to={state ? "/myfollowingpost" : "/signin"} >Sarzipi</Link></Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={() => cambiaClase()} />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className={`ml-auto  ${claseNavbar} `} id="opcionesMenu" >
                    {renderList()}
                </Nav>

            </Navbar.Collapse>





            <div id="modal1" className="modal" ref={searchModal} style={{ color: "black" }}>
                <div className="modal-content">
                    <div class="row">
                        <div class="col s12">
                            <ul class="tabs" ref={searchTab}>
                                <li class="tab col s3"><a href="#test1">Buscar usuarios</a></li>
                                <li class="tab col s3"><a href="#test2">Buscar etiquetas</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="row">
                        <div id="test1" class="col s12">
                            <input type="text"
                                placeholder="Search user"
                                value={searchUser}
                                onChange={(e) => fetchUSers(e.target.value)}
                                required />
                            <ul className="collection">
                                {userDetails.map(item => {

                                    return <Link to={item._id !== state._id ? "/profile/" + item._id : '/profile'} onClick={() => {
                                        M.Modal.getInstance(searchModal.current).close()
                                        setSearchUser('')
                                        setSearchHastag('')
                                    }}><li key={item._id} className="collection-item">{item.email}</li></Link>
                                })}
                            </ul>
                        </div>
                        <div id="test2" class="col s12">
                            <input type="text"
                                placeholder="Buscar etiqueta"
                                value={searchHastag}
                                onChange={(e) => setSearchHastag(e.target.value)} />

                            <Link to={"/recetas/" + searchHastag.toLowerCase()}
                                onClick={() => {
                                    M.Modal.getInstance(searchModal.current).close()
                                    setSearchUser('')
                                    setSearchHastag('')
                                }}>
                                Buscar
                            </Link>
                        </div>
                    </div>

                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearchUser('')}>close</button>
                </div>
            </div>
        </Navbar>


    );
};

export default NavBar;
