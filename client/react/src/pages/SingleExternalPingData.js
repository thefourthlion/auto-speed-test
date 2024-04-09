import React, { useEffect, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart,
    Area,
} from 'recharts'; import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

const ExternalPingData = () => {
    const windowSize = useRef([window.innerWidth * 0.6, window.innerHeight * 0.35]);

    const [pingData, setPingData] = useState([]);
    const [searchParams] = useSearchParams();
    const id = (searchParams.get('id'));

    const getSpeeds = () => {
        fetch(`http://localhost:4001/api/externalpingdata/read/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setPingData([data]);
                console.log(data);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
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

    const transformExternalPingDataAfterDay = (data, maxDataPoints) => {
        const startIndex = Math.max(data.timestamp.length - maxDataPoints, 0);

        return data.timestamp.slice(startIndex).map((timestamp, index) => {
            const time = timestamp.split(' ')[0];
            return {
                time,
                Ping: parseFloat(data.ping[startIndex + index])
            };
        });
    };


    const twelveHours = 12;
    const oneDay = 24;
    const oneWeek = 168;
    const oneMonth = 672;
    const sixMonth = 4032;
    const oneYear = 8760;

    return (
        <div className="ExternalPingData page">
            <div className="container">
                <h1 className="content-header">Speed Test Charts</h1>
                {pingData.map((speed, index) => (
                    <div className="chart-container" key={index}>
                        <h2 className="chart-title">{speed.link}</h2>
                        <LineChart
                            className="chart"
                            width={windowSize.current[0]}
                            height={windowSize.current[1]}
                            data={transformExternalPingData(speed, twelveHours)}
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
                        <p>12 Hour</p>

                        {speed.ping.length > twelveHours && <div>
                            <LineChart
                                className="chart"
                                width={windowSize.current[0]}
                                height={windowSize.current[1]}
                                data={transformExternalPingData(speed, oneDay)}
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
                            <p>1 Day</p>
                        </div>}


                        {speed.ping.length > oneDay && <div>
                            <AreaChart
                                width={windowSize.current[0]}
                                height={windowSize.current[1]}
                                data={transformExternalPingDataAfterDay(speed, oneWeek)}
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
                                <Area type="monotone" dataKey="Ping" stroke="#FA4D8A" fill="#FA4D8A" />
                            </AreaChart>
                            <p>1 Week</p>
                        </div>}


                        {speed.ping.length > oneWeek && <div>
                            <AreaChart
                                width={windowSize.current[0]}
                                height={windowSize.current[1]}
                                data={transformExternalPingDataAfterDay(speed, oneMonth)}
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
                                <Area type="monotone" dataKey="Ping" stroke="#FA4D8A" fill="#FA4D8A" />
                            </AreaChart>
                            <p>1 Month</p>
                        </div>}


                        {speed.ping.length > oneMonth && <div>
                            <AreaChart
                                width={windowSize.current[0]}
                                height={windowSize.current[1]}
                                data={transformExternalPingDataAfterDay(speed, sixMonth)}
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
                                <Area type="monotone" dataKey="Ping" stroke="#FA4D8A" fill="#FA4D8A" />
                            </AreaChart>
                            <p>6 Month</p>
                        </div>}


                        {speed.ping.length > sixMonth && <div>
                            <AreaChart
                                width={windowSize.current[0]}
                                height={windowSize.current[1]}
                                data={transformExternalPingDataAfterDay(speed, oneYear)}
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
                                <Area type="monotone" dataKey="Ping" stroke="#FA4D8A" fill="#FA4D8A" />
                            </AreaChart>
                            <p>1 Year</p>
                        </div>}

                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExternalPingData;
