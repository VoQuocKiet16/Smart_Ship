import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OrderHistoryScreen() {
  const [orderHistory, setOrderHistory] = useState<any[]>([]);

  const loadOrderHistoryFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem('orderHistory');
      if (stored) setOrderHistory(JSON.parse(stored));
      else setOrderHistory([]);
    } catch (e) {}
  };

  useEffect(() => {
    loadOrderHistoryFromStorage();
    const interval = setInterval(loadOrderHistoryFromStorage, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lịch sử đơn hàng</Text>
      {orderHistory.length === 0 ? (
        <Text style={styles.empty}>Chưa có đơn hàng nào trong lịch sử.</Text>
      ) : (
        <ScrollView>
          {orderHistory.map((order, idx) => (
            <View key={order.id + idx} style={styles.item}>
              <Text style={styles.id}>Mã đơn: {order.id}</Text>
              <Text style={styles.status}>{order.status === 'delivered' ? 'Đã giao' : 'Chưa giao'}</Text>
              <Text style={styles.time}>Nhập: {order.importTime}</Text>
              <Text style={styles.time}>Xuất: {order.exportTime || '---'}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fb', padding: 18 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#1a3557', marginBottom: 18, textAlign: 'center' },
  empty: { color: '#888', fontStyle: 'italic', textAlign: 'center', marginTop: 30 },
  item: { borderBottomWidth: 1, borderBottomColor: '#e0e0e0', paddingVertical: 12 },
  id: { fontWeight: 'bold', fontSize: 16, color: '#1a3557' },
  status: { color: '#43A047', fontWeight: 'bold', marginTop: 2 },
  time: { color: '#485568', fontSize: 14, marginTop: 1 },
});
