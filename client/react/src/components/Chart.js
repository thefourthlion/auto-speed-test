import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Chart = () => {
    const [speeds, setSpeeds] = useState([]);

    const getSpeeds = () => {
        fetch("http://localhost:3002/api/speeds/read")
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

    // Function to transform data for each chart
    const transformData = (speed) => {
        return speed.download.map((downloadValue, index) => {
            const time = speed.timestamp[index].split(' ')[1]; // Extracting time from the timestamp
            return {
                name: time, // Using time as the x-axis label
                Download: parseFloat(downloadValue),
                Upload: parseFloat(speed.upload[index]),
                Ping: parseFloat(speed.ping[index]) // Including ping in the data if needed
            };
        });
    };

    return (
        <div className="Chart">
            <div className="container">
                <h1 className="content-header">Charts</h1>
                {speeds.map((speed, index) => (
                    <div key={index}>
                        <h2>{speed.name || speed.Ip}</h2> {/* Use name if available, otherwise use IP */}
                        <LineChart
                            width={600}
                            height={300}
                            data={transformData(speed)}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Download" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="Upload" stroke="#82ca9d" />
                            {/* Optional: Line for Ping */}
                            {/* <Line type="monotone" dataKey="Ping" stroke="#82ca9d" /> */}
                        </LineChart>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Chart;
