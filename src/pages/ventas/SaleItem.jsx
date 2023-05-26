import React from "react";
import { Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";

const SaleItem = ({ items }) => {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Nombre</TableCell>
          <TableCell>Precio de venta</TableCell>
          <TableCell>Cantidad</TableCell>
          <TableCell>Subtotal</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item, index) => {
          const { producto, servicio, cantidadProducto, cantidadServicio, subtotalProducto, subtotalServicio } = item;
          const key = `${index}_${producto ? "producto" : "servicio"}`;
          const nombre = producto ? producto.nombre : servicio.nombre;
          const precioVenta = producto ? producto.precio_venta : servicio.costo;
          const cantidad = producto ? cantidadProducto : cantidadServicio;
          const subtotal = producto ? subtotalProducto : subtotalServicio;
          return (
            <TableRow key={key}>
              <TableCell>{nombre}</TableCell>
              <TableCell>{precioVenta}</TableCell>
              <TableCell>{cantidad}</TableCell>
              <TableCell>{subtotal}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default SaleItem;
