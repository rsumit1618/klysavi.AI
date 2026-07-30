import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

import { colors } from '@/core/theme/colors';
import { fontFamilies } from '@/core/theme/typography';
import { sideMenuStyles, DRAWER_WIDTH, EXTRA_LEFT_OVERHANG } from './side-menu-drawer.styles';
import { useSession } from '@/features/auth/presentation/session-provider';
import { useTheme } from '@/core/theme/theme-context';
import {
  getUserDataFromSecureStore,
  getInitials,
  ExtendedUserProfile,
} from '@/core/services/secure-storage-service';

interface SideMenuDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const TOTAL_SLIDE_DISTANCE = DRAWER_WIDTH + EXTRA_LEFT_OVERHANG;

export function SideMenuDrawer({ visible, onClose }: SideMenuDrawerProps) {
  const router = useRouter();
  const { session, signOut } = useSession();
  const { isDark, toggleTheme } = useTheme();

  const [userProfile, setUserProfile] = useState<ExtendedUserProfile | null>(null);
  const [renderModal, setRenderModal] = useState(visible);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await signOut();
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
      onClose();
    }
  };

  const slideAnim = useRef(new Animated.Value(-TOTAL_SLIDE_DISTANCE)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function fetchProfile() {
      const stored = await getUserDataFromSecureStore();
      if (stored) {
        setUserProfile(stored);
      }
    }

    if (visible) {
      fetchProfile();
      setRenderModal(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -TOTAL_SLIDE_DISTANCE,
          duration: 200,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => setRenderModal(false));
    }
  }, [visible]);

  const handleNavigate = (route: string) => {
    onClose();
    setTimeout(() => {
      router.push(route as any);
    }, 150);
  };

  const displayName = userProfile?.fullName || session?.displayName || 'Valued User';
  const profileImage = userProfile?.profileImage;

  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    setImageLoadError(false);
  }, [profileImage]);

  if (!renderModal && !visible) return null;

  return (
    <Modal visible={renderModal} transparent statusBarTranslucent animationType="none" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        {/* Animated Fade Backdrop */}
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[sideMenuStyles.overlay, { opacity: fadeAnim }]} />
        </TouchableWithoutFeedback>

        {/* Animated Slide Drawer */}
        <Animated.View
          style={[
            sideMenuStyles.drawerContainer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Header User Row */}
          <View>
            <View style={sideMenuStyles.headerRow}>
              <TouchableOpacity onPress={() => handleNavigate('/user-profile')} activeOpacity={0.85}>
                {profileImage && !imageLoadError ? (
                  <Image
                    source={{ uri: profileImage }}
                    onError={() => setImageLoadError(true)}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      borderWidth: 2,
                      borderColor: colors.gold
                    }}
                  />
                ) : (
                  <View style={sideMenuStyles.avatarCircle}>
                    {displayName && displayName !== 'Valued User' ? (
                      <Text style={sideMenuStyles.avatarText}>{getInitials(displayName)}</Text>
                    ) : (
                      <Ionicons name="person" size={24} color={colors.gold} />
                    )}
                  </View>
                )}
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={sideMenuStyles.greetingSub}>Hello and welcome,</Text>
                <Text style={sideMenuStyles.greetingName} numberOfLines={1}>
                  {displayName}
                </Text>
              </View>
            </View>

            {/* Menu Items List */}
            <View style={sideMenuStyles.menuList}>
              {/* 1. My Profile */}
              <TouchableOpacity
                style={sideMenuStyles.menuItem}
                onPress={() => handleNavigate('/user-profile')}
                activeOpacity={0.7}
              >
                <Ionicons name="person-outline" size={22} color={colors.darkGreen} />
                <Text style={sideMenuStyles.menuItemText}>My Profile</Text>
              </TouchableOpacity>

              {/* 3. Notification Center */}
              <TouchableOpacity
                style={sideMenuStyles.menuItem}
                onPress={() => handleNavigate('/(main)/notifications')}
                activeOpacity={0.7}
              >
                <Ionicons name="mail-unread-outline" size={22} color={colors.darkGreen} />
                <Text style={sideMenuStyles.menuItemText}>Notification Center</Text>
              </TouchableOpacity>

              {/* 4. Branch Locator */}
              <TouchableOpacity
                style={sideMenuStyles.menuItem}
                onPress={() => handleNavigate('/(main)/branches')}
                activeOpacity={0.7}
              >
                <Ionicons name="location-outline" size={22} color={colors.darkGreen} />
                <Text style={sideMenuStyles.menuItemText}>Branch Locator</Text>
              </TouchableOpacity>

              {/* 5. Contact Us */}
              <TouchableOpacity
                style={sideMenuStyles.menuItem}
                onPress={() => handleNavigate('/(main)/contact-us')}
                activeOpacity={0.7}
              >
                <Ionicons name="call-outline" size={22} color={colors.darkGreen} />
                <Text style={sideMenuStyles.menuItemText}>Contact Us</Text>
              </TouchableOpacity>

              {/* 6. Theme Mode Toggle */}
              <TouchableOpacity
                style={sideMenuStyles.menuItem}
                onPress={toggleTheme}
                activeOpacity={0.7}
              >
                <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={22} color={colors.darkGreen} />
                <Text style={sideMenuStyles.menuItemText}>{isDark ? 'Light Theme' : 'Dark Theme'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout Action at Bottom */}
          <View style={{ width: '100%', alignItems: 'center' }}>
            <TouchableOpacity
              style={sideMenuStyles.logoutButton}
              onPress={handleLogout}
              disabled={isLoggingOut}
              activeOpacity={0.85}
            >
              {isLoggingOut ? (
                <ActivityIndicator size="small" color="#111518" />
              ) : (
                <>
                  <Ionicons name="log-out-outline" size={20} color="#111518" />
                  <Text style={sideMenuStyles.logoutText}>Logout</Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={{ fontSize: 11, fontFamily: fontFamilies.medium, color: colors.textMuted, marginTop: 12, textAlign: 'center' }}>
              Klysavo AI v{Constants.expoConfig?.version || '1.0.0'}
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
