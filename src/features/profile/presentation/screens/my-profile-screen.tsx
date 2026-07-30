import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  BackHandler,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

import { colors } from '@/core/theme/colors';
import { fontFamilies } from '@/core/theme/typography';
import { myProfileStyles } from './my-profile-screen.styles';
import { AppHeader } from '@/shared/components/app-header';
import {
  getInitials,
} from '@/core/services/secure-storage-service';
import { UnderlineInputField } from '@/shared/components/underline-input-field';
import { TopBannerNotification, BannerType } from '@/shared/components/top-banner-notification';
import { useTheme } from '@/core/theme/theme-context';

import { useProfileViewModel } from '../viewmodels/use-profile-view-model';

export function MyProfileScreen() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const {
    session,
    userProfile,
    loading,
    addressModalVisible,
    setAddressModalVisible,
    buildingText: building,
    setBuildingText: setBuilding,
    roadText: roadStreet,
    setRoadText: setRoadStreet,
    blockText: blockArea,
    setBlockText: setBlockArea,
    cityText: city,
    setCityText: setCity,
    handleUpdateProfileImage,
    handleSaveAddress,
  } = useProfileViewModel();

  // Top Banner Notification State
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerType, setBannerType] = useState<BannerType>('info');

  const showTopBanner = (message: string, type: BannerType = 'info') => {
    setBannerMessage(message);
    setBannerType(type);
    setBannerVisible(true);
  };

  // Photo Action Sheet Modal State
  const [photoPickerVisible, setPhotoPickerVisible] = useState(false);
  const [renderModal, setRenderModal] = useState(false);

  // 60fps Native Animations for Action Sheet
  const translateY = useRef(new Animated.Value(300)).current;
  const fadeOpacity = useRef(new Animated.Value(0)).current;

  const mainScrollViewRef = useRef<ScrollView>(null);

  // Reset scroll position to top whenever screen gains focus
  useFocusEffect(
    useCallback(() => {
      mainScrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(main)/home');
    }
  };

  useEffect(() => {
    const onBackPress = () => {
      handleBack();
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [handleBack]);

  useEffect(() => {
    if (photoPickerVisible) {
      setRenderModal(true);
      Animated.parallel([
        Animated.timing(fadeOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (renderModal) {
      Animated.parallel([
        Animated.timing(fadeOpacity, {
          toValue: 0,
          duration: 180,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 300,
          duration: 200,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setRenderModal(false);
      });
    }
  }, [photoPickerVisible, renderModal, fadeOpacity, translateY]);

  const closePhotoPicker = () => {
    setPhotoPickerVisible(false);
  };

  const onUpdateImage = async (uri: string | null, fallbackBase64?: string) => {
    const result = await handleUpdateProfileImage(uri, fallbackBase64);
    if (result?.success) {
      showTopBanner('Profile photo updated successfully!', 'success');
    } else {
      // Display the specific error message from the ViewModel
      showTopBanner(result?.error || 'Failed to update profile photo.', 'warning');
    }
  };

  // 1. Camera Capture — Aggressive compression as fallback
  const handleTakePhoto = async () => {
    closePhotoPicker();
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      showTopBanner('Please grant camera access to take a profile photo.', 'warning');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2, // Aggressive compression as safety net
      base64: true, // Provide base64 as fallback for ViewModel
      exif: false,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      await onUpdateImage(result.assets[0].uri, result.assets[0].base64 || undefined);
    }
  };

  // 2. Select from Library — Aggressive compression as fallback
  const handleSelectFromLibrary = async () => {
    closePhotoPicker();
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showTopBanner('Please grant photo library access to select a profile photo.', 'warning');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2, // Aggressive compression as safety net
      base64: true, // Provide base64 as fallback for ViewModel
      exif: false,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      await onUpdateImage(result.assets[0].uri, result.assets[0].base64 || undefined);
    }
  };

  // 3. Remove Photo
  const handleRemovePhoto = async () => {
    closePhotoPicker();
    const result = await handleUpdateProfileImage(null);
    if (result?.success) {
      showTopBanner('Profile photo removed.', 'info');
    } else {
      showTopBanner(result?.error || 'Failed to remove profile photo.', 'warning');
    }
  };

  // 4. Save Updated Address - Wait for success response before closing modal
  const onSaveAddress = async () => {
    if (!building.trim() || !roadStreet.trim() || !city.trim()) {
      showTopBanner('Building, Road/Street, and City are required.', 'warning');
      return;
    }

    const result = await handleSaveAddress();
    if (result?.success) {
      setAddressModalVisible(false);
      showTopBanner('Residential address updated successfully!', 'success');
    } else {
      showTopBanner('Failed to update address. Please try again.', 'warning');
    }
  };

  const profile = userProfile;
  const displayName = profile?.fullName || session?.displayName || 'Registered User';
  const phoneNumber = profile?.mobileNumber || session?.phoneNumber || '+973 3948 9090';
  const emailAddress = profile?.email || 'user@klysavo.ai';
  const profileImage = profile?.profileImage;

  const [imageLoadError, setImageLoadError] = useState(false);

  // Reset image error state if the profile image changes
  useEffect(() => {
    setImageLoadError(false);
  }, [profileImage]);

  return (
    <SafeAreaView style={myProfileStyles.container}>
      {/* Auto-Closing Top Banner Notification */}
      <TopBannerNotification
        visible={bannerVisible}
        message={bannerMessage}
        type={bannerType}
        onClose={() => setBannerVisible(false)}
      />

      {/* 60fps Photo Action Sheet Modal */}
      {renderModal && (
        <Modal transparent visible={renderModal} animationType="none" onRequestClose={closePhotoPicker}>
          <View style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={closePhotoPicker}>
              <Animated.View style={[myProfileStyles.modalOverlay, { opacity: fadeOpacity }]} />
            </TouchableWithoutFeedback>

            <Animated.View
              style={[
                myProfileStyles.sheetContainer,
                {
                  transform: [{ translateY }],
                },
              ]}
            >
              <View style={myProfileStyles.actionCard}>
                <View style={myProfileStyles.actionHeader}>
                  <Text style={myProfileStyles.actionHeaderText}>Please select your action</Text>
                </View>

                <TouchableOpacity style={myProfileStyles.actionOptionBtn} onPress={handleTakePhoto} activeOpacity={0.75}>
                  <Text style={myProfileStyles.actionOptionText}>Take Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={myProfileStyles.actionOptionBtn} onPress={handleSelectFromLibrary} activeOpacity={0.75}>
                  <Text style={myProfileStyles.actionOptionText}>Select from Library</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[myProfileStyles.actionOptionBtn, { borderBottomWidth: 0 }]}
                  onPress={handleRemovePhoto}
                  activeOpacity={0.75}
                >
                  <Text style={myProfileStyles.actionDestructiveText}>Remove Photo</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={myProfileStyles.cancelCard} onPress={closePhotoPicker} activeOpacity={0.85}>
                <Text style={myProfileStyles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      )}

      {/* MANAGE ADDRESS MODAL */}
      <Modal visible={addressModalVisible} animationType="slide" transparent>
        <View style={myProfileStyles.fullModalContainer}>
          <SafeAreaView style={{ flex: 1, paddingHorizontal: 24 }}>
            <View style={myProfileStyles.modalHeader}>
              <Text style={myProfileStyles.modalHeaderTitle}>Manage Address</Text>
              <TouchableOpacity onPress={() => setAddressModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 20 }}>
              <UnderlineInputField
                label="BUILDING / VILLA"
                value={building}
                onChangeText={setBuilding}
                placeholder="e.g. Building 104"
              />
              <UnderlineInputField
                label="ROAD / STREET"
                value={roadStreet}
                onChangeText={setRoadStreet}
                placeholder="e.g. Road 3802"
              />
              <UnderlineInputField
                label="BLOCK / AREA"
                value={blockArea}
                onChangeText={setBlockArea}
                placeholder="e.g. Block 338"
              />
              <UnderlineInputField
                label="CITY"
                value={city}
                onChangeText={setCity}
                placeholder="e.g. Manama"
              />

              <TouchableOpacity
                style={myProfileStyles.saveModalBtn}
                onPress={onSaveAddress}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color={colors.darkGreen} />
                ) : (
                  <Text style={myProfileStyles.saveModalBtnText}>SAVE ADDRESS</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>



      {/* App Header - Moved outside ScrollView for consistency */}
      <AppHeader showBack title="My Profile" onBackPress={handleBack} />

      <ScrollView ref={mainScrollViewRef} contentContainerStyle={myProfileStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <View>

          {/* User Hero Avatar Section */}
          <View style={myProfileStyles.userHeroSection}>
            <TouchableOpacity
              style={myProfileStyles.avatarWrapper}
              onPress={() => setPhotoPickerVisible(true)}
              activeOpacity={0.85}
            >
              {profileImage && !imageLoadError ? (
                <Image
                  source={{ uri: profileImage }}
                  onError={() => setImageLoadError(true)}
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: 44,
                    borderWidth: 2,
                    borderColor: colors.gold
                  }}
                />
              ) : (
                <View style={myProfileStyles.avatarContainer}>
                  {displayName && displayName !== 'Registered User' ? (
                    <Text style={myProfileStyles.avatarText}>{getInitials(displayName)}</Text>
                  ) : (
                    <Ionicons name="person" size={40} color={colors.gold} />
                  )}
                </View>
              )}
              <View style={myProfileStyles.editCameraBadge}>
                <Ionicons name="camera" size={14} color={colors.darkGreen} />
              </View>
            </TouchableOpacity>
            <Text style={myProfileStyles.userNameText}>{displayName}</Text>
            <Text style={myProfileStyles.userBadgeText}>Verified Account</Text>
          </View>

          {/* Settings List Card */}
          <View style={myProfileStyles.settingsCard}>
            {/* 1. Email Address */}
            <TouchableOpacity
              style={myProfileStyles.settingRow}
              onPress={() => showTopBanner(`Registered Email: ${emailAddress}`, 'info')}
              activeOpacity={0.7}
            >
              <View style={myProfileStyles.settingLeft}>
                <View style={myProfileStyles.iconBadge}>
                  <Ionicons name="mail-outline" size={20} color={colors.darkGreen} />
                </View>
                <View>
                  <Text style={myProfileStyles.settingTitle}>Email Address</Text>
                  <Text style={myProfileStyles.settingSubtext}>{emailAddress}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>

            {/* 2. Mobile Number */}
            <TouchableOpacity
              style={myProfileStyles.settingRow}
              onPress={() => showTopBanner(`Registered Mobile: ${phoneNumber}`, 'info')}
              activeOpacity={0.7}
            >
              <View style={myProfileStyles.settingLeft}>
                <View style={myProfileStyles.iconBadge}>
                  <Ionicons name="phone-portrait-outline" size={20} color={colors.darkGreen} />
                </View>
                <View>
                  <Text style={myProfileStyles.settingTitle}>Mobile Number</Text>
                  <Text style={myProfileStyles.settingSubtext}>{phoneNumber}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>

            {/* 3. Manage Address */}
            <TouchableOpacity
              style={myProfileStyles.settingRow}
              onPress={() => setAddressModalVisible(true)}
              activeOpacity={0.7}
            >
              <View style={myProfileStyles.settingLeft}>
                <View style={myProfileStyles.iconBadge}>
                  <Ionicons name="location-outline" size={20} color={colors.darkGreen} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={myProfileStyles.settingTitle}>Manage Address</Text>
                  {Boolean(building?.trim() || roadStreet?.trim() || city?.trim()) ? (
                    <Text style={myProfileStyles.settingSubtext} numberOfLines={1}>
                      {[building, roadStreet, city].filter((s) => s && s.trim() !== '').join(', ')}
                    </Text>
                  ) : (
                    <Text style={[myProfileStyles.settingSubtext, { color: colors.darkGreen, fontFamily: fontFamilies.bold }]} numberOfLines={1}>
                      Update your residential address
                    </Text>
                  )}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>



            {/* 4. Theme Appearance */}
            <TouchableOpacity style={myProfileStyles.settingRow} onPress={toggleTheme} activeOpacity={0.7}>
              <View style={myProfileStyles.settingLeft}>
                <View style={myProfileStyles.iconBadge}>
                  <Ionicons name={isDark ? 'moon-outline' : 'sunny-outline'} size={20} color={colors.darkGreen} />
                </View>
                <View>
                  <Text style={myProfileStyles.settingTitle}>Appearance Mode</Text>
                  <Text style={myProfileStyles.settingSubtext}>{isDark ? 'Dark Theme' : 'Light Theme'}</Text>
                </View>
              </View>
              <Ionicons name="swap-horizontal" size={18} color={colors.textMuted} />
            </TouchableOpacity>

            {/* 5. App Version */}
            <TouchableOpacity
              style={[myProfileStyles.settingRow, { borderBottomWidth: 0 }]}
              onPress={() => showTopBanner(`App Version: v${Constants.expoConfig?.version || '1.0.0'} (Release Build)`, 'info')}
              activeOpacity={0.7}
            >
              <View style={myProfileStyles.settingLeft}>
                <View style={myProfileStyles.iconBadge}>
                  <Ionicons name="information-circle-outline" size={20} color={colors.darkGreen} />
                </View>
                <View>
                  <Text style={myProfileStyles.settingTitle}>Application Version</Text>
                  <Text style={myProfileStyles.settingSubtext}>v{Constants.expoConfig?.version || '1.0.0'} (APK Release)</Text>
                </View>
              </View>
              <Ionicons name="checkmark-circle-outline" size={18} color="#10B981" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Brand Section */}
        <View style={myProfileStyles.bottomBrandSection}>
          <View style={myProfileStyles.bottomBrandRow}>
            <Text style={myProfileStyles.bottomBrandText}>klysavo</Text>
            <Text style={myProfileStyles.bottomAiDot}>.AI</Text>
          </View>
          <Text style={myProfileStyles.bottomVersionText}>PRECISION AI BANKING • v{Constants.expoConfig?.version || '1.0.0'}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
