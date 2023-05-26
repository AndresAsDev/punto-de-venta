import "./newService.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { TextField, Snackbar } from "@mui/material";
import { useParams } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { stringify } from "querystring";

interface Service {
  nombre: string;
  costo: number;
  precio_venta: number;
}

const UpdateService = () => {
  const [open, setOpen] = useState(false); // Estado para controlar la apertura y cierre del modal

  const { id } = useParams(); // Obtén el ID del producto de los parámetros de la URL

  const [nombre, setNombre] = useState("");
  const [costo, setCosto] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [formError, setFormError] = useState(false); // Estado para controlar los errores del formulario

  useEffect(() => {
    const fetchService = async () => {
      try {
        if (id) {
          const serviceDoc = await getDoc(doc(db, "services", id)); // Obtén el documento del producto de Firestore
          if (serviceDoc.exists()) {
            const serviceData = serviceDoc.data() as Service;
            // Actualiza los estados con los datos del producto
            setNombre(serviceData.nombre);
            setCosto(serviceData.costo.toString());
            setPrecioVenta(serviceData.precio_venta.toString());
          } else {
            console.log("No se encontró el producto");
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchService();
  }, [id]);
  const validateForm = () => {
    // Validar que todos los campos estén completos
    if (!nombre || !costo || !precioVenta) {
      setFormError(true);
      return false;
    }

    // Validar que los campos numéricos sean valores válidos
    if (
    
      isNaN(parseFloat(costo)) ||
      isNaN(parseFloat(precioVenta)) 
      
    ) {
      setFormError(true);
      return false;
    }

    // Validar que el precio de venta sea mayor que el costo
    if (parseFloat(precioVenta) <= parseFloat(costo)) {
      setFormError(true);
      return false;
    }

    // Validar que el nombre sea un string
    // Validar que el nombre no contenga números
    if (/\d/.test(nombre)) {
        setFormError(true);
        return false;
      }

    return true;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      if (id) {
        await updateDoc(doc(db, "services", id), {
          nombre: nombre,
          costo: parseFloat(costo),
          precio_venta: parseFloat(precioVenta),
         
        });
        console.log("Servicio actualizado con éxito");

        setOpen(true);
      } else {
        console.log("El ID del servicio no está definido");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    // Cerrar el modal
    setOpen(false);
  };

  const handleSnackbarClose = () => {
    setFormError(false);
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Editar Servicio</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <TextField
              label="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              margin="dense"
            />
          </div>
          <div className="right">
            <form onSubmit={handleUpdate}>
              <div className="formInput">
                <TextField
                  label="Costo"
                  value={costo}
                  onChange={(e) => setCosto(e.target.value)}
                  margin="dense"
                />
                <TextField
                  label="Precio Venta"
                  value={precioVenta}
                  onChange={(e) => setPrecioVenta(e.target.value)}
                  margin="dense"
                />
              </div>
              <button type="submit">Actualizar Servicio</button>
            </form>
          </div>
        </div>
      </div>
      {/* Modal de éxito */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Servicio actualizado</DialogTitle>
        <DialogContent>
          <p>El Servicio se ha actualizado correctamente.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={formError}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message="Por favor, completa todos los campos correctamente"
      />
    </div>
  );
};

export default UpdateService;
