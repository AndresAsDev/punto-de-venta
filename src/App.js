import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";

import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Product from "./pages/products/Product";
import Service from "./pages/servicios/Service";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import NewProduct from "./pages/newProduct/NewProduct.tsx";
import UpdateProduct from "./pages/updateProduct/UpdateProduct.tsx";
import NewService from "./pages/newServicio/NewService.tsx";
import UpdateService from "./pages/updateServicio/UpdateServicio.tsx";

import NewSale from "./pages/ventas/NewSale";
import SaleItem from "./pages/ventas/SaleItem";
import Venta from "./pages/venta/Venta";

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="login" element={<Login />} />
            <Route
              index
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            <Route path="users">
              <Route
                index
                element={
                  <RequireAuth>
                    <List />
                  </RequireAuth>
                }
              />
              <Route
                path=":userId"
                element={
                  <RequireAuth>
                    <Single />
                  </RequireAuth>
                }
              />
              <Route
                path="new"
                element={
                  <RequireAuth>
                    <New  title="Add New User" />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="products">
              <Route
                index
                element={
                  <RequireAuth>
                    <Product />
                  </RequireAuth>
                }
              />
              <Route
                path="edit/:id"
                element={
                  <RequireAuth>
                    <UpdateProduct title="Editar Producto" />
                  </RequireAuth>
                }
              />
              <Route
                path="newProduct"
                element={
                  <RequireAuth>
                    <NewProduct
                      
                      title="Agregar Nuevo Producto"
                    />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="services">
              <Route
                index
                element={
                  <RequireAuth>
                    <Service />
                  </RequireAuth>
                }
              />
              <Route
                path="edit/:id"
                element={
                  <RequireAuth>
                    <UpdateService title="Editar Servicio" />
                  </RequireAuth>
                }
              />
              <Route
                path="newService"
                element={
                  <RequireAuth>
                    <NewService
                     
                      title="Agregar Nuevo Servicio"
                    />
                  </RequireAuth>
                }
              />
            </Route>
            <Route
              path="ventas"
              element={
                <RequireAuth>
                  <Venta />
                </RequireAuth>
              }
            />
            <Route
              path="newSale"
              element={
                <RequireAuth>
                  <NewSale  />
                </RequireAuth>
              }
            />
            <Route
              path="saleItem"
              element={
                <RequireAuth>
                  <SaleItem  />
                </RequireAuth>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
