import { useReducer } from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./components/pages/Home/Home";
import Navbar from "./components/components/Navbar/Navbar";
import { Authenticate } from "./components/pages/Auth/index.js";
import Display from "./components/pages/Display/Display";
import { ForgotPassword } from './components/pages/Auth/ForgotPassword';
import { ConfirmOTP } from './components/pages/Auth/ConfirmOTP';
import { NewPassword } from './components/pages/Auth/NewPassword';
import { AccountConfirmation } from './components/pages/Auth/AccountConfirmation';

import { userReducer, initialUserState } from './components/reducer';
import { userContext } from './components/context';

function App() {

	const [user, userDispatch] = useReducer(userReducer, initialUserState);

	return (
		<>
			<userContext.Provider value={{
				currentUser: user,
				userDispatch: userDispatch
			}}>
				<Router>
					<Navbar />
					<Switch>
						<Route path='/' exact render={() => <Home />} />
						<Route path='/user/signup' exact render={(props) => <Authenticate {...props} signup={true} />} />
						<Route path='/user/signin' exact render={() => <Authenticate />} />
						<Route path='/rent' exact render={() => <Display />} />
						<Route path='/user/confirmOTP' exact render={(props) => <ConfirmOTP {...props} />} />
						<Route path='/user/forgotPassword' exact render={() => <ForgotPassword />} />
						<Route path='/user/resetPassword' exact render={(props) => <NewPassword {...props} />} />
						<Route path='/user/accountConfirmation' exact render={(props) => <AccountConfirmation {...props} />} />
					</Switch>
				</Router>
			</userContext.Provider>
		</>
	);
}

export default App;
