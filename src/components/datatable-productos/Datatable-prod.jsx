import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { productsColumns, productsRows } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import {db} from "../../firebase"
import { doc, deleteDoc } from "firebase/firestore";



const Datatable = () => {
  const [data, setData] = useState([]);

  useEffect(()=>{
    const fetchData = async()=>{
        let list = []
        try{
            const querySnapshot = await getDocs(collection(db, "products"));
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              list.push({id: doc.id, ...doc.data()})
              console.log(doc.id, " => ", doc.data());
            });
            setData(list)

            console.log(list)
        }catch(error){
            console.log(error)
        }
       
    }
    fetchData()
  },[])

  console.log(data)

  const handleDelete = async(id) => {
    try{
        await deleteDoc(doc(db, "products", id));
        setData(data.filter((item) => item.id !== id));
    }catch(error){
        console.log(error)
    }
 
    
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to="/products/edit" style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
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
    </div>
  );
};

export default Datatable;
