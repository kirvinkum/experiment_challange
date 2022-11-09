import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import useDashboardFilter from "../../hooks/DashboardFilter";
import React, {useEffect, useState} from "react";
import {axiosPrivate} from "../../api/Axios";
import {useNavigate} from "react-router-dom";


const Scatter = () => {

    const navigate = useNavigate();
    const {dashboardFilter, setDashboardFilter} = useDashboardFilter();
    const [showPlot, setShowPlot] = useState(true);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {

        const getChartData = async () => {
            try {
                const response = await axiosPrivate.get('/api/experiment/data/scatter', {
                    params: {
                        experiment_id:dashboardFilter.experiment.id,
                        label_id:dashboardFilter.label_id,
                        compound_start_id:dashboardFilter.compound_start,
                        compound_end_id:dashboardFilter.compound_end
                    }
                });


                setDashboardFilter(prev => {
                    return { ...prev, compoundData: response.data}
                });

                let dataTemp = [];
                response.data.forEach(exp => {
                    let cid = 'CMP '+exp.compound.id;
                    if(dataTemp[cid] === undefined){
                        dataTemp[cid] = [];
                        dataTemp[cid].push({x:exp.concentration, y:exp.inhibition});
                    } else{
                        dataTemp[cid].push({x:exp.concentration, y:exp.inhibition});
                    }
                });

                let finalData = [];
                for (let i in dataTemp) {
                    finalData.push({
                        "id":i,
                        "data": dataTemp[i]
                    })
                }

                setChartData(finalData);
                setShowPlot(true)
            } catch (err) {
                setShowPlot(false)
                console.error(err);
                navigate('/login', { replace: true });
            }
        }


        if(dashboardFilter?.experiment !== undefined &&
            dashboardFilter?.label_id !== undefined &&
            dashboardFilter?.compound_start !== undefined &&
            dashboardFilter?.compound_end !== undefined
        ){
            getChartData();
        } else{
            setShowPlot(false)
        }

    }, [dashboardFilter.experiment,
        dashboardFilter.label_id,
        dashboardFilter.compound_start,
        dashboardFilter.compound_end])


    let chart;
    if(showPlot) {
        chart = <ResponsiveScatterPlot
            data={chartData}
            margin={{top: 60, right: 140, bottom: 70, left: 90}}
            xScale={{type: 'linear', min: 0, max: 'auto'}}
            xFormat=">-0.20f"
            yScale={{type: 'linear', min: 0, max: 'auto'}}
            yFormat=">-0.20f"
            blendMode="multiply"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Compound concentration (M)',
                legendPosition: 'middle',
                legendOffset: 46
            }}
            axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '% Inhibition',
                legendPosition: 'middle',
                legendOffset: -60
            }}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 130,
                    translateY: 0,
                    itemWidth: 100,
                    itemHeight: 12,
                    itemsSpacing: 5,
                    itemDirection: 'left-to-right',
                    symbolSize: 12,
                    symbolShape: 'circle',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
        />;
    } else{
        chart = <><p className="no-chart">Select correct filter to display chart</p></>
    }

    return (
        <div className="chart">
            {chart}
        </div>
    );
};

export default Scatter;