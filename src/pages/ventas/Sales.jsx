import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import SaleItem from "./SaleItem";
import { Link } from "react-router-dom";
import "./sales.scss"


import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";

const Sales = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      const salesCollection = collection(db, "ventas");
      const salesSnapshot = await getDocs(salesCollection);
      const salesData = [];
      salesSnapshot.forEach((doc) => {
        const sale = {
          id: doc.id,
          fecha: doc.data().fecha.toDate(),
          items: doc.data().items || [],
          total: doc.data().total,
        };
        salesData.push(sale);
      });
      setSales(salesData);
    };

    fetchSales();
  }, []);

  const handleDeleteSale = async (saleId) => {
    try {
      await deleteDoc(doc(db, "ventas", saleId));
      setSales((prevSales) => prevSales.filter((sale) => sale.id !== saleId));
    } catch (error) {
      console.log("Error deleting sale", error);
    }
  };

  return (
  
    <div>
      
      <div className="datatableTitle">
        Agregar Ventas
        <Link to="/sales/newSale" className="link">
          Nuevo
        </Link>
      </div>
      {sales.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Productos</TableCell>
                <TableCell>Servicios</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.id}</TableCell>
                  <TableCell>{sale.fecha.toString()}</TableCell>
                  <TableCell>
                    <SaleItem items={sale.items.filter((item) => item.producto)} />
                  </TableCell>
                  <TableCell>
                    <SaleItem items={sale.items.filter((item) => item.servicio)} />
                  </TableCell>
                  <TableCell>{sale.total}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleDeleteSale(sale.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>No se han realizado ventas</p>
      )}
    </div>
  );
};

export default Sales;
