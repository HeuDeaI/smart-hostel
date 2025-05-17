import { View, Text, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  black,
  lightGray,
  primaryBlue,
  white,
} from "../../../../constants/Colors";
import { Button } from "react-native-paper";
import { useEffect, useState } from "react";
import { getRoomInfo } from "../../../../services/roomService";

const RoomDetails = ({ navigation, route }) => {
  const { roomId } = route.params || {};
  const [roomInfo, setRoomInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomInfo = async () => {
      if (!roomId) {
        setError("No room ID provided");
        setLoading(false);
        return;
      }

      try {
        const data = await getRoomInfo(roomId);
        setRoomInfo(data);
      } catch (err) {
        setError("Failed to load room information");
        console.error("Error fetching room info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomInfo();
  }, [roomId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!roomInfo) {
    return (
      <View style={styles.container}>
        <Text>No room information available</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ backgroundColor: white, minHeight: "100%" }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Room Details</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Room Number:</Text>
            <Text style={styles.infoValue}>{roomInfo.number}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Type:</Text>
            <Text style={styles.infoValue}>{roomInfo.type}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text style={styles.infoValue}>
              {roomInfo.isOccupied ? "Occupied" : "Available"}
            </Text>
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
    paddingVertical: 20,
  },
  title: {
    width: "90%",
    fontFamily: "Roboto Regular",
    fontSize: 24,
    marginVertical: 20,
    textAlign: "center",
  },
  infoContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: lightGray,
  },
  infoLabel: {
    fontFamily: "Roboto Regular",
    fontSize: 16,
    color: black,
  },
  infoValue: {
    fontFamily: "Roboto Regular",
    fontSize: 16,
    color: primaryBlue,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});

export default RoomDetails;
