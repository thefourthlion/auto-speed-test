import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useRef } from 'react';

const ExternalPingData = () => {
    const windowSize = useRef([window.innerWidth * 0.6, window.innerHeight * 0.35]);

    const [pingdata, setpingdata] = useState([]);

    const formatTick = (tick) => {
        return `${tick} ms`;
    };

    const getSpeeds = () => {
        fetch("http://127.0.0.1:3025/api/externalpingdata/read")
            .then((res) => res.json())
            .then((data) => {
                setpingdata(data);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    };

    useEffect(() => {
        getSpeeds();
    }, []);


    const transformData = (maxDataPoints) => {
        const data = [];

        // Assuming all sites have the same timestamps (you may need to adjust this logic)
        if (pingdata.length > 0 && pingdata[0].timestamp) {
            const totalTimestamps = pingdata[0].timestamp.length;
            const startIndex = Math.max(totalTimestamps - maxDataPoints, 0);

            for (let i = startIndex; i < totalTimestamps; i++) {
                const timestamp = pingdata[0].timestamp[i];
                const pingData = {};

                pingdata.forEach((speed, index) => {
                    pingData[`${speed.link}`] = parseFloat(speed.ping[i]);
                });

                // Extract the time part from the timestamp (assuming timestamp format is 'MM-DD-YYYY HH:MM')
                const time = timestamp.split(' ')[1];
                data.push({
                    name: time,
                    ...pingData,
                });
            }
        }

        return data;
    };





    const customTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{ backgroundColor: 'rgb(68, 72, 81)', padding: '10px', border: '1px solid #ccc', color: "rgb(226, 228, 235)" }}>
                    <p className="label">{`${label}`}</p>
                    {payload.map((entry, index) => (
                        <p key={index}>{`${entry.name}: ${entry.value} ms`}</p>
                    ))}
                </div>
            );
        }

        return null;
    };

    const lineColors = [
        "#8884d8",
        "#82ca9d",
        "#FA4D8A",
        "#D98E32"
    ];

    const twelveHours = 12;

    return (
        <div className="ExternalPingData">
            <div className="container">
                <h1 className="content-header">External Pings</h1>
                <div className="chart-container">
                    <a href={`/AllExternalPingData`}>
                        <LineChart
                            className="chart"
                            width={windowSize.current[0]}
                            height={windowSize.current[1]}
                            data={transformData(twelveHours)}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" stroke="rgb(226, 228, 235)" />
                            <YAxis stroke="rgb(226, 228, 235)" tickFormatter={formatTick} />
                            <Tooltip content={customTooltip} />
                            <Legend />
                            {pingdata.map((speed, index) => (
                                <Line
                                    type="monotone"
                                    dataKey={`${speed.link}`}
                                    key={index}
                                    stroke={lineColors[index % lineColors.length]} activeDot={{ r: 8 }}
                                />
                            ))}
                        </LineChart>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ExternalPingData;
