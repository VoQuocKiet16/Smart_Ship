// screens/ManagementScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ManagementScreen() {
  const [openCount, setOpenCount] = useState(0);
  const [closeCount, setCloseCount] = useState(0);
  const [openTimes, setOpenTimes] = useState<string[]>([]);
  const [closeTimes, setCloseTimes] = useState<string[]>([]);
  const [lastBoxState, setLastBoxState] = useState<number|null>(null);
  const [initialized, setInitialized] = useState(false);
  const [showOpenTimes, setShowOpenTimes] = useState(false);
  const [showCloseTimes, setShowCloseTimes] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchBoxState = async () => {
      try {
        const boxRes = await fetch("http://kenhsangtaotre.ddns.net:8080/-10Z9Di_9AwA695EVyqn7vPkdwb7r1wD/get/V3");
        const boxVal = await boxRes.text();
        const boxArr = JSON.parse(boxVal);
        const boxNum = parseInt(boxArr[0]);
        if (!isNaN(boxNum)) {
          if (initialized && lastBoxState !== null && boxNum !== lastBoxState) {
            if (boxNum === 0) {
              setOpenCount(prev => prev + 1);
              setOpenTimes(prev => [...prev, new Date().toLocaleString()]);
            } else if (boxNum === 1) {
              setCloseCount(prev => prev + 1);
              setCloseTimes(prev => [...prev, new Date().toLocaleString()]);
            }
          }
          setLastBoxState(boxNum);
          if (!initialized) setInitialized(true);
        }
      } catch (e) {}
    };
    fetchBoxState();
    const interval = setInterval(fetchBoxState, 1000);
    return () => clearInterval(interval);
  }, [lastBoxState, initialized]);

  // Hàm lấy danh sách đơn hàng từ API
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://kenhsangtaotre.ddns.net:8080/-10Z9Di_9AwA695EVyqn7vPkdwb7r1wD/get/V2");
      const text = await res.text();
      console.log("Dữ liệu đơn hàng trả về:", text);
      let raw = text;
      try {
        const parsedJson = JSON.parse(text);
        if (Array.isArray(parsedJson)) {
          raw = parsedJson[0] || "";
        }
      } catch (e) {}
      // Ví dụ dữ liệu: #2738488#1##2738499#0##2738500#1#
      const items = raw.split("##").filter(Boolean);
      const now = new Date().toLocaleString();
      const parsed = items.map(item => {
        const parts = item.split("#").filter(Boolean);
        return {
          id: parts[0] || "",
          status: parts[1] === "1" ? "delivered" : "pending",
          importTime: now, // lấy thời gian request làm thời gian nhập
          exportTime: parts[1] === "1" ? now : "",
          expanded: false
        };
      });
      setOrders(parsed);
    } catch (e) {}
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // cập nhật mỗi 10 giây
    return () => clearInterval(interval);
  }, []);

  // Xoá đơn hàng
  const handleDeleteOrder = (id: number) => {
    setOrders(orders.filter(order => order.id !== id));
  };

  // Toggle expand/collapse đơn hàng
  const handleToggleExpand = (id: number) => {
    setOrders(orders.map(order => order.id === id ? { ...order, expanded: !order.expanded } : order));
  };

  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: "#f7f9fb" }}>
      <Text style={styles.header}>Quản lý thùng hàng</Text>
      <Card style={styles.card}>
        <View style={styles.row}>
          <MaterialCommunityIcons name="package-variant" color="#2196F3" size={36} />
          <Text style={styles.info}>
            Số lần mở: <Text style={styles.num1}>{openCount}</Text>
          </Text>
        </View>
        <View style={styles.row}>
          <MaterialCommunityIcons name="box" color="#43A047" size={36} />
          <Text style={styles.info}>
            Số lần đóng: <Text style={styles.num2}>{closeCount}</Text>
          </Text>
        </View>
        {/* Expandable list thời gian mở thùng hàng */}
        <View style={{ marginTop: 10 }}>
          <Text
            style={{ color: '#2196F3', fontWeight: 'bold', marginBottom: 6 }}
            onPress={() => setShowOpenTimes(!showOpenTimes)}
          >
            {showOpenTimes ? 'Ẩn thời gian mở thùng hàng ▲' : 'Xem thời gian mở thùng hàng ▼'}
          </Text>
          {showOpenTimes && (
            <View style={{ paddingLeft: 10, maxHeight: 120 }}>
              <ScrollView style={{ maxHeight: 120 }}>
                {openTimes.map((time, idx) => (
                  <Text key={idx} style={{ color: '#1a3557', marginVertical: 2 }}>• {time}</Text>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        {/* Lịch sử đóng thùng hàng */}
        <View style={{ marginTop: 10 }}>
          <Text
            style={{ color: '#43A047', fontWeight: 'bold', marginBottom: 6 }}
            onPress={() => setShowCloseTimes(!showCloseTimes)}
          >
            {showCloseTimes ? 'Ẩn thời gian đóng thùng hàng ▲' : 'Xem thời gian đóng thùng hàng ▼'}
          </Text>
          {showCloseTimes && (
            <View style={{ paddingLeft: 10, maxHeight: 120 }}>
              <ScrollView style={{ maxHeight: 120 }}>
                {closeTimes.map((time, idx) => (
                  <Text key={idx} style={{ color: '#1a3557', marginVertical: 2 }}>• {time}</Text>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </Card>

      <Text style={styles.header}>Quản lý đơn hàng</Text>
      {orders.length === 0 ? (
        <Text style={{ color: '#888', fontStyle: 'italic' }}>Không có đơn hàng nào.</Text>
      ) : (
        <ScrollView style={{ maxHeight: 400 }}>
          {orders.map(order => (
            <View key={order.id} style={styles.orderBox}>
              <View style={[styles.row, { justifyContent: 'space-between' }]}>  
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialCommunityIcons
                    name={order.status === 'delivered' ? 'check-circle' : 'clock-outline'}
                    color={order.status === 'delivered' ? '#43A047' : '#FFB300'}
                    size={28}
                  />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#1a3557' }}>Mã đơn hàng: {order.id}</Text>
                    <Text style={{ color: order.status === 'delivered' ? '#43A047' : '#FFB300', fontWeight: 'bold' }}>
                      {order.status === 'delivered' ? 'Đã giao' : 'Chưa giao'}
                    </Text>
                  </View>
                </View>
                <MaterialCommunityIcons
                  name={order.expanded ? 'chevron-up' : 'chevron-down'}
                  color="#888"
                  size={24}
                  onPress={() => handleToggleExpand(order.id)}
                  style={{ marginLeft: 8 }}
                />
              </View>
              {order.expanded && (
                <View style={{ marginTop: 8 }}>
                  <Text style={{ color: '#222', fontSize: 15 }}>
                    Thời gian nhập đơn: <Text style={{ fontWeight: 'bold' }}>{order.importTime}</Text>
                  </Text>
                  <Text style={{ color: '#222', fontSize: 15, marginTop: 2 }}>
                    Thời gian xuất đơn: <Text style={{ fontWeight: 'bold' }}>{order.exportTime || '---'}</Text>
                  </Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 21, fontWeight: "bold", marginVertical: 10, color: "#1a3557" },
  card: { padding: 18, borderRadius: 16, marginBottom: 24, backgroundColor: "#fff", elevation: 2 },
  row: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  info: { fontSize: 18, marginLeft: 16, color: "#222" },
  num1: { color: "#2196F3", fontWeight: "bold", fontSize: 20 },
  num2: { color: "#43A047", fontWeight: "bold", fontSize: 20 },
  orderBox: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    backgroundColor: '#f9fafb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e53935',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginTop: 4
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16
  }
});