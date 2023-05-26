import "./venta.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Sales from "../ventas/Sales"

const Venta = () => {
  return (
    <div className="products">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <Sales/>
      </div>
    </div>
  )
}

export default Venta