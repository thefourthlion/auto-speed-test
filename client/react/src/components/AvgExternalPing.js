import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useRef } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

const AvgExternalPing = () => {

    const windowSize = useRef([window.innerWidth * 0.6, window.innerHeight * 0.35]);

    const [pingdata, setpingdata] = useState([]);
    const [chosenGroup, setChosenGroup] = useState("HWY 120")
    const [groups, setGroups] = useState([])
    const [clients, setClients] = useState([])


    const [avgData, setAvgData] = useState([])

    const formatTick = (tick) => {
        return `${tick} ms`;
    };

    const getSpeeds = () => {
        fetch(`http://localhost:3025/api/speeds/read/group/${chosenGroup}`)
            .then((res) => res.json())
            .then((data) => {
                // setpingdata(data);
                const clientList = data.map(item => item.Ip);
                setClients(clientList);
                // console.log(clientList)
                clientList.forEach((client) => {
                    getExternalPingData(client);
                })
                console.log(avgData)

            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    };

    const getExternalPingData = (name) => {
        fetch(`http://localhost:3025/api/externalpingdata/read/name/${name}`)
            .then((res) => res.json())
            .then((data) => {
                // console.log(data)
                setpingdata(data);
                setAvgData(prevData => [...prevData, ...data]);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    };

    const getGroupData = () => {
        fetch("http://localhost:3025/api/groups/read")
            .then((res) => res.json())
            .then((data) => {
                setGroups(data);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    };


    useEffect(() => {
        getGroupData();
    }, []);

    useEffect(() => {
        getSpeeds();
    }, [chosenGroup]);


    const transformData = (maxDataPoints) => {
        const data = [];

        // Assuming all sites have the same timestamps (you may need to adjust this logic)
        if (pingdata.length > 0 && pingdata[0].timestamp) {
            const totalTimestamps = pingdata[0].timestamp.length;
            const startIndex = Math.max(totalTimestamps - maxDataPoints, 0);

            for (let i = startIndex; i < totalTimestamps; i++) {
                const timestamp = pingdata[0].timestamp[i];
                const pingData = {};

                pingdata.forEach((speed, index) => {
                    pingData[`${speed.link}`] = parseFloat(speed.ping[i]);
                });

                // Extract the time part from the timestamp (assuming timestamp format is 'MM-DD-YYYY HH:MM')
                const time = timestamp.split(' ')[1];
                data.push({
                    name: time,
                    ...pingData,
                });
            }
        }

        return data;
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

    const day = 24;

    return (
        <div className="AvgExternalPing">
            <div className="container">
                <h1 className="content-header">Avg External Pings for {chosenGroup}</h1>

                <Dropdown className="dropdown" >
                    <Dropdown.Toggle id="dropdown-basic">
                        Chose A Different Group
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {groups.map((item, index) => (
                            <div>
                                <Dropdown.Item className="dropdown-item" onClick={() => {
                                    setChosenGroup(`${item.name}`);
                                    getSpeeds();
                                    getGroupData();
                                }}>{item.name}</Dropdown.Item>

                            </div>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>

                <div className="chart-container">

                    <LineChart
                        className="chart"
                        width={windowSize.current[0]}
                        height={windowSize.current[1]}
                        data={transformData(day)}
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
                </div>
            </div>
        </div>
    );
};

export default AvgExternalPing;
