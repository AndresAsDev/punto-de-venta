import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  TextField,
  Snackbar,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { db } from "../../firebase";
import "./newVenta.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import React, { useState, useEffect } from "react";
import { getDocs, runTransaction } from "firebase/firestore";

const NewSale = ({ title }) => {
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [cantidadProducto, setCantidadProducto] = useState(0);
  const [servicios, setServicios] = useState([]);
  const [selectedServicio, setSelectedServicio] = useState(null);
  const [cantidadServicio, setCantidadServicio] = useState(0);
  const [total, setTotal] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [ventaItems, setVentaItems] = useState([]);

  useEffect(() => {
    // Cargar productos desde Firebase
    const loadProductos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductos(productosData);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    // Cargar servicios desde Firebase
    const loadServicios = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "services"));
        const serviciosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setServicios(serviciosData);
      } catch (error) {
        console.error("Error al cargar servicios:", error);
      }
    };

    loadProductos();
    loadServicios();
  }, []);

  useEffect(() => {
    // Calcular el subtotal de productos
    const subtotalProductos = ventaItems.reduce((subtotal, item) => {
      if (item.producto) {
        return subtotal + item.subtotalProducto;
      }
      return subtotal;
    }, 0);

    // Calcular el subtotal de servicios
    const subtotalServicios = ventaItems.reduce((subtotal, item) => {
      if (item.servicio) {
        return subtotal + item.subtotalServicio;
      }
      return subtotal;
    }, 0);

    // Calcular el total
    const total = subtotalProductos + subtotalServicios;
    setTotal(total);
  }, [ventaItems]);

  const handleAgregarProducto = async () => {
    if (selectedProducto && cantidadProducto > 0) {
      if (cantidadProducto <= selectedProducto.stock) {
        try {
          const newItem = {
            producto: selectedProducto,
            cantidadProducto,
            subtotalProducto: selectedProducto.precio_venta * cantidadProducto,
            servicio: null,
            cantidadServicio: 0,
            subtotalServicio: 0,
          };
  
          // Actualizar el stock del producto en una transacción
          const productRef = doc(db, "products", selectedProducto.id);
          await runTransaction(db, async (transaction) => {
            const productSnapshot = await transaction.get(productRef);
            const updatedStock = productSnapshot.data().stock - cantidadProducto;
            if (updatedStock >= 0) {
              transaction.update(productRef, { stock: updatedStock });
            } else {
              throw new Error("No hay suficiente stock disponible.");
            }
          });
  
          setVentaItems((prevItems) => [...prevItems, newItem]);
  
          setSelectedProducto(null);
          setCantidadProducto(0);
        } catch (error) {
          console.error("Error al actualizar el stock del producto:", error);
        }
      } else {
        setOpenSnackbar(true);
      }
    } else {
      setOpenSnackbar(true);
    }
  };
  

  const handleAgregarServicio = () => {
    if (selectedServicio) {
      const newItem = {
        producto: null,
        cantidadProducto: 0,
        subtotalProducto: 0,
        servicio: selectedServicio,
        cantidadServicio,
        subtotalServicio:
          selectedServicio.precio_venta * cantidadServicio,
      };

      setVentaItems((prevItems) => [...prevItems, newItem]);

      setSelectedServicio(null);
      setCantidadServicio(0);
    } else {
      setOpenSnackbar(true);
    }
  };

  const handleEliminarItem = async (index) => {
    const deletedItem = ventaItems[index];
    const updatedItems = ventaItems.filter((item, i) => i !== index);
    setVentaItems(updatedItems);
  
    setTotal((prevTotal) => prevTotal - deletedItem.subtotalProducto - deletedItem.subtotalServicio);
  
    // Restaurar el stock del producto eliminado
    if (deletedItem.producto) {
      try {
        const productId = deletedItem.producto.id;
        const quantity = deletedItem.cantidadProducto;
        const productRef = doc(db, "products", productId);
        await runTransaction(db, async (transaction) => {
          const productSnapshot = await transaction.get(productRef);
          const updatedStock = productSnapshot.data().stock + quantity;
          transaction.update(productRef, { stock: updatedStock });
        });
      } catch (error) {
        console.error("Error al restaurar el stock del producto:", error);
      }
    }
  };
  
  

  const handleVenta = async () => {
    if (ventaItems.length === 0) {
      setOpenSnackbar(true);
      return;
    }

    const ventaData = {
      items: ventaItems,
      total,
      fecha: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, "ventas"), ventaData);
      console.log("Venta guardada con éxito:", docRef.id);

      // Restablecer los campos del formulario
      setVentaItems([]);
      setTotal(0);
      setSuccessMessage("Venta guardada con éxito");
    } catch (error) {
      console.log("Error al guardar la venta:", error);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar title={title} />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <h2>Productos</h2>
            <select
              value={selectedProducto ? selectedProducto.id : ""}
              onChange={(e) => {
                const selectedProductId = e.target.value;
                const selectedProduct = productos.find(
                  (producto) => producto.id === selectedProductId
                );
                setSelectedProducto(selectedProduct);
              }}
            >
              <option value="">Seleccione un producto</option>
              {productos.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre}
                </option>
              ))}
            </select>
            <TextField
              label="Cantidad"
              type="number"
              value={cantidadProducto}
              onChange={(e) =>
                setCantidadProducto(Number(e.target.value))
              }
              margin="dense"
            />
            <div className="actions">
              <button onClick={handleAgregarProducto}>
                Agregar Producto
              </button>
            </div>
          </div>
          <div className="right">
            <h2>Servicios</h2>
            <select
              value={selectedServicio ? selectedServicio.id : ""}
              onChange={(e) => {
                const selectedServicioId = e.target.value;
                const selectedServicio = servicios.find(
                  (servicio) => servicio.id === selectedServicioId
                );
                setSelectedServicio(selectedServicio);
              }}
            >
              <option value="">Seleccione un servicio</option>
              {servicios.map((servicio) => (
                <option key={servicio.id} value={servicio.id}>
                  {servicio.nombre}
                </option>
              ))}
            </select>
            <TextField
              label="Cantidad"
              type="number"
              value={cantidadServicio}
              onChange={(e) =>
                setCantidadServicio(Number(e.target.value))
              }
              margin="dense"
            />
            <div className="actions">
              <button onClick={handleAgregarServicio}>
                Agregar Servicio
              </button>
            </div>
          </div>
        </div>
        <div className="items">
          <h2>Items</h2>
          {ventaItems.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Subtotal</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ventaItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {item.producto
                          ? item.producto.nombre
                          : item.servicio.nombre}
                      </TableCell>
                      <TableCell>
                        {item.producto
                          ? item.cantidadProducto
                          : item.cantidadServicio}
                      </TableCell>
                      <TableCell>
                        {item.producto
                          ? item.subtotalProducto
                          : item.subtotalServicio}
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleEliminarItem(index)}
                        >
                          Eliminar
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <p>No se han agregado items</p>
          )}
        </div>
        <div className="total">
          <h2>Total: {total}</h2>
        </div>
        <div className="bottomActions">
          <button onClick={handleVenta}>Guardar Venta</button>
        </div>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={
          successMessage ||
          "Por favor, seleccione un producto o un servicio"
        }
      />
    </div>
  );
};

export default NewSale;
