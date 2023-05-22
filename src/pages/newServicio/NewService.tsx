import { addDoc, collection } from "firebase/firestore";
import { TextField, Snackbar } from "@mui/material";
import { db } from "../../firebase";
import "./newService.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import React, { useState } from "react";
import { Service } from "../../Resources/servicio";

const NewService = ({ title }: { title: string }) => {
  const [nombre, setNombre] = useState("");
  const [costo, setCosto] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formError, setFormError] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que todos los campos estén completos
    if (!nombre || !costo || !precioVenta) {
      setFormError(true);
      return;
    }

    // Validar los tipos de datos
    const parsedCosto = parseFloat(costo);
    const parsedPrecioVenta = parseFloat(precioVenta);
    

    if (
      isNaN(parsedCosto) ||
      isNaN(parsedPrecioVenta) 
    ) {
      setFormError(true);
      return;
    }

    // Validar que el precio de venta sea mayor que el de compra
    if (parsedPrecioVenta <= parsedCosto) {
      setOpenSnackbar(true);
      return;
    }

    const service: Service = {
      nombre,
      costo: parsedCosto,
      precio_venta: parsedPrecioVenta,
    };

    try {
      const docRef = await addDoc(collection(db, "services"), service);
      console.log("Servicio guardado con éxito:", docRef.id);

      // Restablecer los campos del formulario
      setNombre("");
      setCosto("");
      setPrecioVenta("");
    } catch (error) {
      console.log("Error al guardar el servicio:", error);
    }

    setFormError(false);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

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
                  label="Costo"
                  margin="dense"
                  onChange={(e) => setCosto(e.target.value)}
                />
                <TextField
                  color="primary"
                  focused
                  margin="dense"
                  label="Precio Venta"
                  onChange={(e) => setPrecioVenta(e.target.value)}
                />
              </div>

              <button type="submit">Agregar Servicio</button>
            </form>
          </div>
        </div>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message="El precio de venta debe ser mayor al costo del servicio"
      />
      {formError && (
        <Snackbar
          open={formError}
          autoHideDuration={4000}
          onClose={() => setFormError(false)}
          message="Por favor, completa todos los campos"
        />
      )}
    </div>
  );
};

export default NewService;
