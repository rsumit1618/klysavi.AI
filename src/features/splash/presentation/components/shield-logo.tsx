import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

interface ShieldLogoProps {
  size?: number;
}

export function ShieldLogo({ size = 120 }: ShieldLogoProps) {
  const borderRadius = Math.round(size * 0.22);

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius }]}>
      <Image
        source={require('../../../../../assets/images/app_icon_logo.jpg')}
        style={{ width: size, height: size, borderRadius }}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
});
