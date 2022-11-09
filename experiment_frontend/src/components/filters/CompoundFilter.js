import React, { useState, useEffect } from "react";
import useDashboardFilter from "../../hooks/DashboardFilter";
import {axiosPrivate} from "../../api/Axios";

const CompoundFilter = () => {

    const {dashboardFilter, setDashboardFilter} = useDashboardFilter();
    const [startIds, setStartIds] = useState([]);
    const [endIds, setEndIds] = useState([]);

    const updateStart = (ind) => {
        let startVal = startIds[ind];
        setDashboardFilter(prev => {
            return { ...prev, compound_start: startVal}
        });
        createEndValues(ind);
    };

    const updateEnd = (ind) => {
        let endVal = endIds[ind];
        setDashboardFilter(prev => {
            return { ...prev, compound_end: endVal}
        });
    };

    const createEndValues = (startIndex) => {
        let start = parseInt(startIndex) + 1;
        let end = parseInt(startIndex) + 20;
        let endValues = startIds.slice(start, end);
        setEndIds(endValues);
    }

    useEffect(() => {

        const getCompoundIDs = async () => {


            try {
                const response = await axiosPrivate.get('/api/compound/list',  {
                    params: {
                        id: dashboardFilter.experiment.id
                    }
                });
                setStartIds(response.data);
                setEndIds(response.data);

                if(response.data.length > 0){
                    setDashboardFilter(prev => {
                        return { ...prev, compound_start: response.data[0]}
                    });
                    setDashboardFilter(prev => {
                        return { ...prev, compound_end: response.data[0]}
                    });
                }

            } catch (err) {
                console.error(err);
            }
        }

        if(dashboardFilter?.experiment?.id !== undefined){
            getCompoundIDs();
        }
    }, [dashboardFilter.experiment])


    return (
        <div>
            <h4>Compounds</h4>
            <select className="select-input" onChange={e => updateStart(e.target.value)}>
                {startIds && startIds?.map( (cid, i) =>
                    <option key={cid} value={i}>{cid}</option>
                )};
            </select>

            <select className="select-input" onChange={e => updateEnd(e.target.value)}>
                {endIds && endIds?.map( (cid, i) =>
                    <option key={cid} value={i}>{cid}</option>
                )};
            </select>
        </div>
    );
};

export default CompoundFilter;