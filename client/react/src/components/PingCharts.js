import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useRef } from 'react';

const PingCharts = () => {
    const windowSize = useRef([window.innerWidth * 0.6, window.innerHeight * 0.35]);
    const [speeds, setSpeeds] = useState([]);

    const getSpeeds = () => {
        fetch("https://apispeeds.portkeylabs.net/api/speeds/read")
            .then((res) => res.json())
            .then((data) => {
                setSpeeds(data);
                console.log(data);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    };

    const formatTick = (tick) => {
        return `${tick}ms`;
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{ backgroundColor: 'rgb(68, 72, 81)', padding: '10px', border: '1px solid #ccc', color: "rgb(226, 228, 235)" }}>
                    <p className="label">{`${label}`}</p>
                    <p>{`Ping: ${payload[0].value}ms`}</p>
                </div>
            );
        }

        return null;
    };


    useEffect(() => {
        getSpeeds();
    }, []);

    // Function to transform data for the ping chart
    const transformData = (data) => {
        return data.ping.slice(-15).map((pingValue, index) => {
            const time = data.timestamp[index] ? data.timestamp[index].split(' ')[1] : `Test ${index + 1}`;
            return {
                time, // Using time as the x-axis label
                Ping: parseFloat(pingValue)
            };
        });
    };

    return (
        <div className="PingCharts">
            <div className="container">
                <h1 className="content-header">Ping Time Charts</h1>
                {speeds.map((speed, index) => (
                    <div className="chart-container" key={index}>
                        <h2 className="chart-title">{speed.name || speed.Ip}</h2>
                        <LineChart
                            className="chart"
                            width={windowSize.current[0]}
                            height={windowSize.current[1]}
                            data={transformData(speed)}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" stroke="rgb(226, 228, 235)" />
                            <YAxis stroke="rgb(226, 228, 235)" tickFormatter={formatTick} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="Ping" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PingCharts;
