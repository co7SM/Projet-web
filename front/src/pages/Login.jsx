import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import './Login.css';
const api = axios.create({baseURL: 'http://127.0.0.1:8000/api'});
function Login() {
const navigate = useNavigate();
const [email, Setemail] = useState("");
const [password, Setpassword] = useState("");
const handleLogin = async (e) => {
e.preventDefault();
try {
localStorage.clear();
const response = await api.post('/login', { email, password });
localStorage.setItem('token', response.data.token);
localStorage.setItem('isLoggedIn', 'true');
navigate("/Notes");
} catch (error) {
alert("Invalid credentials");
}
};
return (
<div className="log">
<form onSubmit={handleLogin}>
<p>Email : </p>
<input type="email" placeholder="email address" required onChange={(e) => Setemail(e.target.value)} />
<p>Password : </p>
<input type="password" placeholder="*******" required onChange={(e) => Setpassword(e.target.value)} />
<div className="buttons">
<input type="submit" value="Login" />
<input type="reset" value="Clear" />
</div>
<h4>Don't have an account yet? <Link to="/Register">Get one here</Link></h4>
</form>
</div>
);
}
export default Login;