import React, { useEffect, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart,
    Area,
} from 'recharts';
import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const InternalPings = () => {
    const windowSize = useRef([window.innerWidth * 0.6, window.innerHeight * 0.35]);
    const [speedsData, setSpeedsData] = useState([]);
    const [searchParams] = useSearchParams();
    const id = (searchParams.get('id'));
    const navigate = useNavigate();

    const url = `http://192.168.0.66:4001/api/internalspeeds/read/${id}`

    const getSpeeds = () => {
        if (id == null) {
            navigate("/");
        }
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

    const transformPingData = (data, maxDataPoints) => {
        const startIndex = Math.max(data.timestamp.length - maxDataPoints, 0);
        return data.timestamp.slice(startIndex).map((timestamp, index) => {
            const time = timestamp.split(' ')[1];
            return {
                time,
                Ping: parseFloat(data.ping[startIndex + index]),
                Download: parseFloat(data.download[startIndex + index]),
                Upload: parseFloat(data.upload[startIndex + index])
            };
        });
    };

    const transformPingDataAfterDay = (data, maxDataPoints) => {
        const startIndex = Math.max(data.timestamp.length - maxDataPoints, 0);
        return data.timestamp.slice(startIndex).map((timestamp, index) => {
            const time = timestamp.split(' ')[0];
            return {
                time,
                Ping: parseFloat(data.ping[startIndex + index]),
                Download: parseFloat(data.download[startIndex + index]),
                Upload: parseFloat(data.upload[startIndex + index])
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
        <div className="InternalPings page">
            <div className="container">
                <h1 className="content-header">Ping Time</h1>
                {speedsData.map((speed, index) => (
                    <div className="chart-container" key={index}>
                        <h2 className="chart-title">{speed.name || speed.Ip}</h2>

                        <LineChart
                            className="chart"
                            width={windowSize.current[0]}
                            height={windowSize.current[1]}
                            data={transformPingData(speed, twelveHours)}
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

                        {speed.download.length > twelveHours && <div>
                            <LineChart
                                className="chart"
                                width={windowSize.current[0]}
                                height={windowSize.current[1]}
                                data={transformPingData(speed, oneDay)}
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



                        {speed.download.length > oneDay && <div>
                            <AreaChart
                                width={windowSize.current[0]}
                                height={windowSize.current[1]}
                                data={transformPingDataAfterDay(speed, oneWeek)}
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


                        {speed.download.length > oneWeek && <div>
                            <AreaChart
                                width={windowSize.current[0]}
                                height={windowSize.current[1]}
                                data={transformPingDataAfterDay(speed, oneMonth)}
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


                        {speed.download.length > oneMonth && <div>
                            <AreaChart
                                width={windowSize.current[0]}
                                height={windowSize.current[1]}
                                data={transformPingDataAfterDay(speed, sixMonth)}
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


                        {speed.download.length > sixMonth && <div>
                            <AreaChart
                                width={windowSize.current[0]}
                                height={windowSize.current[1]}
                                data={transformPingDataAfterDay(speed, oneYear)}
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

export default InternalPings;