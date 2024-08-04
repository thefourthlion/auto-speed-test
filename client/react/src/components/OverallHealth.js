import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, ListGroup, Badge } from 'react-bootstrap';

const OverallHealth = () => {
    const [redStatusClients, setRedStatusClients] = useState([]);

    // Constants for threshold
    const yellowThreshold = 0.25;
    const expectedPing = 35;

    // Function to fetch data
    const getData = async () => {
        try {
            const response = await axios.get('https://apispeeds.portkeylabs.net/api/speeds/read');
            trackRedStatusClients(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Function to track red status clients
    const trackRedStatusClients = (fetchedSpeeds) => {
        const redClients = fetchedSpeeds.filter(item => {
            if (!item.package || item.ping === undefined) return false;

            const [expectedDownload, expectedUpload] = item.package.map(Number);
            const actualDownload = Number(item.download[item.download.length - 1]);
            const actualUpload = Number(item.upload[item.upload.length - 1]);
            const actualPing = Number(item.ping[item.ping.length - 1]);

            const downloadIsRed = actualDownload < yellowThreshold * expectedDownload;
            const uploadIsRed = actualUpload < yellowThreshold * expectedUpload;
            const pingIsRed = actualPing > yellowThreshold * expectedPing;

            return downloadIsRed && uploadIsRed && pingIsRed;
        });

        setRedStatusClients(redClients);
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="OverallHealth">
            <div className="container">
                <h1>Network Health Overview</h1>
                <Card className='health-container'>
                    <Card.Header as="h4">
                        Troubled Clients
                        <Badge pill bg="danger" className="ms-2">
                            {redStatusClients.length}
                        </Badge>
                    </Card.Header>
                    <ListGroup className='list-container' variant="flush">
                        {redStatusClients.length === 0 ? (
                            <ListGroup.Item className='list-item'>No clients are currently experiencing issues.</ListGroup.Item>
                        ) : (
                            redStatusClients.map((client, index) => (
                                <ListGroup.Item className='list-item' key={index} action href={`/client?id=${client._id}`}>
                                    <strong>{client.Ip}</strong> — Download, Upload, and Ping issues detected.
                                </ListGroup.Item>
                            ))
                        )}
                    </ListGroup>
                </Card>
            </div>
        </div>
    );
};

export default OverallHealth;
