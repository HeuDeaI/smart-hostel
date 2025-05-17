import { useState, useCallback, useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  RefreshControl,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { white, textLightGray } from "../../../constants/Colors";
import { Button, Avatar, TouchableRipple, Switch } from "react-native-paper";
import { useTranslation } from "../../../i18n/I18nProvider";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { primaryBlue, textDarkGray } from "../../../constants/Colors";
import axios from "axios";
import { baseUrl } from "../../../config/BaseUrl";

import { AuthContext } from "../../../context/AuthContext";
import AttractionsSlider from "../../../components/AttractionsSlider";
import { getRoomInfo } from "../../../services/roomService";

const AnimatedGradient = () => {
  const animation = new Animated.Value(0);

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true, // Используем native driver для opacity
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate();
  }, []);

  const startColors = ["#6a0dad", "#4c449f", "#3b5998"];
  const endColors = ["#3b5998", "#4c449f", "#6a0dad"];

  return (
    <View style={{ flex: 1, width: "100%" }}>
      {/* Градиент с startColors */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: Animated.subtract(1, animation),
        }}
      >
        <LinearGradient
          colors={startColors}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 15,
            borderRadius: 12,
          }}
        />
      </Animated.View>

      {/* Градиент с endColors */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: animation, // Прозрачность от 0 до 1
        }}
      >
        <LinearGradient
          colors={endColors}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 15,
            borderRadius: 12,
          }}
        />
      </Animated.View>

      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <Image
          source={require("../../../../assets/images/ai-icon.png")}
          style={{
            width: 40,
            height: 40,
            marginBottom: 10,
            tintColor: "white",
          }}
        />
        <Text style={{ fontFamily: "fontBold", fontSize: 14, color: "white" }}>
          Чем могу помочь?
        </Text>
      </View>
    </View>
  );
};

