import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Index() {
  const [temperature, setTemperature] = useState(22);
  const [humidity, setHumidity] = useState(48);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Điều khiển thùng hàng</Text>

      <View style={styles.card}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons name="thermometer" size={32} color="#2196F3" />
          <Text style={styles.label}> Nhiệt độ</Text>
        </View>
        <Slider
          style={{ width: '100%', height: 36 }}
          minimumValue={0}
          maximumValue={40}
          step={0.1}
          value={temperature}
          onValueChange={setTemperature}
          minimumTrackTintColor="#2196F3"
          maximumTrackTintColor="#ddd"
        />
        <Text style={styles.value1}>{temperature.toFixed(1)}°C</Text>
      </View>

      <View style={styles.card}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons name="water-percent" size={32} color="#43A047" />
          <Text style={styles.label}> Độ ẩm</Text>
        </View>
        <Slider
          style={{ width: '100%', height: 36 }}
          minimumValue={0}
          maximumValue={100}
          step={0.5}
          value={humidity}
          onValueChange={setHumidity}
          minimumTrackTintColor="#43A047"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#43A047"
        />
        <Text style={styles.value2}>{humidity.toFixed(1)}%</Text>
      </View>

      <View style={[styles.card, { marginTop: 20 }]}>
        <Text style={[styles.info, {marginBottom: 6}]}>Nhiệt độ hiện tại: <Text style={{color: '#2196F3'}}>{temperature.toFixed(1)}°C</Text></Text>
        <Text style={styles.info}>Độ ẩm hiện tại: <Text style={{color: '#43A047'}}>{humidity.toFixed(1)}%</Text></Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f7f9fb",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 28,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    marginBottom: 22,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontSize: 17,
    fontWeight: "600",
    color: "#353c4d",
    marginLeft: 8,
  },
  value1: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    color: "#2196F3",
    textAlign: "right",
  },
  value2: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    color: "#43A047",
    textAlign: "right",
  },
  
  info: {
    fontSize: 18,
    fontWeight: "500",
    color: "#485568",
    marginBottom: 4
  },
});
