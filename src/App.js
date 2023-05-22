import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Product from "./pages/products/Product";
import Service from "./pages/servicios/Service";
import Single from "./pages/single/Single";
import New from "./pages/new/New";

import NewProduct from "./pages/newProduct/NewProduct.tsx";
import UpdateProduct from "./pages/updateProduct/UpdateProduct.tsx";
//servicios
import NewService from "./pages/newServicio/NewService.tsx";
import UpdateService from "./pages/updateServicio/UpdateServicio.tsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  const { currentUser } = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  console.log(currentUser);

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
                    <New inputs={userInputs} title="Add New User" />
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
                path="/products/edit/:id"
                element={
                  <RequireAuth>
                    <UpdateProduct title={"Editar Producto"} />
                  </RequireAuth>
                }
              />
              <Route
                path="newProduct"
                element={
                  <RequireAuth>
                    <NewProduct
                      inputs={productInputs}
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
                path="/services/edit/:id"
                element={
                  <RequireAuth>
                    <UpdateService title={"Editar Servicio"} />
                  </RequireAuth>
                }
              />
              <Route
                path="newService"
                element={
                  <RequireAuth>
                    <NewService
                      inputs={productInputs}
                      title="Agregar Nuevo Servicio"
                    />
                  </RequireAuth>
                }
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
