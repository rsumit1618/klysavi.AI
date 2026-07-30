import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';
import { fontFamilies } from '@/core/theme/typography';

interface AppActionButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  disabled?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function AppActionButton({
  title,
  loading = false,
  disabled = false,
  iconName,
  variant = 'primary',
  style,
  textStyle,
  onPress,
  ...props
}: AppActionButtonProps) {
  const isInactive = disabled || loading;

  const getContainerStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryContainer;
      case 'outline':
        return styles.outlineContainer;
      case 'primary':
      default:
        return styles.primaryContainer;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'primary':
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.buttonBase,
        getContainerStyle(),
        isInactive && styles.disabledContainer,
        style,
      ]}
      onPress={onPress}
      disabled={isInactive}
      activeOpacity={0.85}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.darkGreen : colors.darkGreen} size="small" />
      ) : (
        <>
          <Text style={[getTextStyle(), isInactive && styles.disabledText, textStyle]}>
            {title}
          </Text>
          {iconName && (
            <Ionicons
              name={iconName}
              size={18}
              color={isInactive ? '#A0AEC0' : variant === 'outline' ? colors.darkGreen : colors.darkGreen}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 10,
  },
  primaryContainer: {
    backgroundColor: colors.buttonYellow,
    shadowColor: colors.buttonYellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  secondaryContainer: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.darkGreen,
  },
  disabledContainer: {
    backgroundColor: '#E2E8F0',
    borderColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryText: {
    fontSize: 14,
    fontFamily: fontFamilies.extraBold,
    letterSpacing: 1.1,
    color: colors.darkGreen,
  },
  secondaryText: {
    fontSize: 14,
    fontFamily: fontFamilies.extraBold,
    letterSpacing: 1.1,
    color: colors.textDark,
  },
  outlineText: {
    fontSize: 14,
    fontFamily: fontFamilies.extraBold,
    letterSpacing: 1.1,
    color: colors.darkGreen,
  },
  disabledText: {
    color: '#A0AEC0',
  },
});
