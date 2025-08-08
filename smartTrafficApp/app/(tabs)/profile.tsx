import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "emergency_responder" | "traffic_controller" | "admin" | "user";
  organization: string;
  avatar?: string;
}

const ProfileScreen: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    organization: "",
    role: "user" as User["role"],
  });

  // Settings states
  const [settings, setSettings] = useState({
    notifications: true,
    locationSharing: true,
    emergencyAlerts: true,
    darkMode: false,
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUser(user);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (isSignUp && !formData.name) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (isSignUp) {
        // Simulate signup
        const newUser: User = {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          organization: formData.organization,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            formData.name
          )}&background=FF6B35&color=fff`,
        };

        await AsyncStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
        setIsLoggedIn(true);
        Alert.alert("Success", "Account created successfully!");
      } else {
        // Simulate signin
        const mockUser: User = {
          id: "1",
          name: "Demo User",
          email: formData.email,
          phone: "+880 1234567890",
          role: "emergency_responder",
          organization: "Emergency Services",
          avatar:
            "https://ui-avatars.com/api/?name=Demo+User&background=FF6B35&color=fff",
        };

        await AsyncStorage.setItem("user", JSON.stringify(mockUser));
        setUser(mockUser);
        setIsLoggedIn(true);
        Alert.alert("Success", "Signed in successfully!");
      }

      setShowAuthForm(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        organization: "",
        role: "user",
      });
    } catch (error) {
      Alert.alert("Error", "Authentication failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
      setIsLoggedIn(false);
      Alert.alert("Success", "Logged out successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to logout");
    }
  };

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {!isLoggedIn ? (
          // Auth Section
          <View style={styles.authSection}>
            {!showAuthForm ? (
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeTitle}>
                  Welcome to Smart Traffic
                </Text>
                <Text style={styles.welcomeSubtitle}>
                  Sign in to access your profile and settings
                </Text>
                <TouchableOpacity
                  style={styles.authButton}
                  onPress={() => {
                    setShowAuthForm(true);
                    setIsSignUp(false);
                  }}
                >
                  <Text style={styles.authButtonText}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.authButton, styles.signUpButton]}
                  onPress={() => {
                    setShowAuthForm(true);
                    setIsSignUp(true);
                  }}
                >
                  <Text
                    style={[styles.authButtonText, styles.signUpButtonText]}
                  >
                    Create Account
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Auth Form
              <View style={styles.authForm}>
                <Text style={styles.formTitle}>
                  {isSignUp ? "Create Account" : "Sign In"}
                </Text>

                {isSignUp && (
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={formData.name}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, name: text }))
                    }
                  />
                )}

                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={formData.email}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, email: text }))
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                {isSignUp && (
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, phone: text }))
                    }
                    keyboardType="phone-pad"
                  />
                )}

                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={formData.password}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, password: text }))
                  }
                  secureTextEntry
                />

                {isSignUp && (
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChangeText={(text) =>
                      setFormData((prev) => ({
                        ...prev,
                        confirmPassword: text,
                      }))
                    }
                    secureTextEntry
                  />
                )}

                {isSignUp && (
                  <>
                    <TextInput
                      style={styles.input}
                      placeholder="Organization (Optional)"
                      value={formData.organization}
                      onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, organization: text }))
                      }
                    />

                    <View style={styles.roleContainer}>
                      <Text style={styles.roleLabel}>Role:</Text>
                      <View style={styles.roleButtons}>
                        {[
                          "user",
                          "emergency_responder",
                          "traffic_controller",
                        ].map((role) => (
                          <TouchableOpacity
                            key={role}
                            style={[
                              styles.roleButton,
                              formData.role === role && styles.roleButtonActive,
                            ]}
                            onPress={() =>
                              setFormData((prev) => ({
                                ...prev,
                                role: role as User["role"],
                              }))
                            }
                          >
                            <Text
                              style={[
                                styles.roleButtonText,
                                formData.role === role &&
                                  styles.roleButtonTextActive,
                              ]}
                            >
                              {role.replace("_", " ").toUpperCase()}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </>
                )}

                <View style={styles.authActions}>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleAuth}
                  >
                    <Text style={styles.submitButtonText}>
                      {isSignUp ? "Create Account" : "Sign In"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowAuthForm(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ) : (
          // Profile Section
          <View style={styles.profileSection}>
            {/* User Info */}
            <View style={styles.userInfo}>
              <Image source={{ uri: user?.avatar }} style={styles.avatar} />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user?.name}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
                <Text style={styles.userRole}>
                  {user?.role.replace("_", " ").toUpperCase()}
                </Text>
                {user?.organization && (
                  <Text style={styles.userOrg}>{user.organization}</Text>
                )}
              </View>
            </View>

            {/* Settings */}
            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>Settings</Text>

              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Switch
                  value={settings.notifications}
                  onValueChange={(value) =>
                    updateSetting("notifications", value)
                  }
                  trackColor={{ false: "#767577", true: "#FF6B35" }}
                  thumbColor={settings.notifications ? "#fff" : "#f4f3f4"}
                />
              </View>

              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Location Sharing</Text>
                <Switch
                  value={settings.locationSharing}
                  onValueChange={(value) =>
                    updateSetting("locationSharing", value)
                  }
                  trackColor={{ false: "#767577", true: "#FF6B35" }}
                  thumbColor={settings.locationSharing ? "#fff" : "#f4f3f4"}
                />
              </View>

              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Emergency Alerts</Text>
                <Switch
                  value={settings.emergencyAlerts}
                  onValueChange={(value) =>
                    updateSetting("emergencyAlerts", value)
                  }
                  trackColor={{ false: "#767577", true: "#FF6B35" }}
                  thumbColor={settings.emergencyAlerts ? "#fff" : "#f4f3f4"}
                />
              </View>

              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Switch
                  value={settings.darkMode}
                  onValueChange={(value) => updateSetting("darkMode", value)}
                  trackColor={{ false: "#767577", true: "#FF6B35" }}
                  thumbColor={settings.darkMode ? "#fff" : "#f4f3f4"}
                />
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionsSection}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Change Password</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Privacy Policy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Terms of Service</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.logoutButton]}
                onPress={handleLogout}
              >
                <Text
                  style={[styles.actionButtonText, styles.logoutButtonText]}
                >
                  Sign Out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212121",
  },
  authSection: {
    padding: 20,
  },
  welcomeSection: {
    alignItems: "center",
    paddingVertical: 40,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
    marginBottom: 30,
  },
  authButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 15,
    width: "100%",
    alignItems: "center",
  },
  authButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  signUpButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#FF6B35",
  },
  signUpButtonText: {
    color: "#FF6B35",
  },
  authForm: {
    padding: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  roleContainer: {
    marginBottom: 20,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 10,
  },
  roleButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  roleButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#f9f9f9",
  },
  roleButtonActive: {
    backgroundColor: "#FF6B35",
    borderColor: "#FF6B35",
  },
  roleButtonText: {
    fontSize: 12,
    color: "#757575",
    fontWeight: "500",
  },
  roleButtonTextActive: {
    color: "#ffffff",
  },
  authActions: {
    gap: 15,
  },
  submitButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#666",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  profileSection: {
    padding: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 4,
  },
  userRole: {
    fontSize: 12,
    color: "#FF6B35",
    fontWeight: "600",
    marginBottom: 4,
  },
  userOrg: {
    fontSize: 12,
    color: "#757575",
  },
  settingsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingLabel: {
    fontSize: 16,
    color: "#212121",
  },
  actionsSection: {
    gap: 15,
  },
  actionButton: {
    backgroundColor: "#f9f9f9",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  actionButtonText: {
    color: "#212121",
    fontSize: 16,
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "#ffebee",
    borderColor: "#f44336",
  },
  logoutButtonText: {
    color: "#f44336",
  },
});

export default ProfileScreen;