const Dashboard = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [roomInfo, setRoomInfo] = useState({ roomNumber: 0, floor: 0 });
  const [loadingRoomInfo, setLoadingRoomInfo] = useState(true);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [rentEndDate, setRentEndDate] = useState(null);
  const [error, setError] = useState(null);

  const { userInfo, userToken } = useContext(AuthContext);
  const { t } = useTranslation();

  const data = require("../../../data/dummyData.json");
  const recentAnnouncement = data.announcements[2];

  var date = new Date();
  var hours = date.getHours();
  var greet = "Greetings!";

  //Greeting based on the time of the day
  if (hours < 12) {
    greet = "Good Morning!";
  } else if (hours < 15) {
    greet = "Good Afternoon!";
  } else {
    greet = "Good Evening!";
  }

  // Здесь будут данные с бэкенда
  const roomMetrics = {
    temperature: 22.5,
    humidity: 45,
    pressure: 760,
  };

  const fetchRentEndDate = async () => {
    try {
      const response = await axios.get(`${baseUrl}user/rent-end-date`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setRentEndDate(response.data.rentEndDate);
      setError(null);
    } catch (err) {
      console.error("Error fetching rent end date:", err);
      //setError('Failed to fetch rent end date');
      // Set a default date in case of error (optional)
      setRentEndDate("2025-05-20T12:00:00");
      console.log(rentEndDate);
    }
  };

  const fetchRoomInfo = async () => {
    try {
      const data = await getRoomInfo(userInfo.id);
      setRoomInfo(data);
    } catch (error) {
      console.error("Error fetching room info:", error);
    } finally {
      setLoadingRoomInfo(false);
    }
  };

  useEffect(() => {
    fetchRentEndDate();
    fetchRoomInfo();
  }, [userToken, userInfo.id]);

  useEffect(() => {
    if (!rentEndDate) return;

    const calculateTimeLeft = () => {
      const difference = new Date(rentEndDate).getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Initial calculation
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, [rentEndDate]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([fetchRentEndDate(), fetchRoomInfo()]).finally(() => {
      setRefreshing(false);
    });
  }, []);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ backgroundColor: white, minHeight: "100%" }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.profileDetails}>
            <Avatar.Image
              size={75}
              source={require("../../../../assets/images/profile_pic.png")}
            />
            <View style={styles.profileText}>
              <Text
                style={{
                  fontFamily: "fontRegular",
                  fontSize: 16,
                  color: textLightGray,
                }}
              >
                {greet}
              </Text>
              <Text
                style={{
                  fontFamily: "fontBold",
                  fontSize: 16,
                  marginTop: -5,
                }}
              >
                {userInfo.full_name}
              </Text>
              {roomInfo && (
                <View style={styles.roomInfo}>
                  <Icon name="home" size={16} color={textLightGray} />
                  <Text style={styles.roomInfoText}>
                    Комната {roomInfo.roomNumber}, {roomInfo.floor} этаж
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.quickButtons}>
            <TouchableRipple
              onPress={() => navigation.navigate("UserRoomsDashboard")}
              style={[styles.dashboardCard, { width: "48%", height: 60 }]}
            >
              <LinearGradient
                colors={["#6a0dad", "#4c449f", "#3b5998"]}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 15,
                  height: "100%",
                  borderRadius: 12,
                }}
              >
                <Text style={[styles.cardText, { color: white }]}>
                  {t("user.booking.newBooking")}
                </Text>
              </LinearGradient>
            </TouchableRipple>

            <TouchableRipple
              onPress={() =>
                navigation.navigate("UserRoomsAcceptanceDashboard")
              }
              style={[styles.dashboardCard, { width: "48%", height: 60 }]}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 15,
                  height: "100%",
                }}
              >
                <Text style={styles.cardText}>Статус бронирования</Text>
              </View>
            </TouchableRipple>
          </View>

          <View style={styles.quickButtons}>
            <View style={styles.timeCard}>
              <Text style={{ fontFamily: "fontBold" }}>
                До истечения аренды осталось:
              </Text>

              <View style={styles.timeGrid}>
                <View style={styles.timeMiniCard}>
                  <Text style={styles.timeValue}>{timeLeft.days}</Text>
                  <Text style={styles.timeLabel}>дней</Text>
                </View>

                <View style={styles.timeMiniCard}>
                  <Text style={styles.timeValue}>{timeLeft.hours}</Text>
                  <Text style={styles.timeLabel}>часов</Text>
                </View>

                <View style={styles.timeMiniCard}>
                  <Text style={styles.timeValue}>{timeLeft.minutes}</Text>
                  <Text style={styles.timeLabel}>минут</Text>
                </View>

                <View style={styles.timeMiniCard}>
                  <Text style={styles.timeValue}>{timeLeft.seconds}</Text>
                  <Text style={styles.timeLabel}>секунд</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.quickButtons}>
            <View style={styles.recentAnnouncement}>
              <Text style={{ fontFamily: "fontBold" }}>
                Текущие комнатные показатели:
              </Text>
              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <Image
                    source={require("../../../../assets/images/temperature.png")}
                    style={styles.metricIcon}
                  />
                  <Text style={styles.metricValue}>
                    {roomMetrics.temperature}°C
                  </Text>
                  <Text style={styles.metricLabel}>Температура</Text>
                </View>

                <View style={styles.metricCard}>
                  <Image
                    source={require("../../../../assets/images/humidity.png")}
                    style={styles.metricIcon}
                  />
                  <Text style={styles.metricValue}>
                    {roomMetrics.humidity}%
                  </Text>
                  <Text style={styles.metricLabel}>Влажность</Text>
                </View>

                <View style={styles.metricCard}>
                  <Image
                    source={require("../../../../assets/images/pressure.png")}
                    style={styles.metricIcon}
                  />
                  <Text style={styles.metricValue}>{roomMetrics.pressure}</Text>
                  <Text style={styles.metricLabel}>Давление</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.quickButtons}>
            <TouchableRipple
              onPress={() => navigation.navigate("UserControlRoom")}
              style={[styles.dashboardCard, { height: 120 }]}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 15,
                  height: "100%",
                }}
              >
                <Image
                  source={require("../../../../assets/images/access_control.png")}
                  style={[
                    styles.cardImg,
                    { width: 40, height: 40, marginBottom: 10 },
                  ]}
                />
                <Text style={styles.cardText}>Управление комнатой</Text>
              </View>
            </TouchableRipple>

            <TouchableRipple
              onPress={() => navigation.navigate("UserChatAI")}
              style={[
                styles.dashboardCard,
                { height: 120, overflow: "hidden" },
              ]}
            >
              <AnimatedGradient />
            </TouchableRipple>
          </View>

          <View style={styles.quickButtons}>
            <TouchableRipple
              onPress={() => navigation.navigate("UserOrderFood")}
              style={[styles.dashboardCard, { height: 120 }]}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 15,
                  height: "100%",
                }}
              >
                <Image
                  source={require("../../../../assets/images/food_order.png")}
                  style={[
                    styles.cardImg,
                    { width: 40, height: 40, marginBottom: 10 },
                  ]}
                />
                <Text style={styles.cardText}>Заказать еду</Text>
              </View>
            </TouchableRipple>

            <TouchableRipple
              onPress={() => navigation.navigate("UserCleanRoom")}
              style={[styles.dashboardCard, { height: 120 }]}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 15,
                  height: "100%",
                }}
              >
                <Image
                  source={require("../../../../assets/images/clean_room.png")}
                  style={[
                    styles.cardImg,
                    { width: 40, height: 40, marginBottom: 10 },
                  ]}
                />
                <Text style={styles.cardText}>Запросить уборку</Text>
              </View>
            </TouchableRipple>
          </View>
          <View style={[styles.quickButtons, { marginBottom: 30 }]}>
            <TouchableRipple
              onPress={() =>
                navigation.navigate("UserPaymentReceiptsDashboard")
              }
              style={[styles.dashboardMiniCard]}
            >
              <View
                style={{
                  alignItems: "center",
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                  height: "100%",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../../../../assets/images/payment_receipts.png")}
                  style={[styles.miniCardImg]}
                />
                <Text style={styles.miniCardText}>Подтвердить оплату</Text>
              </View>
            </TouchableRipple>

            <TouchableRipple
              onPress={() => navigation.navigate("UserComplainsDashboard")}
              style={[styles.dashboardMiniCard]}
            >
              <View
                style={{
                  alignItems: "center",
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                  height: "100%",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../../../../assets/images/complains.png")}
                  style={[styles.miniCardImg]}
                />
                <Text style={styles.miniCardText}>Жалобы</Text>
              </View>
            </TouchableRipple>

            <TouchableRipple
              onPress={() => navigation.navigate("UserAnnouncementsDashboard")}
              style={[styles.dashboardMiniCard]}
            >
              <View
                style={{
                  alignItems: "center",
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                  height: "100%",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../../../../assets/images/announcements.png")}
                  style={[styles.miniCardImg]}
                />
                <Text style={styles.miniCardText}>Объявления</Text>
              </View>
            </TouchableRipple>

            <TouchableRipple
              onPress={() => navigation.navigate("UserHostelRulesDashboard")}
              style={[styles.dashboardMiniCard]}
            >
              <View
                style={{
                  alignItems: "center",
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                  height: "100%",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../../../../assets/images/hostel_rules.png")}
                  style={[styles.miniCardImg]}
                />
                <Text style={styles.miniCardText}>Правила</Text>
              </View>
            </TouchableRipple>
          </View>
        </View>
      </View>

      <AttractionsSlider />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: white,
  },
  contentContainer: {
    flex: 1,
    width: "90%",
    alignItems: "center",
  },
  profileDetails: {
    width: "100%",
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    width: "90%",
    fontFamily: "Roboto Regular",
    fontSize: 16,
    marginVertical: 10,
  },
  profileText: {
    marginLeft: 20,
  },
  recentAnnouncement: {
    width: "100%",
    elevation: 5,
    padding: 15,
    backgroundColor: white,
    borderRadius: 12,
  },
  quickButtons: {
    width: "100%",
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dashboardCard: {
    width: "48%",
    backgroundColor: white,
    borderRadius: 12,
    elevation: 5,
  },
  dashboardMiniCard: {
    width: "23%",
    height: 80,
    backgroundColor: white,
    borderRadius: 12,
    elevation: 3,
  },
  timeCard: {
    width: "100%",
    backgroundColor: white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 5,
  },
  cardImg: {
    width: 60,
    height: 60,
  },
  cardText: {
    fontFamily: "fontBold",
    fontSize: 14,
    textAlign: "center",
  },
  metricsContainer: {
    width: "100%",
    backgroundColor: white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: "fontBold",
    fontSize: 18,
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  metricsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  metricCard: {
    backgroundColor: white,
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    width: "30%",
    elevation: 1,
  },
  metricIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  metricValue: {
    fontFamily: "fontBold",
    fontSize: 16,
    color: primaryBlue,
  },
  metricLabel: {
    fontFamily: "fontRegular",
    fontSize: 11,
    color: textDarkGray,
  },
  controlsContainer: {
    width: "100%",
    backgroundColor: white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  controlsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  controlCard: {
    backgroundColor: white,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    width: "48%",
    elevation: 1,
  },
  controlIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  controlLabel: {
    fontFamily: "fontRegular",
    fontSize: 14,
    color: textDarkGray,
    marginBottom: 10,
  },
  timeGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
  },
  timeMiniCard: {
    backgroundColor: white,
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    width: "23%",
    elevation: 2,
  },
  timeValue: {
    fontFamily: "fontBold",
    fontSize: 20,
    color: primaryBlue,
  },
  timeLabel: {
    fontFamily: "fontRegular",
    fontSize: 12,
    color: textDarkGray,
    marginTop: 2,
  },
  miniCardImg: {
    width: 24,
    height: 24,
    marginBottom: 5,
  },
  miniCardText: {
    fontFamily: "fontBold",
    fontSize: 10,
    textAlign: "center",
    lineHeight: 12,
  },
  roomInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  roomInfoText: {
    fontFamily: "fontRegular",
    fontSize: 14,
    color: textLightGray,
    marginLeft: 5,
  },
});

export default Dashboard;
