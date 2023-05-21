import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { productsColumns, productsRows } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const Datatable = () => {
  const [data, setData] = useState([]);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          list.push({ id: doc.id, ...doc.data() });
          console.log(doc.id, " => ", doc.data());
        });
        setData(list);

        console.log(list);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteConfirmationOpen = (productId) => {
    setSelectedProductId(productId);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmationClose = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      setData(data.filter((item) => item.id !== id));
      setDeleteConfirmationOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        const productId = params.row.id; // Obtén el ID del producto de la fila actual

        return (
          <div className="cellAction">
            <Link
              to={`/products/edit/${productId}`} // Enlace dinámico hacia la página de edición del producto
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">Editar</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDeleteConfirmationOpen(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        Agregar Nuevos Produtos
        <Link to="/products/newProduct" className="link">
          Nuevo
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={productsColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleDeleteConfirmationClose}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <p>¿Estás seguro de que deseas eliminar este producto?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmationClose}>Cancelar</Button>
          <Button onClick={() => handleDelete(selectedProductId)} color="error">
            Eliminar
          </Button>
        </DialogActions>
        f
      </Dialog>
    </div>
  );
};

export default Datatable;
