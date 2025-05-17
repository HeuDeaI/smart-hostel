import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import {
  getCleaningRequests,
  updateCleaningRequestStatus,
} from "../../../services/cleaningService";

const CleaningRequests = () => {
  const [requests, setRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = async () => {
    try {
      const data = await getCleaningRequests();
      setRequests(data);
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось загрузить запросы на уборку");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await updateCleaningRequestStatus(requestId, newStatus);
      await fetchRequests();
      Alert.alert("Успешно", "Статус запроса обновлен");
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось обновить статус запроса");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.requestCard}>
      <View style={styles.header}>
        <Text style={styles.roomNumber}>Комната {item.roomNumber}</Text>
        <Text style={[styles.status, styles[`status${item.status}`]]}>
          {item.status === "pending"
            ? "Ожидает"
            : item.status === "in_progress"
            ? "В процессе"
            : "Выполнено"}
        </Text>
      </View>
      {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
      <Text style={styles.time}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
      {item.status === "pending" && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={() => handleStatusUpdate(item.id, "in_progress")}
          >
            <Text style={styles.buttonText}>Принять</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.completeButton]}
            onPress={() => handleStatusUpdate(item.id, "completed")}
          >
            <Text style={styles.buttonText}>Выполнено</Text>
          </TouchableOpacity>
        </View>
      )}
      {item.status === "in_progress" && (
        <TouchableOpacity
          style={[styles.button, styles.completeButton]}
          onPress={() => handleStatusUpdate(item.id, "completed")}
        >
          <Text style={styles.buttonText}>Отметить как выполненное</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchRequests} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  list: {
    padding: 15,
  },
  requestCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  roomNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 12,
    fontWeight: "bold",
  },
  statuspending: {
    backgroundColor: "#FFE0B2",
    color: "#E65100",
  },
  statusin_progress: {
    backgroundColor: "#BBDEFB",
    color: "#1565C0",
  },
  statuscompleted: {
    backgroundColor: "#C8E6C9",
    color: "#2E7D32",
  },
  notes: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  time: {
    fontSize: 12,
    color: "#999",
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#2196F3",
  },
  completeButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CleaningRequests;
