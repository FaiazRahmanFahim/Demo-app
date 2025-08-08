import * as React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

export function ThemedText({ style, ...otherProps }: TextProps) {
  return <Text style={[styles.default, style]} {...otherProps} />;
}

const styles = StyleSheet.create({
  default: {
    color: '#000', // light theme default
    fontSize: 16,
  },
});