import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const ClientCharts = () => {
    const [searchParams] = useSearchParams();
    const id = (searchParams.get('id'));
    const windowSize = useRef([window.innerWidth * 0.6, window.innerHeight * 0.35]);

    const [speedsData, setSpeedsData] = useState([]);
    const [hostName, setHostName] = useState("")
    const [pingdata, setpingdata] = useState([])

    const [internalSpeed, setInternalSpeed] = useState([])
    const url = `http://localhost:3025/api/speeds/read/${id}`




    const getSpeeds = () => {
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setSpeedsData([data]);

                setHostName(data.Ip)
                const hostname = data.Ip
                getpings(hostname);

                fetch(`http://localhost:3025/api/internalspeeds/read/name/${hostname}`)
                    .then((res) => res.json())
                    .then((data) => {
                        setInternalSpeed(data);
                        console.log(data)
                    })
                    .catch((error) => {
                        console.error("Error fetching data: ", error);
                    });

            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    };


    const getpings = (hostname) => {
        axios.get(`http://localhost:3025/api/externalpingdata/read/name/${hostname}`)
            .then((response) => {
                setpingdata(response.data);
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

    const transformExternalPingData = (maxDataPoints) => {
        const data = [];
        if (pingdata.length > 0 && pingdata[0].timestamp) {
            const totalTimestamps = pingdata[0].timestamp.length;
            const startIndex = Math.max(totalTimestamps - maxDataPoints, 0);
            for (let i = startIndex; i < totalTimestamps; i++) {
                const timestamp = pingdata[0].timestamp[i];
                const pingData = {};
                pingdata.forEach((speed, index) => {
                    pingData[`${speed.link}`] = parseFloat(speed.ping[i]);
                });
                const time = timestamp.split(' ')[1];
                data.push({
                    name: time,
                    ...pingData,
                });
            }
        }
        return data;
    };

    const twelveHours = 12;



    return (
        <div className="ClientCharts page">
            <div className="container">
                <div className="speedContainer">

                    {speedsData.map((speed, index) => (
                        <div className="chart-container" key={index}>
                            <h1 className="chart-title" >{speed.name || speed.Ip}</h1>
                            <h2>External Speeds </h2>
                            <a href={`/speeds?id=${speed._id}`}>
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
                            </a>
                        </div>
                    ))}
                </div>

                {pingdata.length != 0 &&
                    // <p>something</p>
                    <div className="externalpingContainer">
                        <div className="chart-container">
                            <h2>External Pings</h2>

                            <a href={`/AllExternalPingData?hostname=${hostName}`}>
                                <LineChart
                                    className="chart"
                                    width={windowSize.current[0]}
                                    height={windowSize.current[1]}
                                    data={transformExternalPingData(twelveHours)}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" stroke="rgb(226, 228, 235)" />
                                    <YAxis stroke="rgb(226, 228, 235)" tickFormatter={msTick} />
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
                }

                {internalSpeed != [] ?
                    <div>
                        <div>
                            {internalSpeed.map((item, index) => (
                                <div className="chart-container" key={index}>
                                    <h2>Internal Speeds </h2>
                                    <a href={`/InternalSpeeds?id=${item._id}`}>
                                        <LineChart
                                            className="chart"
                                            width={windowSize.current[0]}
                                            height={windowSize.current[1]}
                                            data={transformSpeedData(item, twelveHours)}
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
                            {internalSpeed.map((item, index) => (
                                <div className="chart-container" key={index}>
                                    <a href={`/InternalPings?id=${item._id}`}>
                                        <LineChart
                                            className="chart"
                                            width={windowSize.current[0]}
                                            height={windowSize.current[1]}
                                            data={transformPingData(item, twelveHours)}
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
                    : ""}

            </div>
        </div >
    );
};

export default ClientCharts;
