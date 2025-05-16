import { useState, useCallback, useContext, useEffect } from "react";
import { View, Text, Image, RefreshControl, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { white, textLightGray } from "../../../constants/Colors";
import { Button, Avatar, TouchableRipple, Switch } from "react-native-paper";
import { useTranslation } from "../../../i18n/I18nProvider";
import { primaryBlue, textDarkGray } from "../../../constants/Colors";
import axios from "axios";
import { baseUrl } from "../../../config/BaseUrl";

import { AuthContext } from "../../../context/AuthContext";

const Dashboard = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [lightOn, setLightOn] = useState(false);
  const [doorLocked, setDoorLocked] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
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
    pressure: 760
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
      console.error('Error fetching rent end date:', err);
      //setError('Failed to fetch rent end date');
      // Set a default date in case of error (optional)
      setRentEndDate("2025-05-20T12:00:00");
      console.log(rentEndDate);
    }
  };

  useEffect(() => {
    fetchRentEndDate();
  }, [userToken]);

  useEffect(() => {
    if (!rentEndDate) return;

    const calculateTimeLeft = () => {
      const difference = new Date(rentEndDate).getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
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
    fetchRentEndDate().finally(() => {
      setRefreshing(false);
    });
  }, []);

  const toggleLight = () => {
    setLightOn(!lightOn);
    // Здесь будет API запрос на управление светом
  };

  const toggleDoor = () => {
    setDoorLocked(!doorLocked);
    // Здесь будет API запрос на управление дверью
    // light_on
    // 
  };

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
            </View>
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
                <Text style={styles.metricValue}>{roomMetrics.temperature}°C</Text>
                <Text style={styles.metricLabel}>Температура</Text>
              </View>
              
              <View style={styles.metricCard}>
                <Image
                  source={require("../../../../assets/images/humidity.png")}
                  style={styles.metricIcon}
                />
                <Text style={styles.metricValue}>{roomMetrics.humidity}%</Text>
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
              onPress={() => navigation.navigate("UserRoomsDashboard")}
              style={styles.dashboardCard}
            >
              <View
                style={{
                  alignItems: "center",
                  paddingHorizontal: 15,
                  paddingVertical: 20,
                }}
              >
                <Image
                  source={require("../../../../assets/images/room_management.png")}
                  style={[styles.cardImg, { marginVertical: 10 }]}
                />
                <Text style={styles.cardText}>{t("user.booking.newBooking")}</Text>
              </View>
            </TouchableRipple>

            <TouchableRipple
              onPress={() =>
                navigation.navigate("UserRoomsAcceptanceDashboard")
              }
              style={styles.dashboardCard}
            >
              <View
                style={{
                  alignItems: "center",
                  paddingHorizontal: 15,
                  paddingVertical: 20,
                }}
              >
                <Image
                  source={require("../../../../assets/images/accepted_requests.png")}
                  style={styles.cardImg}
                />
                <Text style={styles.cardText}>Room Acceptance</Text>
              </View>
            </TouchableRipple>
          </View>
          <View style={styles.quickButtons}>
          <TouchableRipple
              onPress={() => navigation.navigate("UserHostelRulesDashboard")}
              style={styles.dashboardCard}
            >
              <View
                style={{
                  alignItems: "center",
                  paddingHorizontal: 15,
                  paddingVertical: 20,
                }}
              >
                <Image
                  source={require("../../../../assets/images/control_electricity.png")}
                  style={styles.cardImg}
                />
                <Text style={styles.cardText}>Управление светом</Text>
              </View>
            </TouchableRipple>
            
            
            <TouchableRipple
              onPress={() => navigation.navigate("UserHostelRulesDashboard")}
              style={styles.dashboardCard}
            >
              <View
                style={{
                  alignItems: "center",
                  paddingHorizontal: 15,
                  paddingVertical: 20,
                }}
              >
                <Image
                  source={require("../../../../assets/images/access_control.png")}
                  style={styles.cardImg}
                />
                <Text style={styles.cardText}>Управление доступом</Text>
              </View>
            </TouchableRipple>
          </View>
          <View style={styles.quickButtons}>
            <TouchableRipple
              onPress={() =>
                navigation.navigate("UserPaymentReceiptsDashboard")
              }
              style={styles.dashboardCard}
            >
              <View
                style={{
                  alignItems: "center",
                  paddingHorizontal: 15,
                  paddingVertical: 20,
                }}
              >
                <Image
                  source={require("../../../../assets/images/payment_receipts.png")}
                  style={styles.cardImg}
                />
                <Text style={styles.cardText}>Payment Receipts</Text>
              </View>
            </TouchableRipple>

            <TouchableRipple
              onPress={() => navigation.navigate("UserComplainsDashboard")}
              style={styles.dashboardCard}
            >
              <View
                style={{
                  alignItems: "center",
                  paddingHorizontal: 15,
                  paddingVertical: 20,
                }}
              >
                <Image
                  source={require("../../../../assets/images/complains.png")}
                  style={[styles.cardImg, { marginVertical: 10 }]}
                />
                <Text style={styles.cardText}>Complains</Text>
              </View>
            </TouchableRipple>
          </View>
          
          <View style={[styles.quickButtons, { marginBottom: 15 }]}>
            <TouchableRipple
              onPress={() => navigation.navigate("UserAnnouncementsDashboard")}
              style={styles.dashboardCard}
            >
              <View
                style={{
                  alignItems: "center",
                  paddingHorizontal: 15,
                  paddingVertical: 20,
                }}
              >
                <Image
                  source={require("../../../../assets/images/announcements.png")}
                  style={[styles.cardImg, { marginVertical: 10 }]}
                />
                <Text style={styles.cardText}>Announcements</Text>
              </View>
            </TouchableRipple>

            <TouchableRipple
              onPress={() => navigation.navigate("UserHostelRulesDashboard")}
              style={styles.dashboardCard}
            >
              <View
                style={{
                  alignItems: "center",
                  paddingHorizontal: 15,
                  paddingVertical: 20,
                }}
              >
                <Image
                  source={require("../../../../assets/images/hostel_rules.png")}
                  style={styles.cardImg}
                />
                <Text style={styles.cardText}>Hostel Rules</Text>
              </View>
            </TouchableRipple>

            
          </View>

         

          {/* Блок управления */}
          <View style={styles.controlsContainer}>
            <Text style={styles.sectionTitle}>
              Управление комнатой:
            </Text>
            <View style={styles.controlsGrid}>
              <View style={styles.controlCard}>
                <Image
                  source={require("../../../../assets/images/control_electricity.png")}
                  style={styles.controlIcon}
                />
                <Text style={styles.controlLabel}>Освещение</Text>
                <Switch
                  value={lightOn}
                  onValueChange={toggleLight}
                  color={primaryBlue}
                />
              </View>
              
              <View style={styles.controlCard}>
                <Image
                  source={require("../../../../assets/images/door.png")}
                  style={styles.controlIcon}
                />
                <Text style={styles.controlLabel}>Дверь</Text>
                <Switch
                  value={!doorLocked}
                  onValueChange={toggleDoor}
                  color={primaryBlue}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
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
    alignItems: "center",
    justifyContent: "center",
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
    borderRadius: 16,
    elevation: 5,
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
  },
  cardText: {
    fontFamily: "fontBold",
    fontSize: 16,
    marginTop: 5,
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
    alignSelf: 'flex-start',
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
});

export default Dashboard;
