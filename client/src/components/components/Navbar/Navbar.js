import React, { useState, useEffect, useContext } from 'react';
import { Button } from '../../assets/Button/Button';
import { Link, useHistory } from 'react-router-dom';
import AuthService from "../../../services/auth";
import { authHeader } from "../../../services/authHeader";
import './Navbar.css';
import styled from "styled-components";
import axios from 'axios';
import { GlobalState } from '../../context/index';
import { Dialog, DialogContent } from '@material-ui/core';
import SearchBar from '../Hero/SearchBar';
import { SubmitButton } from '../../../styles/style';

const LoginButton = styled.button`
    :root{
        ---primary:#fff;
    }

    padding: 8px 20px;
    font-size: 18px;
    
    background-color: transparent;
    color: #fff;
    padding: 8px 20px;
    border: 1px solid var(--primary);
    transition: all 0.3s ease-out;
    
    padding: 8px 20px;
    border-radius: 2px;
    outline: none;
    cursor: pointer;

    &:hover {
        transition: all 0.3s ease-out;
        background: #fff;
        color: #242424;
        transition: 250ms;
    }

`;

function Navbar() {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);
    const [navbar, setNavbar] = useState(false);

    const [visible, setVisible] = useState(false);
    const [city, setCity] = useState("");
    const [to, setToDate] = useState("");
    const [from, setFromDate] = useState("");

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
    const history = useHistory();

    const [user, dispatch] = useContext(GlobalState);

    const showButton = () => {
        if (window.innerWidth <= 960) {
            setButton(false);
        } else {
            setButton(true);
        }
    };

    useEffect(() => {
        showButton();
    }, []);


    window.addEventListener('resize', showButton);

    const changeBackground = () => {
        if (window.scrollY >= 80) {
            setNavbar(true);
        } else {
            setNavbar(false);
        }
    }

    window.addEventListener('scroll', changeBackground);

    const fetchUserProfile = () => {
        axios.get("http://localhost:8000/user/profile", { headers: authHeader() }).then((res) => {
            if (res.status === 200) {
                console.log(res);
                dispatch({
                    type: "SET_USER_DETAILS",
                    payload: {
                        email: res.data.email,
                        fullName: res.data.name,
                        phoneNumber: res.data.phone_no,
                        address: res.data.address,
                        city: res.data.city,
                        pincode: res.data.pincode,
                    }
                })
                history.push("/user/profile");
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    const handleChange = (e) => {
        setCity(e.target.value);
    }

    const setTo = (to) => {
        setToDate({ to });
    }

    const setFrom = (from) => {
        setFromDate({ from });
    }

    const showModal = () => {
        setVisible(true);
    };

    const hideModal = () => {
        setVisible(false);
    };

    const sendToServer = (event) => {
        event.preventDefault();

        const payload = {
            to: to.to,
            from: from.from,
            city: city,
            categories: [],
            brand: [],
            fuel: [],
            eng: [],
            seats: [],
            color: [],
            email: "",
        }

        if (JSON.parse(localStorage.getItem("UserEmail")))
            payload.email = JSON.parse(localStorage.getItem("UserEmail"));
            

        localStorage.setItem("location", JSON.stringify(payload));
        
        console.log(payload);
        console.log("Navbar----------------------------------");

        dispatch({
            type: "SEARCH_CAR",
            payload: {
                toDate: payload.to,
                fromDate: payload.from,
                rentCity: payload.city,
            }
        });
        
        hideModal();
        history.push("/rent");

        // axios.post("http://localhost:8000/car/filter", payload)
        //     .then((res) => {
        //         if (res.status == 200) {
        //             console.log(res)
        //             hideModal();
        //             history.push("/rent");
        //         }
        //         else {
        //             hideModal();
        //             history.push("/");
        //         }
        //     }).catch((err) => {
        //         console.log(err);
        //     });
    }

    return (
        <>
            <Dialog open={visible} aria-labelledby="form-dialog-title" fullWidth="true" maxWidth="xs" >
                <DialogContent>
                    <SearchBar
                        onChange={handleChange}
                        setTo={setTo}
                        setFrom={setFrom}
                    />
                </DialogContent>
                <div className="buttonContainer">
                    <SubmitButton
                        style={{ padding: "2%", marginRight: "5%" }}
                        onClick={(e) => sendToServer(e)}
                    >
                        Search for cars
					</SubmitButton>
                    <SubmitButton onClick={e => hideModal(e)} style={{ padding: "2%", marginLeft: "5%" }}>
                        Cancel Search
					</SubmitButton>
                </div>
            </Dialog>
            <nav className='navbar active'>
                <div className='navbar-container'>
                    <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
                        TraWell
            <i className='fab fa-typo3' />
                    </Link>
                    <div className='menu-icon' onClick={handleClick}>
                        <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                    </div>
                    <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                        <li className='nav-item'>
                            <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                                Home
                            </Link>
                        </li>
                        {
                            !(AuthService.getCurrentUser() && AuthService.getCurrentUser().accessToken)
                                ?
                                <li className='nav-item'>
                                    <Link
                                        to='/user/signin'
                                        className='nav-links'
                                        onClick={closeMobileMenu}
                                    >
                                        Lend Your Car
                                    </Link>
                                </li>
                                :
                                <li className='nav-item'>
                                    <Link
                                        to='/user/lendcar'
                                        className='nav-links'
                                        onClick={closeMobileMenu}
                                    >
                                        Lend Your Car
                                    </Link>
                                </li>
                        }
                        
                        <li className='nav-item'>
                            <Link
                                // to='/rent'
                                className='nav-links'
                                onClick={() => {
                                    closeMobileMenu();
                                    showModal();
                                }}
                            >
                                Rent a Car
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link
                                to='/aboutUs'
                                className='nav-links'
                                onClick={closeMobileMenu}
                            >
                                About Us
                            </Link>
                        </li>

                        {
                            !(AuthService.getCurrentUser() && AuthService.getCurrentUser().accessToken)
                                ?
                                <li>
                                    <Link
                                        to='/user/signin'
                                        className='nav-links-mobile'
                                        onClick={closeMobileMenu}
                                    >
                                        Log In
                                    </Link>
                                </li>
                                :
                                <div>
                                    <li
                                        className='nav-links-mobile'
                                        onClick={
                                            () => {
                                                fetchUserProfile();
                                                closeMobileMenu();
                                            }
                                        }
                                    >
                                        {/* <Link
                                            to="/"
                                            
                                        > */}
                                            My Profile
                                        {/* </Link> */}
                                    </li>
                                    <li>
                                        <Link
                                            to='/'
                                            className='nav-links-mobile'
                                            onClick={() => {
                                                AuthService.logout();
                                                closeMobileMenu();
                                            }}
                                        >
                                            Log Out
                                        </Link>
                                    </li>
                                </div>

                        }
                    </ul>
                    {
                        !(AuthService.getCurrentUser() && AuthService.getCurrentUser().accessToken)
                            ?
                            <>
                                {button && <Button buttonStyle='btn--outline' style={{ marginRight: '2.5vw' }} link="/user/signin" >LOG IN</Button>}
                            </>
                            :
                            <>
                                {
                                    button
                                    &&
                                    <>
                                        <LoginButton onClick={() => { fetchUserProfile() }} >My Profile</LoginButton>
                                        &nbsp; &nbsp;
                                        <LoginButton onClick={() => { AuthService.logout() }}>LogOut</LoginButton>
                                        {/* <Button buttonStyle='btn--outline' style={{ marginRight: '2vw' }} link="/" onClick={()=>logout}>LogOut</Button> */}
                                    </>
                                }
                            </>
                    }
                </div>
            </nav>
        </>
    );
}

export default Navbar;
