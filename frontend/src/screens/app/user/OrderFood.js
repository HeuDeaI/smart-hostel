import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  getMenuItems,
  placeOrder,
  getOrderHistory,
} from "../../../services/foodService";
import { AuthContext } from "../../../context/AuthContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Блюдо в меню
// {
//   id: string,
//   name: string,
//   description: string,
//   price: number,
//   image: string (URL)
// }

// Заказ
// {
//   id: string,
//   userId: string,
//   items: Array<{id, name, price, quantity}>,
//   totalPrice: number,
//   status: "pending" | "completed",
//   createdAt: string
// }

const OrderFood = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("menu"); // menu, cart, history
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [menuData, historyData] = await Promise.all([
        getMenuItems(),
        getOrderHistory(userInfo.id),
      ]);
      setMenuItems(menuData);
      setOrderHistory(historyData);
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      Alert.alert("Ошибка", "Корзина пуста");
      return;
    }

    try {
      const orderData = {
        userId: userInfo.id,
        items: cart,
        totalPrice: getTotalPrice(),
        status: "pending",
      };

      await placeOrder(orderData);
      Alert.alert("Успешно", "Заказ успешно размещен");
      setCart([]);
      fetchData(); // Обновляем историю заказов
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось разместить заказ");
    }
  };

  const renderMenuItem = (item) => (
    <View key={item.id} style={styles.menuItem}>
      <Image source={{ uri: item.image }} style={styles.menuItemImage} />
      <View style={styles.menuItemInfo}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        <Text style={styles.menuItemDescription}>{item.description}</Text>
        <Text style={styles.menuItemPrice}>{item.price} ₽</Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => addToCart(item)}
      >
        <Icon name="plus" size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );

  const renderCartItem = (item) => (
    <View key={item.id} style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.cartItemImage} />
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>{item.price} ₽</Text>
      </View>
      <View style={styles.quantityControls}>
        <TouchableOpacity
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <Icon name="minus" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Icon name="plus" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderOrderHistoryItem = (order) => (
    <View key={order.id} style={styles.historyItem}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyDate}>
          {new Date(order.createdAt).toLocaleDateString()}
        </Text>
        <Text
          style={[
            styles.historyStatus,
            { color: order.status === "completed" ? "green" : "orange" },
          ]}
        >
          {order.status === "completed" ? "Выполнен" : "В процессе"}
        </Text>
      </View>
      {order.items.map((item) => (
        <View key={item.id} style={styles.historyItemDetail}>
          <Text style={styles.historyItemName}>{item.name}</Text>
          <Text style={styles.historyItemQuantity}>x{item.quantity}</Text>
        </View>
      ))}
      <Text style={styles.historyTotal}>Итого: {order.totalPrice} ₽</Text>
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
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "menu" && styles.activeTab]}
          onPress={() => setActiveTab("menu")}
        >
          <Icon
            name="food"
            size={24}
            color={activeTab === "menu" ? "#007AFF" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "menu" && styles.activeTabText,
            ]}
          >
            Меню
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "cart" && styles.activeTab]}
          onPress={() => setActiveTab("cart")}
        >
          <Icon
            name="cart"
            size={24}
            color={activeTab === "cart" ? "#007AFF" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "cart" && styles.activeTabText,
            ]}
          >
            Корзина ({cart.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "history" && styles.activeTab]}
          onPress={() => setActiveTab("history")}
        >
          <Icon
            name="history"
            size={24}
            color={activeTab === "history" ? "#007AFF" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "history" && styles.activeTabText,
            ]}
          >
            История
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === "menu" && (
          <View style={styles.menuContainer}>
            {menuItems.map(renderMenuItem)}
          </View>
        )}

        {activeTab === "cart" && (
          <View style={styles.cartContainer}>
            {cart.map(renderCartItem)}
            {cart.length > 0 && (
              <View style={styles.cartFooter}>
                <Text style={styles.totalPrice}>
                  Итого: {getTotalPrice()} ₽
                </Text>
                <TouchableOpacity
                  style={styles.orderButton}
                  onPress={handlePlaceOrder}
                >
                  <Text style={styles.orderButtonText}>Заказать</Text>
                </TouchableOpacity>
              </View>
            )}
            {cart.length === 0 && (
              <Text style={styles.emptyCartText}>
                Корзина пуста. Добавьте блюда из меню.
              </Text>
            )}
          </View>
        )}

        {activeTab === "history" && (
          <View style={styles.historyContainer}>
            {orderHistory.map(renderOrderHistoryItem)}
            {orderHistory.length === 0 && (
              <Text style={styles.emptyHistoryText}>
                У вас пока нет заказов
              </Text>
            )}
          </View>
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
  tabs: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  tabText: {
    marginTop: 5,
    color: "#666",
  },
  activeTabText: {
    color: "#007AFF",
  },
  content: {
    flex: 1,
  },
  menuContainer: {
    padding: 15,
  },
  menuItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  menuItemInfo: {
    flex: 1,
    marginLeft: 10,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  menuItemDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  addButton: {
    padding: 10,
  },
  cartContainer: {
    padding: 15,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  cartItemInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cartItemPrice: {
    fontSize: 14,
    color: "#007AFF",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  cartFooter: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  orderButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  orderButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyCartText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
  historyContainer: {
    padding: 15,
  },
  historyItem: {
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
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  historyDate: {
    fontSize: 14,
    color: "#666",
  },
  historyStatus: {
    fontSize: 14,
    fontWeight: "bold",
  },
  historyItemDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  historyItemName: {
    fontSize: 14,
  },
  historyItemQuantity: {
    fontSize: 14,
    color: "#666",
  },
  historyTotal: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "right",
  },
  emptyHistoryText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
});

export default OrderFood;
