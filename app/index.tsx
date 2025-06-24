import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AnimatedCircularProgress } from "react-native-circular-progress";

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trạng thái thùng hàng</Text>
      {loading ? (
        <Text>Đang tải dữ liệu...</Text>
      ) : (
        <View style={styles.chartsContainer}>
          <View style={styles.chartWrapper}>
            <AnimatedCircularProgress
              size={160}
              width={20}
              fill={(temperature / 40) * 100} // Giả sử nhiệt độ tối đa là 40°C
              tintColor="#2196F3"
              backgroundColor="#dde1e7"
              padding={10}
              rotation={0}
              lineCap="round"
            >
              {(fill: number) => (
                <View style={styles.chartContent}>
                  <MaterialCommunityIcons name="thermometer" size={32} color="#2196F3" />
                  <Text style={styles.value1}>{temperature.toFixed(1)}°C</Text>
                </View>
              )}
            </AnimatedCircularProgress>
            <Text style={styles.label}>Nhiệt độ</Text>
          </View>

          <View style={styles.chartWrapper}>
            <AnimatedCircularProgress
              size={160}
              width={20}
              fill={humidity}
              tintColor="#43A047"
              backgroundColor="#dde1e7"
              padding={10}
              rotation={0}
              lineCap="round"
            >
              {(fill: number) => (
                <View style={styles.chartContent}>
                  <MaterialCommunityIcons name="water-percent" size={32} color="#43A047" />
                  <Text style={styles.value2}>{humidity.toFixed(1)}%</Text>
                </View>
              )}
            </AnimatedCircularProgress>
            <Text style={styles.label}>Độ ẩm</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f7f9fb",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 40,
    textAlign: "center",
  },
  chartsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  chartWrapper: {
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#353c4d",
    marginTop: 20,
  },
  chartContent: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  value1: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5,
    color: "#2196F3",
  },
  value2: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5,
    color: "#43A047",
  },
});
