import React, { useState, useEffect } from "react";
import useDashboardFilter from "../../hooks/DashboardFilter";
import {axiosPrivate} from "../../api/Axios";

const LabelFilter = () => {

    const {setDashboardFilter} = useDashboardFilter();
    const [labels, setLabels] = useState();

    const updateLabel = (id) => {
        setDashboardFilter(prev => {
            return { ...prev, label_id: id}
        });
    };


    useEffect(() => {
        const getLabels = async () => {
            try {
                const response = await axiosPrivate.get('/api/label/list');
                setLabels(response.data)

                if(response.data.length > 0){
                    setDashboardFilter(prev => {
                        return { ...prev, label_id: response.data[0].id}
                    });
                }

            } catch (err) {
                console.error(err);
            }
        }

        getLabels();
        // eslint-disable-next-line
    }, [])


    return (
        <div>
            <h4>Assay Result Label</h4>
            <select className="select-input" onChange={e => updateLabel(e.target.value)}>
                {labels && labels?.map(label =>
                    <option key={label.id} value={label.id}>{label.label}</option>
                )};
            </select>
        </div>
    );
};

export default LabelFilter;