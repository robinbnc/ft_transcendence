import {useState} from 'react';
import {
	Box,
	TextField,
	Divider,
	Button,
	Alert,
	AlertTitle,
} from '@mui/material';
import Container from '@mui/material/Container';
import './Login.css'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import useAlert from "../../Hooks/useAlert"
import { useDispatch } from "react-redux"
import { setCredentials } from '../../Hooks/authSlice'

const SignInHook = (username: string, password: string) => {
	return (
		axios("http://localhost:3000/auth/login", {
			method: 'POST',
			withCredentials: true,
			data: {
				username: username,
				password: password,
			}
		})
	);
}

function Login() {
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const navigate = useNavigate();
	const { setAlert } = useAlert();
	const dispatch = useDispatch()

	const handleSignInClick = () => {
		SignInHook(username, password)
			.then((response: any) => {
				if (response.status !== 201) {
					setAlert("Failed Sign In", "error");
				}
				dispatch(setCredentials({
					user: response.data.user,
					accessToken: response.data.jwt_token
				}))
				navigate("/")
			})
			.catch(() => setAlert("Failed Sign In", "error"))
	}

	const content = (
			<div className="loginPage">
				<Container component="main" maxWidth="xs">
					<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						backgroundColor: '#f5f3f2',
						padding: '40px',
						borderRadius: '30px',
					}}
					>
					<h1>TRANSCENDENCE</h1>
						<br/>
						<Button disabled variant="contained" href='http://localhost:3000/auth/42' style={{marginTop: '20px'}}>
							42 Login
						</Button>
						<br/>
						<Divider sx={{width: "10vw"}}/>
						<br/>
						<Alert severity="info">
							<AlertTitle>Please use this credentials:</AlertTitle>
							<p>- login: <strong>test0</strong>		password: <strong>test0</strong></p>
							<p>- login: <strong>test1</strong>		password: <strong>test1</strong></p>
							<p>- login: <strong>test2</strong>		password: <strong>test2</strong></p>
						</Alert>
						<br/>
						<TextField id="username-textField" label="username" variant="outlined" onChange={(event) => setUsername(event.target.value)} />
						<br/>
						<TextField id="password-textField" label="password" variant="outlined" onChange={(event) => setPassword(event.target.value)}/>
						<Button variant="contained" onClick={() => handleSignInClick()} style={{marginTop: '20px'}}>
							Sign In
						</Button>
						<br/>
					</Box>
				</Container>
			</div>
		)

  return content
}

export default Login;