import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/core/theme/colors';
import { fontFamilies } from '@/core/theme/typography';

export type BannerType = 'error' | 'warning' | 'info' | 'success';

interface TopBannerNotificationProps {
  visible: boolean;
  message: string;
  type?: BannerType;
  duration?: number;
  onClose: () => void;
}

export function TopBannerNotification({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onClose,
}: TopBannerNotificationProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-120)).current;

  useEffect(() => {
    if (visible) {
      // Slide Down Animation
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 6,
      }).start();

      // Auto Close Timer
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      translateY.setValue(-120);
    }
  }, [visible, duration]);

  const handleDismiss = () => {
    Animated.timing(translateY, {
      toValue: -120,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  if (!visible && (translateY as any)._value === -120) {
    return null;
  }

  const getBannerStyle = () => {
    switch (type) {
      case 'error':
        return {
          bg: '#FEF2F2',
          border: '#FCA5A5',
          text: '#991B1B',
          icon: 'alert-circle' as const,
          iconColor: '#DC2626',
        };
      case 'warning':
        return {
          bg: '#FFFBEB',
          border: '#FDE68A',
          text: '#92400E',
          icon: 'warning' as const,
          iconColor: '#D97706',
        };
      case 'success':
        return {
          bg: '#ECFDF5',
          border: '#A7F3D0',
          text: '#065F46',
          icon: 'checkmark-circle' as const,
          iconColor: '#059669',
        };
      default:
        return {
          bg: '#F0FDFA',
          border: '#99F6E4',
          text: colors.darkGreen,
          icon: 'information-circle' as const,
          iconColor: colors.darkGreen,
        };
    }
  };

  const styleConfig = getBannerStyle();

  return (
    <Animated.View
      style={[
        styles.animatedContainer,
        {
          paddingTop: Math.max(insets.top + 6, 12),
          transform: [{ translateY }],
        },
      ]}
    >
      <View
        style={[
          styles.bannerCard,
          {
            backgroundColor: styleConfig.bg,
            borderColor: styleConfig.border,
          },
        ]}
      >
        <Ionicons name={styleConfig.icon} size={22} color={styleConfig.iconColor} />
        <Text style={[styles.messageText, { color: styleConfig.text }]}>{message}</Text>
        <TouchableOpacity onPress={handleDismiss} style={styles.closeBtn}>
          <Ionicons name="close" size={18} color={styleConfig.text} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  messageText: {
    flex: 1,
    fontSize: 13,
    fontFamily: fontFamilies.semiBold,
    lineHeight: 18,
  },
  closeBtn: {
    padding: 4,
  },
});
