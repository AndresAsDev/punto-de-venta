import { addDoc, collection } from "firebase/firestore";
import { TextField, Snackbar } from "@mui/material";
import { db } from "../../firebase";
import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import React, { useState } from "react";
import { Product } from "../../Resources/producto";

const New = ({ title }: { title: string }) => {
  const [nombre, setNombre] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [stock, setStock] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formError, setFormError] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que todos los campos estén completos
    if (!nombre || !precioCompra || !precioVenta || !stock) {
      setFormError(true);
      return;
    }

    // Validar los tipos de datos
    const parsedPrecioCompra = parseFloat(precioCompra);
    const parsedPrecioVenta = parseFloat(precioVenta);
    const parsedStock = parseInt(stock);

    if (
      isNaN(parsedPrecioCompra) ||
      isNaN(parsedPrecioVenta) ||
      isNaN(parsedStock)
    ) {
      setFormError(true);
      return;
    }

    // Validar que el precio de venta sea mayor que el de compra
    if (parsedPrecioVenta <= parsedPrecioCompra) {
      setOpenSnackbar(true);
      return;
    }

    const product: Product = {
      nombre,
      precio_compra: parsedPrecioCompra,
      precio_venta: parsedPrecioVenta,
      stock: parsedStock,
    };

    try {
      const docRef = await addDoc(collection(db, "products"), product);
      console.log("Producto guardado con éxito:", docRef.id);

      // Restablecer los campos del formulario
      setNombre("");
      setPrecioCompra("");
      setPrecioVenta("");
      setStock("");
    } catch (error) {
      console.log("Error al guardar el producto:", error);
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

              <button type="submit">Agregar Producto</button>
            </form>
          </div>
        </div>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message="El precio de venta debe ser mayor que el de compra"
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

export default New;
