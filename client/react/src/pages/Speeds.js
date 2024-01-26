import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, AreaChart, ResponsiveContainer } from 'recharts';
import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const Speeds = () => {
    const [searchParams] = useSearchParams();
    const id = (searchParams.get('id'));
    const windowSize = useRef([window.innerWidth * 0.6, window.innerHeight * 0.35]);
    const [speedsData, setSpeedsData] = useState([]);
    const navigate = useNavigate();

    const speedTick = (tick) => {
        return `${tick}Mbps`;
    };

    const url = `https://api.speeds.everettdeleon.com/api/speeds/read/${id}`

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

    const TwelveHourData = (speed) => {
        return speed.download.slice(-12).map((downloadValue, index) => {
            const time = speed.timestamp[index] ? speed.timestamp[index].split(' ')[1] : `Test ${index + 1}`;
            return {
                name: time,
                Download: parseFloat(downloadValue),
                Upload: parseFloat(speed.upload[index])
            };
        });
    };

    const OneDayData = (speed) => {
        return speed.download.slice(-24).map((downloadValue, index) => {
            const time = speed.timestamp[index] ? speed.timestamp[index].split(' ')[1] : `Test ${index + 1}`;
            return {
                name: time,
                Download: parseFloat(downloadValue),
                Upload: parseFloat(speed.upload[index])
            };
        });
    };

    const WeekData = (speed) => {
        return speed.download.slice(-168).map((downloadValue, index) => {
            const time = speed.timestamp[index] ? speed.timestamp[index].split(' ')[1] : `Test ${index + 1}`;
            return {
                name: time,
                Download: parseFloat(downloadValue),
                Upload: parseFloat(speed.upload[index])
            };
        });
    };

    const MonthData = (speed) => {
        return speed.download.slice(-672).map((downloadValue, index) => {
            const time = speed.timestamp[index] ? speed.timestamp[index].split(' ')[1] : `Test ${index + 1}`;
            return {
                name: time,
                Download: parseFloat(downloadValue),
                Upload: parseFloat(speed.upload[index])
            };
        });
    };

    const SixMonthData = (speed) => {
        return speed.download.slice(-4032).map((downloadValue, index) => {
            const time = speed.timestamp[index] ? speed.timestamp[index].split(' ')[1] : `Test ${index + 1}`;
            return {
                name: time,
                Download: parseFloat(downloadValue),
                Upload: parseFloat(speed.upload[index])
            };
        });
    };

    const YearData = (speed) => {
        return speed.download.slice(-8760).map((downloadValue, index) => {
            const time = speed.timestamp[index] ? speed.timestamp[index].split(' ')[1] : `Test ${index + 1}`;
            return {
                name: time,
                Download: parseFloat(downloadValue),
                Upload: parseFloat(speed.upload[index])
            };
        });
    };


    return (
        <div className="Speeds page">
            <div className="container">
                <h1 className="content-header">Speed Tests</h1>
                {speedsData.map((speed, index) => (
                    <div className="chart-container" key={index}>
                        <h2 className="chart-title" >{speed.name || speed.Ip}</h2>

                        {/* <ResponsiveContainer width="100%" height="100%"> */}
                            <AreaChart
                                width={windowSize.current[0]}
                                height={windowSize.current[1]}
                                data={WeekData(speed)}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke="rgb(226, 228, 235)" />
                                <YAxis stroke="rgb(226, 228, 235)" />
                                <Tooltip content={<CustomTooltip />} />
                                <Area stackId="1" fill="#8884d8" type="monotone" dataKey="Download" stroke="#8884d8" activeDot={{ r: 8 }} />
                                <Area stackId="2" fill="#82ca9d" type="monotone" dataKey="Upload" stroke="#82ca9d" />
                            </AreaChart>
                        {/* </ResponsiveContainer> */}

                        <LineChart
                            className="chart"
                            width={windowSize.current[0]}
                            height={windowSize.current[1]}
                            data={TwelveHourData(speed)}
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

                        <LineChart
                            className="chart"
                            width={windowSize.current[0]}
                            height={windowSize.current[1]}
                            data={OneDayData(speed)}
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

                        <LineChart
                            className="chart"
                            width={windowSize.current[0]}
                            height={windowSize.current[1]}
                            data={WeekData(speed)}
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
                        <p>1 Week</p>

                        <LineChart
                            className="chart"
                            width={windowSize.current[0]}
                            height={windowSize.current[1]}
                            data={MonthData(speed)}
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
                        <p>1 Month</p>

                        <LineChart
                            className="chart"
                            width={windowSize.current[0]}
                            height={windowSize.current[1]}
                            data={SixMonthData(speed)}
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
                        <p>6 Month</p>


                        <LineChart
                            className="chart"
                            width={windowSize.current[0]}
                            height={windowSize.current[1]}
                            data={YearData(speed)}
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
                        <p>1 Year</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Speeds;
