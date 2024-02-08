import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, AreaChart, ResponsiveContainer } from 'recharts';
import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const InternalSpeeds = () => {
    const [searchParams] = useSearchParams();
    const id = (searchParams.get('id'));
    const windowSize = useRef([window.innerWidth * 0.6, window.innerHeight * 0.35]);
    const [speedsData, setSpeedsData] = useState([]);
    const navigate = useNavigate();

    const speedTick = (tick) => {
        return `${tick}Mbps`;
    };

    const url = `http://127.0.0.1:3025/api/internalspeeds/read/${id}`

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

    const CustomTooltip = ({ active, payload, label }) => {
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

    useEffect(() => {
        getSpeeds();
    }, []);

    const transformSpeedData = (data, maxDataPoints) => {
        const startIndex = Math.max(data.timestamp.length - maxDataPoints, 0);

        return data.timestamp.slice(startIndex).map((timestamp, index) => {
            const time = timestamp.split(' ')[1];
            return {
                name: time,
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
        <div className="InternalSpeeds page">
            <div className="container">
                <h1 className="content-header">Speed Tests</h1>
                {speedsData.map((speed, index) => (
                    <div className="chart-container" key={index}>
                        <h2 className="chart-title" >{speed.name || speed.Ip}</h2>

                        <LineChart
                            className="chart"
                            width={windowSize.current[0]}
                            height={windowSize.current[1]}
                            data={transformSpeedData(speed, twelveHours)}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" stroke="rgb(226, 228, 235)" />
                            <YAxis stroke="rgb(226, 228, 235)" tickFormatter={speedTick} />
                            <Tooltip content={<CustomTooltip />}  // Customizes the background and text color of the tooltip container
                            />
                            <Legend />
                            <Line type="monotone" dataKey="Download" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="Upload" stroke="#82ca9d" />
                        </LineChart>
                        <p>12 Hour</p>

                        {speed.download.length > twelveHours && <div>
                            <LineChart
                                className="chart"
                                width={windowSize.current[0]}
                                height={windowSize.current[1]}
                                data={transformSpeedData(speed, oneDay)}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke="rgb(226, 228, 235)" />
                                <YAxis stroke="rgb(226, 228, 235)" tickFormatter={speedTick} />
                                <Tooltip content={<CustomTooltip />}  // Customizes the background and text color of the tooltip container
                                />
                                <Legend />
                                <Line type="monotone" dataKey="Download" stroke="#8884d8" activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="Upload" stroke="#82ca9d" />
                            </LineChart>
                            <p>1 Day</p>
                        </div>}

                        {speed.download.length > oneDay && <div>
                            <AreaChart
                                width={windowSize.current[0]}
                                height={windowSize.current[1]}
                                data={transformSpeedData(speed, oneWeek)}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke="rgb(226, 228, 235)" />
                                <YAxis stroke="rgb(226, 228, 235)" tickFormatter={speedTick} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area stackId="1" fill="#8884d8" type="monotone" dataKey="Download" stroke="#8884d8" activeDot={{ r: 8 }} />
                                <Area stackId="2" fill="#82ca9d" type="monotone" dataKey="Upload" stroke="#82ca9d" />
                            </AreaChart>
                            <p>1 Week</p>
                        </div>}



                        {speed.download.length > oneWeek && <div>
                            <AreaChart
                                width={windowSize.current[0]}
                                height={windowSize.current[1]}
                                data={transformSpeedData(speed, oneMonth)}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke="rgb(226, 228, 235)" />
                                <YAxis stroke="rgb(226, 228, 235)" tickFormatter={speedTick} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area stackId="1" fill="#8884d8" type="monotone" dataKey="Download" stroke="#8884d8" activeDot={{ r: 8 }} />
                                <Area stackId="2" fill="#82ca9d" type="monotone" dataKey="Upload" stroke="#82ca9d" />
                            </AreaChart>
                            <p>1 Month</p>
                        </div>}



                        {speed.download.length > oneMonth && <div>
                            <AreaChart
                                width={windowSize.current[0]}
                                height={windowSize.current[1]}
                                data={transformSpeedData(speed, sixMonth)}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke="rgb(226, 228, 235)" />
                                <YAxis stroke="rgb(226, 228, 235)" tickFormatter={speedTick} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area stackId="1" fill="#8884d8" type="monotone" dataKey="Download" stroke="#8884d8" activeDot={{ r: 8 }} />
                                <Area stackId="2" fill="#82ca9d" type="monotone" dataKey="Upload" stroke="#82ca9d" />
                            </AreaChart>
                            <p>6 Month</p>
                        </div>}



                        {speed.download.length > sixMonth && <div>
                            <AreaChart
                                width={windowSize.current[0]}
                                height={windowSize.current[1]}
                                data={transformSpeedData(speed, oneYear)}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke="rgb(226, 228, 235)" />
                                <YAxis stroke="rgb(226, 228, 235)" tickFormatter={speedTick} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area stackId="1" fill="#8884d8" type="monotone" dataKey="Download" stroke="#8884d8" activeDot={{ r: 8 }} />
                                <Area stackId="2" fill="#82ca9d" type="monotone" dataKey="Upload" stroke="#82ca9d" />
                            </AreaChart>
                            <p>1 Year</p>
                        </div>}



                    </div>
                ))}
            </div>
        </div>
    );
};

export default InternalSpeeds;
