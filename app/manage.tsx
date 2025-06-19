// screens/ManagementScreen.js
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ManagementScreen() {
  // Danh sách thời gian mở thùng hàng mẫu
  const [openTimes] = useState([
    "15/06/2025 - 09:00",
    "15/06/2025 - 12:30",
    "16/06/2025 - 08:45",
    "16/06/2025 - 14:10",
    "17/06/2025 - 09:00",
    "17/06/2025 - 12:30",
    "18/06/2025 - 08:45",
    "18/06/2025 - 14:10"
  ]);
  const [showOpenTimes, setShowOpenTimes] = useState(false);

  // Danh sách đơn hàng mẫu (cập nhật thêm tên, trạng thái, thời gian nhập/xuất)
  const [orders, setOrders] = useState([
    {
      id: 1,
      name: "Đơn hàng A",
      status: "delivered", // delivered: đã giao, pending: chưa giao
      importTime: "15/06/2025 - 10:23",
      exportTime: "16/06/2025 - 11:15",
      expanded: false
    },
    {
      id: 2,
      name: "Đơn hàng B",
      status: "pending",
      importTime: "17/06/2025 - 09:10",
      exportTime: "",
      expanded: false
    },
    {
      id: 3,
      name: "Đơn hàng C",
      status: "delivered",
      importTime: "18/06/2025 - 08:00",
      exportTime: "18/06/2025 - 15:00",
      expanded: false
    },
    {
      id: 4,
      name: "Đơn hàng D",
      status: "pending",
      importTime: "19/06/2025 - 10:00",
      exportTime: "",
      expanded: false
    }
  ]);

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
            Số lần mở: <Text style={styles.num}>{openTimes.length}</Text>
          </Text>
        </View>
        <View style={styles.row}>
          <MaterialCommunityIcons name="box" color="#43A047" size={36} />
          <Text style={styles.info}>
            Số lần đóng: <Text style={styles.num}>22</Text>
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
                    <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#1a3557' }}>{order.name}</Text>
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
                  <View style={{ alignItems: 'center', marginTop: 14 }}>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteOrder(order.id)}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons name="delete" color="#fff" size={20} />
                      <Text style={styles.deleteButtonText}>Xoá đơn</Text>
                    </TouchableOpacity>
                  </View>
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
  num: { color: "#2196F3", fontWeight: "bold", fontSize: 20 },
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