import {
  black,
  darkGreen,
  darkRed,
  lightGray,
  primaryBlue,
  textDarkGray,
  white,
} from "../../../constants/Colors";
import { useState, useCallback, useContext, useEffect } from "react";
import { View, Text, Image, RefreshControl, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Avatar, TouchableRipple, Switch } from "react-native-paper";
import { useTranslation } from "../../../i18n/I18nProvider";

import axios from "axios";
import { baseUrl2 } from "../../../config/BaseUrl";

import { AuthContext } from "../../../context/AuthContext";

const ControlRoom = ({ navigation }) => {
  const [lightOn, setLightOn] = useState(false);
  const [doorLocked, setDoorLocked] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInitialState = async () => {
    try {
      const [lightResponse, doorResponse] = await Promise.all([
        axios.get(`${baseUrl2}/light`),
        axios.get(`${baseUrl2}/door`),
      ]);

      setLightOn(lightResponse.light);
      setDoorLocked(!doorResponse.door); // Inverting because doorLocked is opposite of door state
    } catch (error) {
      console.error("Error fetching initial state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialState();
  }, []);

  const toggleLight = async () => {
    try {
      const newState = !lightOn;
      await axios.post(`${baseUrl2}/light`, { state: newState });
      setLightOn(newState);
    } catch (error) {
      console.error("Error toggling light:", error);
    }
  };

  const toggleDoor = async () => {
    try {
      const newState = !doorLocked;
      await axios.post(`${baseUrl2}/door`, { state: newState });
      setDoorLocked(newState);
    } catch (error) {
      console.error("Error toggling door:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: white, minHeight: "100%" }}>
      <View style={styles.controlsContainer}>
        <Text style={styles.sectionTitle}>Управление комнатой:</Text>
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </View>
        </View>
      </View>
    </View>
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
    width: "100%",
    alignItems: "center",
  },
  reqRoomTitle: {
    marginVertical: 8,
    fontFamily: "fontBold",
    fontSize: 18,
  },
  formContainer: {
    width: "90%",
  },
  form: {
    width: "100%",
  },
  errorText: {
    color: darkRed,
    fontFamily: "fontRegular",
    fontSize: 16,
    marginTop: 3,
  },
  datesWrapper: {
    width: "100%",
    marginBottom: 8,
  },
  dateContainer: {
    width: "100%",
    minHeight: 80,
    zIndex: 1,
  },
  dateInput: {
    backgroundColor: white,
    width: "100%",
  },
  modalContainer: {
    backgroundColor: white,
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "fontBold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    fontFamily: "fontRegular",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    minWidth: 100,
  },
  controlsContainer: {
    width: "100%",
    backgroundColor: white,
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
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
  sectionTitle: {
    fontFamily: "fontBold",
    fontSize: 18,
    alignSelf: "flex-start",
    marginBottom: 15,
  },
});

export default ControlRoom;
