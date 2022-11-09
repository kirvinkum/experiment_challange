import {useContext} from "react";
import DashboardFilterContext from "../context/DashboardFilterProvider";



const useDashboardFilter = () => {
    return useContext(DashboardFilterContext)
}

export default useDashboardFilter;