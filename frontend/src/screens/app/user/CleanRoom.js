import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import {
  requestCleaning,
  checkCleaningRequest,
} from "../../../services/cleaningService";
import { AuthContext } from "../../../context/AuthContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const CleanRoom = () => {
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [checking, setChecking] = useState(true);
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchStatus = async () => {
      // if (!userInfo?.roomNumber || !userInfo?.id) {
      //   setChecking(false);
      //   return;
      // }
      try {
        const hasActive = await checkCleaningRequest(
          userInfo.roomNumber,
          userInfo.id
        );
        setIsRequested(hasActive);
      } catch (e) {
        // Можно обработать ошибку, например, показать Alert
      } finally {
        setChecking(false);
      }
    };
    fetchStatus();
  }, [userInfo]);

  const handleRequestCleaning = async () => {
    setIsLoading(true);
    try {
      // await requestCleaning(userInfo.roomNumber, userInfo.id, notes);
      setIsRequested(true);
      setNotes("");
    } catch (error) {
      Alert.alert(
        "Ошибка",
        "Не удалось отправить запрос на уборку. Пожалуйста, попробуйте позже."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Icon
          name="broom"
          size={48}
          color="#007AFF"
          style={{ marginBottom: 20 }}
        />
        <Text style={{ fontSize: 18, color: "#333" }}>Проверяем статус...</Text>
      </View>
    );
  }

  if (isRequested) {
    return (
      <View
        style={[
          styles.container,
          { flex: 1, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Icon
          name="broom"
          size={48}
          color="#007AFF"
          style={{ marginBottom: 20 }}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#333",
            marginBottom: 10,
          }}
        >
          Номер ожидает уборки
        </Text>
        <Text style={{ fontSize: 16, color: "#666", textAlign: "center" }}>
          Ваш запрос на уборку успешно отправлен. Ожидайте выполнения.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon name="broom" size={40} color="#007AFF" />
          <Text style={styles.title}>Запрос на уборку</Text>
        </View>

        <Text style={styles.subtitle}>
          Оставьте комментарий, если у вас есть особые пожелания по уборке
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Например: пожалуйста, поменяйте постельное белье"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRequestCleaning}
          disabled={isLoading}
        >
          <Icon
            name={isLoading ? "loading" : "send"}
            size={24}
            color="white"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>
            {isLoading ? "Отправка..." : "Запросить уборку"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  input: {
    padding: 15,
    minHeight: 120,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CleanRoom;
