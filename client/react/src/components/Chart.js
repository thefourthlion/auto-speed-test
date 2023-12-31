import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useRef } from 'react';

const Chart = () => {
    const windowSize = useRef([window.innerWidth * 0.6, window.innerHeight * 0.35]);

    const [speeds, setSpeeds] = useState([]);
    const [editingChart, setEditingChart] = useState(null);

    const handleEditClick = (speedId) => {
        setEditingChart(speedId);
    };

    const handleCancelClick = () => {
        setEditingChart(null);
    };

    const getSpeeds = () => {
        fetch("https://api.speeds.everettdeleon.com/api/speeds/read")
            .then((res) => res.json())
            .then((data) => {
                setSpeeds(data);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
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
        <div className="Chart">
            <div className="container">
                <h1 className="content-header">Speed Test Charts</h1>
                {speeds.map((speed, index) => (
                    <div className="chart-container" key={index}>
                        {editingChart === speed.Ip ?
                            <div className="change-name-container">
                                <input type="text" placeholder="Device Name" />
                                <button>Edit Name</button>
                                <button onClick={handleCancelClick}>Cancel</button>
                            </div>
                            : <h2 className="chart-title" onClick={() => handleEditClick(speed.Ip)}>{speed.name || speed.Ip}</h2>
                        }

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
                            <YAxis stroke="rgb(226, 228, 235)" />
                            <Tooltip contentStyle={{ backgroundColor: 'rgb(68, 72, 81)', color: 'rgb(226, 228, 235)' }} // Customizes the background and text color of the tooltip container
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

export default Chart;
