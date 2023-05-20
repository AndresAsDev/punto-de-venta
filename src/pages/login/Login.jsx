import { useContext, useState } from "react"
import "./login.scss"
import {signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../../firebase"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { TextField,Button } from "@mui/material";
const Login = () => {

  const [error, setError] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  

  const navigate = useNavigate()

  const {dispatch} = useContext(AuthContext)

  const handlogin = (e) =>{
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    dispatch({type:"LOGIN", payload:user})
    navigate("/")
    console.log(user)
    // ...
  })
  .catch((error) => {
    setError(true)
  });

  }
  return (
    <div className="login">
      <form onSubmit={handlogin}> 
      <TextField id="outlined-basic" label="Correo" variant="outlined" size="small" margin="dense" onChange={e=>setEmail(e.target.value)} />
      <TextField id="outlined-basic" label="Contraseña" variant="outlined" size="small" type="password" margin="dense" onChange={e=>setPassword(e.target.value)} />
        
      <Button variant="contained" type="submit" size="small">Ingresar</Button>

        

        {error && <span>Error en el correo o contraseña</span>}
      </form>
    </div>
  )
}

export default Login