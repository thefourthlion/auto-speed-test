import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';


const AllExternalPingData = () => {
    const windowSize = useRef([window.innerWidth * 0.6, window.innerHeight * 0.35]);

    const [speeds, setSpeeds] = useState([]);
    const [searchParams] = useSearchParams();
    const hostname = (searchParams.get('hostname'));

    const formatTick = (tick) => {
        return `${tick} ms`;
    };

    const getSpeeds = () => {
        fetch(`http://localhost:4001/api/externalpingdata/read/name/${hostname}`)
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


    const transformExternalPingData = (data, maxDataPoints) => {
        const startIndex = Math.max(data.timestamp.length - maxDataPoints, 0);

        return data.timestamp.slice(startIndex).map((timestamp, index) => {
            const time = timestamp.split(' ')[1];
            return {
                time,
                Ping: parseFloat(data.ping[startIndex + index])
            };
        });
    };


    const twelveHours = 12;

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
                                data={transformExternalPingData(speed, twelveHours)}
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
