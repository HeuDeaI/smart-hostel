import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getAllOrders, updateOrderStatus } from "../../../services/foodService";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all"); // all, pending, completed

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось загрузить заказы");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      Alert.alert("Успешно", "Статус заказа обновлен");
      fetchOrders(); // Обновляем список заказов
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось обновить статус заказа");
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "all") return true;
    return order.status === activeFilter;
  });

  const renderOrderItem = (order) => (
    <View key={order.id} style={styles.orderItem}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>Заказ #{order.id}</Text>
          <Text style={styles.orderDate}>
            {new Date(order.createdAt).toLocaleString()}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <Text
            style={[
              styles.status,
              { color: order.status === "completed" ? "green" : "orange" },
            ]}
          >
            {order.status === "completed" ? "Выполнен" : "В процессе"}
          </Text>
        </View>
      </View>

      <View style={styles.itemsContainer}>
        {order.items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>x{item.quantity}</Text>
            <Text style={styles.itemPrice}>{item.price * item.quantity} ₽</Text>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalPrice}>Итого: {order.totalPrice} ₽</Text>
        {order.status === "pending" && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => handleUpdateStatus(order.id, "completed")}
          >
            <Icon name="check" size={20} color="white" />
            <Text style={styles.completeButtonText}>Выполнить</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === "all" && styles.activeFilter,
          ]}
          onPress={() => setActiveFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "all" && styles.activeFilterText,
            ]}
          >
            Все
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === "pending" && styles.activeFilter,
          ]}
          onPress={() => setActiveFilter("pending")}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "pending" && styles.activeFilterText,
            ]}
          >
            В процессе
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === "completed" && styles.activeFilter,
          ]}
          onPress={() => setActiveFilter("completed")}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "completed" && styles.activeFilterText,
            ]}
          >
            Выполненные
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map(renderOrderItem)
        ) : (
          <Text style={styles.emptyText}>Нет заказов</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filters: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    borderRadius: 20,
    alignItems: "center",
  },
  activeFilter: {
    backgroundColor: "#007AFF",
  },
  filterText: {
    color: "#666",
  },
  activeFilterText: {
    color: "white",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  orderItem: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  statusContainer: {
    marginLeft: 10,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
  },
  itemsContainer: {
    marginVertical: 10,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
  },
  itemQuantity: {
    fontSize: 14,
    color: "#666",
    marginHorizontal: 10,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "bold",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  completeButton: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  completeButtonText: {
    color: "white",
    marginLeft: 5,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
});

export default AdminOrders;
