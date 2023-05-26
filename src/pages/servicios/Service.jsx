import "./service.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import DatatableServices from "../../components/datatable-servicios/Datatable-servicios"

const Service = () => {
  return (
    <div className="services">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <DatatableServices/>
      </div>
    </div>
  )
}

export default Service