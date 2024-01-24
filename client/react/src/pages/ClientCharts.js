import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

const ClientCharts = () => {
    const [searchParams] = useSearchParams();
    const id = (searchParams.get('id'));
    const windowSize = useRef([window.innerWidth * 0.6, window.innerHeight * 0.35]);

    const [speedsData, setSpeedsData] = useState([]);

    const url = `https://api.speeds.everettdeleon.com/api/speeds/read/${id}`

    const getSpeeds = () => {
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setSpeedsData([data]);
                console.log(data);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    };

    useEffect(() => {
        getSpeeds();
    }, []);

    const mbTick = (tick) => {
        return `${tick}Mbps`;
    };

    const msTick = (tick) => {
        return `${tick}ms`;
    };

    const PingToolTip = ({ active, payload, label }) => {
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

    const SpeedsToolTip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{ backgroundColor: 'rgb(68, 72, 81)', padding: '10px', border: '1px solid #ccc', color: "rgb(226, 228, 235)" }}>
                    <p className="label">{`${label}`}</p>
                    <p>{`Download: ${payload[0].value} Mbps`}</p>
                    <p>{`Upload: ${payload[1].value} Mbps`}</p>
                </div>
            );
        }
        return null;
    };

    const transformSpeedData = (speed) => {
        return speed.download.slice(-15).map((downloadValue, index) => {
            const time = speed.timestamp[index] ? speed.timestamp[index].split(' ')[1] : `Test ${index + 1}`;
            return {
                name: time, 
                Download: parseFloat(downloadValue),
                Upload: parseFloat(speed.upload[index])
            };
        });
    };

    const transformpingData = (data) => {
        return data.ping.slice(-15).map((pingValue, index) => {
            const time = data.timestamp[index] ? data.timestamp[index].split(' ')[1] : `Test ${index + 1}`;
            return {
                time, 
                Ping: parseFloat(pingValue)
            };
        });
    };

    return (
        <div className="ClientCharts">
            <div className="container">
            <div className="speedContainer">
                {speedsData.map((speed, index) => (
                    <div className="chart-container" key={index}>
                        <h1 className="chart-title" >{speed.name || speed.Ip}</h1>
                        <h2></h2>
                        <a href={`/speeds?id=${speed._id}`}>
                        <LineChart
                            className="chart"
                            width={windowSize.current[0]}
                            height={windowSize.current[1]}
                            data={transformSpeedData(speed)}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" stroke="rgb(226, 228, 235)" />
                            <YAxis stroke="rgb(226, 228, 235)" tickFormatter={mbTick} />
                            <Tooltip content={<SpeedsToolTip />}  // Customizes the background and text color of the tooltip container
                            />
                            <Legend ></Legend>
                            <Line type="monotone" dataKey="Download" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="Upload" stroke="#82ca9d" />
                        </LineChart></a>
                    </div>
                ))}
                </div>
                <div className="pingContainer">
                {speedsData.map((speed, index) => (
                    <div className="chart-container" key={index}>
                        <a href={`/pings?id=${speed._id}`}>
                        <LineChart
                            className="chart"
                            width={windowSize.current[0]}
                            height={windowSize.current[1]}
                            data={transformpingData(speed)}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" stroke="rgb(226, 228, 235)" />
                            <YAxis stroke="rgb(226, 228, 235)" tickFormatter={msTick} />
                            <Tooltip content={<PingToolTip />} />
                            <Legend />
                            <Line type="monotone" dataKey="Ping" stroke="#FA4D8A" activeDot={{ r: 8 }} />
                        </LineChart>
                        </a>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
};

export default ClientCharts;
