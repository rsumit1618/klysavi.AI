import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/core/theme/colors';
import { appHeaderStyles } from './app-header.styles';
import { ShieldLogo } from '@/features/splash/presentation/components/shield-logo';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showMenu?: boolean;
  showAvatar?: boolean;
  showLogo?: boolean;
  onBackPress?: () => void;
  onMenuPress?: () => void;
  onAvatarPress?: () => void;
  rightElement?: React.ReactNode;
}

export function AppHeader({
  title,
  subtitle,
  showBack = false,
  showMenu = false,
  showAvatar = false,
  showLogo = false,
  onBackPress,
  onMenuPress,
  onAvatarPress,
  rightElement,
}: AppHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(main)/home');
    }
  };

  const hasLeftButton = showBack || showMenu || showAvatar;

  return (
    <View style={hasLeftButton ? appHeaderStyles.headerRowBack : appHeaderStyles.headerRow}>
      {/* 1. LEFT COLUMN — only rendered when a button is shown so title
          starts flush at paddingLeft: 20 (same as home hamburger) when empty */}
      {hasLeftButton && (
        <View style={appHeaderStyles.headerLeft}>
          {showBack && (
            <TouchableOpacity style={appHeaderStyles.iconBtn} onPress={handleBack} activeOpacity={0.8}>
              <Ionicons name="chevron-back" size={24} color={colors.textDark} />
            </TouchableOpacity>
          )}
          {showMenu && (
            <TouchableOpacity style={appHeaderStyles.iconBtn} onPress={onMenuPress} activeOpacity={0.8}>
              <Ionicons name="menu-outline" size={24} color={colors.textDark} />
            </TouchableOpacity>
          )}
          {showAvatar && (
            <TouchableOpacity
              style={appHeaderStyles.iconBtn}
              onPress={onAvatarPress || (() => router.push('/user-profile'))}
              activeOpacity={0.8}
            >
              <Ionicons name="person-outline" size={20} color={colors.textDark} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* 2. TITLE COLUMN — left-aligned on tab screens, centered on back-button screens */}
      <View
        style={hasLeftButton ? appHeaderStyles.titleColCentered : appHeaderStyles.titleCol}
        pointerEvents={hasLeftButton ? 'none' : 'box-none'}
      >
        {title ? (
          <Text
            style={hasLeftButton ? appHeaderStyles.titleTextCentered : appHeaderStyles.titleText}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text style={appHeaderStyles.subtitleText} numberOfLines={1} adjustsFontSizeToFit>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {/* 3. RIGHT COLUMN */}
      <View style={appHeaderStyles.headerRight}>
        {rightElement ? (
          rightElement
        ) : showLogo ? (
          <ShieldLogo size={36} />
        ) : null}
      </View>
    </View>
  );
}
