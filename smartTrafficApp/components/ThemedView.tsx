// components/ThemedView.tsx
import * as React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';

// Simple wrapper around View, you can customize colors based on theme later
export function ThemedView({ style, ...otherProps }: ViewProps) {
  return <View style={[styles.default, style]} {...otherProps} />;
}

const styles = StyleSheet.create({
  default: {
    flex: 1,
    backgroundColor: '#fff', // light theme default
  },
});
