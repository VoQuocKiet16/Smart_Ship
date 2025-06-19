// screens/LoginScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Image, KeyboardAvoidingView, Platform } from "react-native";
import { Button } from "react-native-paper";

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [token, setToken] = useState("");
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <Image
          source={require("../assets/images/shipper.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>Đăng nhập</Text>
        <TextInput
          placeholder="Nhập token"
          value={token}
          onChangeText={setToken}
          style={styles.input}
        />
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.replace("Index")}
          disabled={!token}
        >
          Đăng nhập
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f7f9fb" },
  image: { width: 300, height: 220, marginBottom: 18 },
  title: { fontSize: 28, fontWeight: "bold", color: "#2196F3", marginBottom: 24 },
  input: { width: "80%", borderColor: "#2196F3", borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 20, backgroundColor: "#fff" },
  button: { marginTop: 10, width: "60%" },
});