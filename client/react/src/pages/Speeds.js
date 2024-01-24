import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


const Speeds = () => {
    const [searchParams] = useSearchParams();
    const id = (searchParams.get('id'));
    const windowSize = useRef([window.innerWidth * 0.6, window.innerHeight * 0.35]);

    const [speedsData, setSpeedsData] = useState([]);
    const navigate = useNavigate();

    const formatTick = (tick) => {
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

    // Function to transform data for each chart, limiting to 10 data points
    const transformData = (speed) => {
        const maxLength = 15; // Maximum number of data points
        return speed.download.slice(-15).map((downloadValue, index) => {
            const time = speed.timestamp[index] ? speed.timestamp[index].split(' ')[1] : `Test ${index + 1}`;
            return {
                name: time, // Using time as the x-axis label, or a default label if time is not available
                Download: parseFloat(downloadValue),
                Upload: parseFloat(speed.upload[index])
            };
        });
    };

    return (
        <div className="Speeds">
            <div className="container">
                <h1 className="content-header">Speed Test Charts</h1>
                {speedsData.map((speed, index) => (
                    <div className="chart-container" key={index}>
                        <h2 className="chart-title" >{speed.name || speed.Ip}</h2>

                        <h2></h2>
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
                            <Tooltip content={<CustomTooltip />}  // Customizes the background and text color of the tooltip container
                            />
                            <Legend />
                            <Line type="monotone" dataKey="Download" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="Upload" stroke="#82ca9d" />
                        </LineChart>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Speeds;
