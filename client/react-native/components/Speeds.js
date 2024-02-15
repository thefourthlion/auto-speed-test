import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const Speeds = (Ip, download, upload, ping) => {
  const [speeds, setSpeeds] = useState([]);

  const getSpeeds = () => {
    fetch("http://10.49.48.150:3025/api/speeds/read")
      .then((res) => res.json())
      .then((data) => {
        setSpeeds(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  useEffect(() => {
    getSpeeds();
  }, []);

  return (
    <View style={styles.container}>
      {/* <FlatList
        style={styles.speedContainer}
        data={speeds}
        renderItem={({ item }) => <Text>{item}</Text>}
        keyExtractor={(item) => item.id}
      /> */}
      <View style={styles.speedContainer}>
        <Text style={styles.Ip}>192.168.1.1</Text>
        <Text style={styles.download}>850 Mbps</Text>
        <Text style={styles.upload}>20 Mbps</Text>
        <Text style={styles.ping}>20 Ms</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    alignItems: "center",
    justifyContent: "center",
  },
  speedContainer: {
    // flex: 3,
    backgroundColor: "green",
    // alignContent: "center",
    // textAlign: "center",
    // justifyContent: "center",
    width: 150,
    height: 150,
    borderColor: "black",
    borderWidth: 3,
    borderRadius: 5,
  },
  Ip: { fontSize: 25 },
  download: { fontSize: 20 },
  upload: { fontSize: 20 },
  ping: { fontSize: 20 },
});

export default Speeds;
