import React from 'react';
import Logout from "./account/Logout";
import ExperimentList from "./ExperimentList";
import Scatter from "./charts/Scatter";
import ScatterIC50 from "./charts/ScatterIC50";
import useDashboardFilter from "../hooks/DashboardFilter";
import LabelFilter from "./filters/LabelFilter";
import Line from "./charts/Line";
import CompoundFilter from "./filters/CompoundFilter";

const Dashboard = () => {

    const {dashboardFilter} = useDashboardFilter();

    let filters = <p>No experiment added yet!</p>;
    if(dashboardFilter?.experiment !== undefined){
        filters =  <div className="row well">
          <div className="col-md-6">
              <CompoundFilter/>
          </div>
          <div className="col-md-6">
              <LabelFilter/>
          </div>
        </div>;
    }


    return (
        <div className="container-fluid dashboard">

            <div className="row">
                <div className="col-lg-3">
                    <ExperimentList/>
                </div>
                <div className="col-lg-9">

                    <div className="row">
                        <div className="col-md-2">
                            <h2>Dashboard</h2>
                        </div>
                        <div className="col-md-10">
                            <div className="right">
                                <Logout/>
                            </div>
                        </div>
                    </div>

                    <h3> Selected experiment: {dashboardFilter.experiment?.name}</h3>
                    {filters}

                    <div className="row">
                        <div className="col-md-6">
                            <Scatter/>
                        </div>
                        <div className="col-md-6">
                            <ScatterIC50/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <Line/>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;