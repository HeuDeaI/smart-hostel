import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Linking,
} from "react-native";
import { WebView } from "react-native-webview";
import { TouchableRipple } from "react-native-paper";

const AttractionDetails = ({ route }) => {
  const { attraction } = route.params;

  const openInMaps = () => {
    const url = `https://yandex.ru/maps/?pt=${attraction.coordinates.longitude},${attraction.coordinates.latitude}&z=16`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={attraction.image} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{attraction.title}</Text>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Описание</Text>
          <Text style={styles.description}>{attraction.description}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Информация</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Адрес:</Text>
            <Text style={styles.infoValue}>{attraction.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Время работы:</Text>
            <Text style={styles.infoValue}>{attraction.workingHours}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Стоимость:</Text>
            <Text style={styles.infoValue}>{attraction.price}</Text>
          </View>
        </View>

        <TouchableRipple onPress={openInMaps} style={styles.mapButton}>
          <Text style={styles.mapButtonText}>Открыть на карте</Text>
        </TouchableRipple>

        <View style={styles.mapContainer}>
          <WebView
            source={{
              uri: `https://yandex.ru/maps/?pt=${attraction.coordinates.longitude},${attraction.coordinates.latitude}&z=16&l=map`,
            }}
            style={styles.map}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    width: 120,
  },
  infoValue: {
    fontSize: 16,
    flex: 1,
  },
  mapButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
  },
  mapButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  mapContainer: {
    height: 300,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
});

export default AttractionDetails;
