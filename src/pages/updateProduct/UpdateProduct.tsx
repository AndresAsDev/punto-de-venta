import "./new.scss";
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

interface Product {
  nombre: string;
  precio_compra: number;
  precio_venta: number;
  stock: number;
}

const UpdateProduct = () => {
  const [open, setOpen] = useState(false); // Estado para controlar la apertura y cierre del modal

  const { id } = useParams(); // Obtén el ID del producto de los parámetros de la URL

  const [nombre, setNombre] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [stock, setStock] = useState("");
  const [formError, setFormError] = useState(false); // Estado para controlar los errores del formulario

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const productDoc = await getDoc(doc(db, "products", id)); // Obtén el documento del producto de Firestore
          if (productDoc.exists()) {
            const productData = productDoc.data() as Product;
            // Actualiza los estados con los datos del producto
            setNombre(productData.nombre);
            setPrecioCompra(productData.precio_compra.toString());
            setPrecioVenta(productData.precio_venta.toString());
            setStock(productData.stock.toString());
          } else {
            console.log("No se encontró el producto");
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
  }, [id]);
  const validateForm = () => {
    // Validar que todos los campos estén completos
    if (!nombre || !precioCompra || !precioVenta || !stock) {
      setFormError(true);
      return false;
    }

    // Validar que los campos numéricos sean valores válidos
    if (
      isNaN(parseFloat(precioCompra)) ||
      isNaN(parseFloat(precioVenta)) ||
      isNaN(parseInt(stock))
    ) {
      setFormError(true);
      return false;
    }

    // Validar que el precio de venta sea mayor que el de compra
    if (parseFloat(precioVenta) <= parseFloat(precioCompra)) {
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
        await updateDoc(doc(db, "products", id), {
          nombre: nombre,
          precio_compra: parseFloat(precioCompra),
          precio_venta: parseFloat(precioVenta),
          stock: parseInt(stock),
        });
        console.log("Producto actualizado con éxito");

        setOpen(true);
      } else {
        console.log("El ID del producto no está definido");
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
          <h1>Editar Producto</h1>
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
                  label="Precio Compra"
                  value={precioCompra}
                  onChange={(e) => setPrecioCompra(e.target.value)}
                  margin="dense"
                />
                <TextField
                  label="Precio Venta"
                  value={precioVenta}
                  onChange={(e) => setPrecioVenta(e.target.value)}
                  margin="dense"
                />
              </div>
              <TextField
                label="Stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                margin="dense"
              />
              <button type="submit">Actualizar Producto</button>
            </form>
          </div>
        </div>
      </div>
      {/* Modal de éxito */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Producto actualizado</DialogTitle>
        <DialogContent>
          <p>El producto se ha actualizado correctamente.</p>
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

export default UpdateProduct;
