import { ResponsiveLine } from "@nivo/line";
import useDashboardFilter from "../../hooks/DashboardFilter";
import React, {useEffect, useState} from "react";


const Line = () => {

    const {dashboardFilter, setDashboardFilter} = useDashboardFilter();
    const [showPlot, setShowPlot] = useState(true);
    const [chartData, setChartData] = useState([]);
    const [chartGroups, setChartGroups] = useState([]);

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
                    dataTemp[cid].push({x:'ic50', y:exp.compound.ic50});
                    dataTemp[cid].push({x:'inhibition', y:exp.inhibition});
                    dataTemp[cid].push({x:'concentration', y:exp.concentration});


                } else{
                    dataTemp[cid].push({x:'ic50', y:exp.compound.ic50});
                    dataTemp[cid].push({x:'inhibition', y:exp.inhibition});
                    dataTemp[cid].push({x:'concentration', y:exp.concentration});
                }
            });



            let finalData = [];
            for (let i in dataTemp) {
                finalData.push({
                    "id":i,
                    "color": "hsl(219, 70%, 50%)",
                    "data": dataTemp[i]
                })
            }


            // let finalData = [];
            // for (let i in dataTemp) {
            //     finalData.push({
            //         "id":i,
            //         "data": dataTemp[i]
            //     })
            // }


            setChartData(finalData);

            setShowPlot(true);
        } else{
            setShowPlot(false)
        }

    }, [dashboardFilter.compoundData])



    let chart;
    if(showPlot) {
        chart =  <ResponsiveLine
        data={chartData}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
            type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: true,
                reverse: false
        }}
        yFormat=">-0.20f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'transportation',
                legendOffset: 36,
                legendPosition: 'middle'
        }}
        axisLeft={{
            orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'count',
                legendOffset: -40,
                legendPosition: 'middle'
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
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

export default Line;