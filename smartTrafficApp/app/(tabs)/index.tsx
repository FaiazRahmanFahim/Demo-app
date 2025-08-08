import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  ScrollView,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

const { width } = Dimensions.get("window");

const HomeScreen: React.FC = () => {
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  const [destinationText, setDestinationText] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const locationData = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setLocation(locationData);
      setLoading(false);
    } catch (error) {
      console.error("Error getting location:", error);
      setLoading(false);
    }
  };

  const searchPlaces = async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Using our NestJS backend API with correct IP address
      const response = await fetch(
        `http://192.168.1.102:3000/api/places/search?query=${encodeURIComponent(
          query
        )}&country=bd`
      );

      const data = await response.json();

      if (data.status === "OK" && data.predictions) {
        setSearchResults(data.predictions);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching places:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const getPlaceDetails = async (placeId: string) => {
    try {
      // Using our NestJS backend API with correct IP address
      const response = await fetch(
        `http://192.168.1.102:3000/api/places/details/${placeId}`
      );

      const data = await response.json();

      if (data.status === "OK" && data.result && data.result.geometry) {
        const newDestination = {
          latitude: data.result.geometry.location.lat,
          longitude: data.result.geometry.location.lng,
        };

        setDestination(newDestination);

        if (location) {
          // Create a simple route between current location and destination
          const coordinates = [
            location,
            {
              latitude: (location.latitude + newDestination.latitude) / 2,
              longitude: (location.longitude + newDestination.longitude) / 2,
            },
            newDestination,
          ];

          setRouteCoordinates(coordinates);

          // Animate map to show the route
          if (mapRef.current) {
            mapRef.current.fitToCoordinates(coordinates, {
              edgePadding: { top: 100, right: 50, bottom: 200, left: 50 },
              animated: true,
            });
          }
        }

        setDestinationText("");
        setShowSearchBar(false);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error getting place details:", error);
      Alert.alert("Error", "Failed to get place details");
    }
  };

  const handleDestinationSelect = () => {
    if (destinationText.trim()) {
      // For demo purposes, use a fixed destination if no search results
      const newDestination = {
        latitude: 23.8103, // Dhaka, Bangladesh coordinates
        longitude: 90.4125,
      };

      setDestination(newDestination);

      if (location) {
        // Create a simple route between current location and destination
        const coordinates = [
          location,
          {
            latitude: (location.latitude + newDestination.latitude) / 2,
            longitude: (location.longitude + newDestination.longitude) / 2,
          },
          newDestination,
        ];

        setRouteCoordinates(coordinates);

        // Animate map to show the route
        if (mapRef.current) {
          mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 100, right: 50, bottom: 200, left: 50 },
            animated: true,
          });
        }
      }

      setDestinationText("");
      setShowSearchBar(false);
      setSearchResults([]);
    }
  };

  const clearRoute = () => {
    setDestination(null);
    setRouteCoordinates([]);
    setDestinationText("");
    setShowSearchBar(false);
    setSearchResults([]);
  };

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
    if (!showSearchBar) {
      setSearchResults([]);
    }
  };

  const handleSearchTextChange = (text: string) => {
    setDestinationText(text);
    searchPlaces(text);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Uber-style Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchBar} onPress={toggleSearchBar}>
          <View style={styles.locationRow}>
            <View style={styles.locationDot} />
            <Text style={styles.locationText}>Current Location</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.locationRow}>
            <View style={styles.destinationIcon}>
              <Text style={styles.destinationIconText}>📍</Text>
            </View>
            <Text style={styles.locationText}>
              {destination ? "Destination Set" : "Where to?"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Expanded Search Interface */}
        {showSearchBar && (
          <View style={styles.expandedSearch}>
            <View style={styles.searchInputContainer}>
              <View style={styles.inputRow}>
                <View style={styles.inputIcon}>
                  <Text style={styles.inputIconText}>📍</Text>
                </View>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search places in Bangladesh..."
                  value={destinationText}
                  onChangeText={handleSearchTextChange}
                  returnKeyType="search"
                  autoFocus={true}
                />
              </View>
            </View>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <ScrollView style={styles.searchResultsContainer}>
                {searchResults.map((result, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.searchResultItem}
                    onPress={() => getPlaceDetails(result.place_id)}
                  >
                    <Text style={styles.searchResultText}>
                      {result.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {isSearching && (
              <View style={styles.searchingContainer}>
                <Text style={styles.searchingText}>Searching...</Text>
              </View>
            )}

            {!isSearching &&
              searchResults.length === 0 &&
              destinationText.length > 1 && (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>No places found</Text>
                </View>
              )}

            <View style={styles.searchActions}>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleDestinationSelect}
              >
                <Text style={styles.searchButtonText}>Set Destination</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowSearchBar(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Route Actions */}
        {destination && !showSearchBar && (
          <View style={styles.routeActions}>
            <TouchableOpacity style={styles.clearButton} onPress={clearRoute}>
              <Text style={styles.clearButtonText}>Clear Route</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={
          location
            ? {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : {
                latitude: 23.8103, // Dhaka, Bangladesh
                longitude: 90.4125,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
        }
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        showsTraffic={true}
        mapType="standard"
      >
        {/* Current Location Marker */}
        {location && (
          <Marker
            coordinate={location}
            title="Your Location"
            description="Current position"
            pinColor="#FF6B35"
          />
        )}

        {/* Destination Marker */}
        {destination && (
          <Marker
            coordinate={destination}
            title="Destination"
            description="Selected destination"
            pinColor="#004E89"
          />
        )}

        {/* Route Polyline */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#FF6B35"
            strokeWidth={4}
          />
        )}
      </MapView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  searchContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  searchBar: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
    marginRight: 12,
  },
  destinationIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  destinationIconText: {
    fontSize: 10,
    color: "#ffffff",
  },
  locationText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  expandedSearch: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginTop: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    maxHeight: 400,
  },
  searchInputContainer: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  inputIconText: {
    fontSize: 10,
    color: "#ffffff",
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingHorizontal: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchResultsContainer: {
    maxHeight: 200,
    marginBottom: 16,
  },
  searchResultItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchResultText: {
    fontSize: 14,
    color: "#333",
  },
  searchingContainer: {
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  searchingText: {
    fontSize: 14,
    color: "#666",
  },
  noResultsContainer: {
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 14,
    color: "#666",
  },
  searchActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  searchButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#666",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  cancelButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  routeActions: {
    marginTop: 8,
  },
  clearButton: {
    backgroundColor: "#666",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  map: {
    flex: 1,
  },
});

export default HomeScreen;
