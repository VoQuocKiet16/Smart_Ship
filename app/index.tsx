import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Index() {
  const [temperature, setTemperature] = useState(22);
  const [humidity, setHumidity] = useState(48);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const tempRes = await fetch("http://kenhsangtaotre.ddns.net:8080/-10Z9Di_9AwA695EVyqn7vPkdwb7r1wD/get/V0");
      const tempVal = await tempRes.text();
      const humRes = await fetch("http://kenhsangtaotre.ddns.net:8080/-10Z9Di_9AwA695EVyqn7vPkdwb7r1wD/get/V1");
      const humVal = await humRes.text();

      const tempArr = JSON.parse(tempVal);
      const humArr = JSON.parse(humVal);

      const tempNum = parseFloat(tempArr[0]);
      const humNum = parseFloat(humArr[0]);
      if (!isNaN(tempNum)) setTemperature(tempNum);
      if (!isNaN(humNum)) setHumidity(humNum);
    } catch (e) {
      // Có thể xử lý lỗi ở đây
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000); // Cập nhật mỗi 1 giây
    return () => clearInterval(interval); // Xóa interval khi unmount
  }, []);

  const updateTemperature = async (value: number) => {
    setTemperature(value);
    try {
      await fetch(`http://kenhsangtaotre.ddns.net:8080/-10Z9Di_9AwA695EVyqn7vPkdwb7r1wD/update/V0?value=${value}`, { method: 'GET' });
    } catch (e) {}
  };

  const updateHumidity = async (value: number) => {
    setHumidity(value);
    try {
      await fetch(`http://kenhsangtaotre.ddns.net:8080/-10Z9Di_9AwA695EVyqn7vPkdwb7r1wD/update/V1?value=${value}`, { method: 'GET' });
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Điều khiển thùng hàng</Text>
      {loading ? (
        <Text>Đang tải dữ liệu...</Text>
      ) : (
        <>
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
              onValueChange={updateTemperature}
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
              onValueChange={updateHumidity}
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
        </>
      )}
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
