import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useRef } from 'react';

const AllExternalPingData = () => {
    const windowSize = useRef([window.innerWidth * 0.6, window.innerHeight * 0.35]);

    const [speeds, setSpeeds] = useState([]);

    const formatTick = (tick) => {
        return `${tick} ms`;
    };



    const getSpeeds = () => {
        fetch("http://localhost:3025/api/externalpingdata/read")
            .then((res) => res.json())
            .then((data) => {
                setSpeeds(data);
                console.log(data);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    };

    const CustomTooltip = ({ active, payload, label }) => {
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

    useEffect(() => {
        getSpeeds();
    }, []);


    const transformData = (data) => {
        return data.ping.slice(-12).map((pingValue, index) => {
            const time = data.timestamp[index] ? data.timestamp[index].split(' ')[1] : `Test ${index + 1}`;
            return {
                time,
                Ping: parseFloat(pingValue)
            };
        });
    };

    return (
        <div className="AllExternalPingData page">
            <div className="container">
                <h1 className="content-header">external ping Charts</h1>
                {speeds.map((speed, index) => (
                    <div className="chart-container" key={index}>

                        <h2 className="chart-title">{speed.link}</h2>
                        <a href={`/singleexternalpingdata?id=${speed._id}`}>
                            <LineChart
                                className="chart"
                                width={windowSize.current[0]}
                                height={windowSize.current[1]}
                                data={transformData(speed)}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 30,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" stroke="rgb(226, 228, 235)" />
                                <YAxis stroke="rgb(226, 228, 235)" tickFormatter={formatTick} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line type="monotone" dataKey="Ping" stroke="#FA4D8A" activeDot={{ r: 8 }} />
                            </LineChart>


                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllExternalPingData;
