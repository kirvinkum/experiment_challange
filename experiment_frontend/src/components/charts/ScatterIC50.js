import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import useDashboardFilter from "../../hooks/DashboardFilter";
import React, {useEffect, useState} from "react";
import {axiosPrivate} from "../../api/Axios";


const ScatterIC50 = () => {

    const {dashboardFilter, setDashboardFilter} = useDashboardFilter();
    const [showPlot, setShowPlot] = useState(true);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {


        if(dashboardFilter?.experiment !== undefined &&
            dashboardFilter?.label_id !== undefined &&
            dashboardFilter?.compound_start !== undefined &&
            dashboardFilter?.compound_end !== undefined
        ){

            let dataTemp = [];
            dashboardFilter.compoundData.forEach(exp => {
                let cid = 'CMP '+exp.compound.id;
                if(dataTemp[cid] === undefined){
                    dataTemp[cid] = [];
                    dataTemp[cid].push({x:exp.compound.ic50, y:exp.inhibition});
                } else{
                    dataTemp[cid].push({x:exp.compound.ic50, y:exp.inhibition});
                }
            });


            let finalData = [];
            for (let i in dataTemp) {
                finalData.push({
                    "id":i,
                    "data": dataTemp[i]
                })
            }

            setChartData(finalData)
            setShowPlot(true)
        } else{
            setShowPlot(false)
        }

    }, [dashboardFilter.compoundData])


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
                legend: ' IC50 (M)',
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

export default ScatterIC50;