import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import './Signup.css';
const api = axios.create({baseURL: 'http://127.0.0.1:8000/api'});
function Signup() {
const navigate = useNavigate();
const [username, Setusername] = useState("");
const [email, Setemail] = useState("");
const [password, Setpassword] = useState("");
const Add_user = async (e) => {
e.preventDefault();
try {
localStorage.clear();
const response = await api.post('/register', {username, email, password});
localStorage.setItem('token', response.data.token);
localStorage.setItem('isLoggedIn', 'true');
navigate("/Notes");
} catch (error) {
alert(error.response?.data?.message || "Registration failed");
}
};
return (
<div className="sign">
<form onSubmit={Add_user}>
<p>Username:</p>
<input type="text" required onChange={(e) => Setusername(e.target.value)} />
<p>Email : </p>
<input type="email" required onChange={(e) => Setemail(e.target.value)} />
<p>Password : </p>
<input type="password" required onChange={(e) => Setpassword(e.target.value)} />
<div className='buttons'>
<input type="submit" value="Register" />
<input type="reset" value="Clear" />
</div>
<h4>Already got an account? <Link to="/Login">Login through here</Link></h4>
</form>
</div>
);
}
export default Signup;