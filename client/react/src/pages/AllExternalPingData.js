import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useRef } from 'react';

const AllExternalPingData = () => {
    const windowSize = useRef([window.innerWidth * 0.6, window.innerHeight * 0.35]);

    const [speeds, setSpeeds] = useState([]);

    const formatTick = (tick) => {
        return `${tick}Mbps`;
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
            const pingValue = payload[0].value; // Assuming the ping data is in the first payload

            return (
                <div className="custom-tooltip" style={{ backgroundColor: 'rgb(68, 72, 81)', padding: '10px', border: '1px solid #ccc', color: "rgb(226, 228, 235)" }}>
                    <p className="label">{`${label}`}</p>
                    <p>{`Ping Time: ${pingValue} ms`}</p>
                </div>
            );
        }

        return null;
    };


    useEffect(() => {
        getSpeeds();
    }, []);


    function transformData(speed) {
        const data = [];
        if (speed && speed.ping && speed.timestamp) {
            for (let i = 0; i < speed.ping.length; i++) {
                data.push({
                    name: speed.timestamp[i],
                    Ping: parseFloat(speed.ping[i]),
                });
            }
        }
        return data;
    }

    return (
        <div className="AllExternalPingData page">
            <div className="container">
                <h1 className="content-header">Speed Test Charts</h1>
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
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke="rgb(226, 228, 235)" />
                                <YAxis stroke="rgb(226, 228, 235)" tickFormatter={formatTick} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line type="monotone" dataKey="Ping" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart></a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllExternalPingData;
