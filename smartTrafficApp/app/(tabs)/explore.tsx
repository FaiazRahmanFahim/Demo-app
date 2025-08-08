import React from "react";
import { View, StyleSheet, ScrollView, Text, SafeAreaView } from "react-native";

const ExploreScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Smart Emergency Traffic Management</Text>
          <Text style={styles.subtitle}>Simple Map Interface</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🗺️ Map Features</Text>
          <Text style={styles.description}>
            • Real-time location tracking • Destination search and routing •
            Route visualization with polylines • Traffic information display •
            Interactive map controls
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔍 How to Use</Text>
          <Text style={styles.description}>
            1. Allow location permissions when prompted 2. Enter a destination
            in the search bar 3. Tap "Search" to set the destination 4. View the
            route on the map 5. Use "Clear" to remove the route
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 App Features</Text>
          <Text style={styles.description}>
            • Google Maps integration • Current location detection • Route
            planning and display • Clean and simple interface • Cross-platform
            compatibility
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Built with React Native Expo • Google Maps API
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212121",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
  },
  section: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#757575",
    lineHeight: 20,
  },
  footer: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#757575",
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default ExploreScreen;
