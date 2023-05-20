import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import {db} from "../../firebase"
import { collection, addDoc } from "firebase/firestore";
import { TextField } from "@mui/material";





const New = ({ title }) => {

  const [nombre, setNombre] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [stock, setStock] = useState("");

  const handleAdd = async(e)=>{
    
    
    e.preventDefault()
    const docRef = await addDoc(collection(db, "products"), {
      nombre: nombre,
      precio_compra: precioCompra,
      precio_venta: precioVenta,
      stock: stock
      
    });
    

    
  }


  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <TextField
              label="Nombre"
              color="primary"
              focused
              onChange={(e) => setNombre(e.target.value)}
              margin="dense"
            />
          </div>
          <div className="right">
            <form onSubmit={handleAdd}>
              <div className="formInput">
                <TextField
                
                  color="primary"
                  focused
                  label="Precio Compra"
                  margin="dense"
                  onChange={(e) => setPrecioCompra(e.target.value)}
                />
                <TextField
                  color="primary"
                  focused
                  margin="dense"
                  label="Precio Venta"
                  onChange={(e) => setPrecioVenta(e.target.value)}
                />
              </div>

              <TextField
              margin="dense"
                color="primary"
                focused
                label="Stock"
                onChange={(e) => setStock(e.target.value)}
              />

              <button type="submit">Actualizar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
