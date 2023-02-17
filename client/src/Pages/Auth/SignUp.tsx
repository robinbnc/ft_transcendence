import { useState } from 'react';
import {
	Box,
	TextField,
	Button,
} from '@mui/material';
import Container from '@mui/material/Container';
import './Login.css'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import useAlert from "../../Hooks/useAlert"

const signUpHook = (email: string, password: string, login: string) => {
	
	console.log(`email: ${email}, password: ${password}, login: ${login}`)
	return (
		axios.post("http://localhost:3000/auth/signup", {
			data: {
				email: email,
				password: password,
				login: login,
			}
		})
	);
}

function SignUp() {
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [login, setLogin] = useState("");
	const navigate = useNavigate();
	const { setAlert } = useAlert();

	const handleSignUpClick = () => {
		signUpHook(email, password, login)
			.then(() => navigate("/login"))
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
					<h1>Sign Up</h1>
					<br />
					<TextField id="email-textField" label="email*" variant="outlined" onChange={(event) => setEmail(event.target.value)} />
					<br />
					<TextField id="password-textField" label="password*" variant="outlined" onChange={(event) => setPassword(event.target.value)} />
					<br />
					<TextField id="login-textField" label="login*" variant="outlined" onChange={(event) => setLogin(event.target.value)} />
					<br />
					<Button variant="contained" onClick={() => handleSignUpClick()}>Create Account</Button>
				</Box>
			</Container>
		</div>
	)

	return content
}

export default SignUp;