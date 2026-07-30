import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
// Removed top-level import to prevent crash if native module is missing
// import * as ImageManipulator from 'expo-image-manipulator';
import { useSession } from '@/features/auth/presentation/session-provider';
import { type ExtendedUserProfile, type UserAddress } from '@/core/services/secure-storage-service';
import { ProfileRemoteDataSourceImpl } from '../../data/datasources/profile-remote-datasource';
import { ProfileRepositoryImpl } from '../../data/repositories/profile-repository-impl';

// In a real app, these would be injected or come from a DI container
const profileRemoteDataSource = new ProfileRemoteDataSourceImpl();
const profileRepository = new ProfileRepositoryImpl(profileRemoteDataSource);

export function useProfileViewModel() {
  const router = useRouter();
  const { session, signOut, signIn } = useSession();

  const [userProfile, setUserProfile] = useState<ExtendedUserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  // Form fields
  const [buildingText, setBuildingText] = useState('');
  const [flatText, setFlatText] = useState('');
  const [roadText, setRoadText] = useState('');
  const [blockText, setBlockText] = useState('');
  const [cityText, setCityText] = useState('');

  useEffect(() => {
    async function loadProfile() {
      if (!session?.uid) return;

      setLoading(true);
      const profile = await profileRepository.getProfile(session.uid);
      if (profile) {
        setUserProfile(profile);
        updateFormFields(profile);
      }
      setLoading(false);
    }
    loadProfile();
  }, [session?.uid]);

  const updateFormFields = (profile: ExtendedUserProfile) => {
    const addr = (profile.address as any) || {};
    setBuildingText(addr.building || (profile as any).building || '');
    setFlatText(addr.flat || (profile as any).flat || '');
    setRoadText(addr.roadStreet || addr.road || (profile as any).road || '');
    setBlockText(addr.blockArea || addr.block || (profile as any).block || '');
    setCityText(addr.city || (profile as any).city || '');
  };

  const handleUpdateProfileImage = async (imageUri: string | null, fallbackBase64?: string) => {
    if (!session?.uid) return;

    setLoading(true);
    try {
      let fullBase64 = '';

      if (imageUri) {
        console.log('Attempting image manipulation...');

        try {
          // Lazy require to prevent crash on boot if native module is missing
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const ImageManipulator = require('expo-image-manipulator');

          if (ImageManipulator && ImageManipulator.manipulateAsync) {
            const manipResult = await ImageManipulator.manipulateAsync(
              imageUri,
              [{ resize: { width: 150, height: 150 } }], // Target ~40KB
              { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true }
            );
            fullBase64 = `data:image/jpeg;base64,${manipResult.base64}`;
            console.log('Image manipulation complete. Size:', fullBase64.length);
          } else {
            throw new Error('Manipulator not available');
          }
        } catch (manipError) {
          console.warn('Native ImageManipulator failed/missing, using fallback:', manipError);
          // If native manipulator fails, use the aggressive compression provided by ImagePicker
          if (fallbackBase64) {
            fullBase64 = `data:image/jpeg;base64,${fallbackBase64}`;
          } else {
            throw new Error('No image data available to upload.');
          }
        }
      }

      console.log('Updating profile in Firestore...');
      const updated = await profileRepository.updateProfileImage(session.uid, fullBase64);
      setUserProfile(updated);

      // Refresh session for global UI updates
      await signIn(updated);

      console.log('Profile update successful!');
      return { success: true };
    } catch (error: any) {
      console.error('Update profile image error details:', error);

      let message = 'An unexpected error occurred';
      if (error.message?.includes('maximum allowed size')) {
        message = 'The image is too large (Firestore 1MB limit). Even after compression, it exceeded the limit. Please try a different photo.';
      } else {
        message = error.message || message;
      }

      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };
  const handleSaveAddress = async () => {
    if (!session?.uid) return { success: false, error: 'No active session' };

    setLoading(true);
    try {
      const newAddress: UserAddress = {
        building: buildingText.trim(),
        roadStreet: roadText.trim(),
        blockArea: blockText.trim(),
        city: cityText.trim(),
      };

      const updated = await profileRepository.updateAddress(session.uid, newAddress);
      setUserProfile(updated);

      // Refresh session for global UI updates
      await signIn(updated);
      return { success: true };
    } catch (error) {
      console.error('Update address error:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return {
    session,
    userProfile,
    loading,
    biometricEnabled,
    setBiometricEnabled,
    addressModalVisible,
    setAddressModalVisible,
    buildingText,
    setBuildingText,
    flatText,
    setFlatText,
    roadText,
    setRoadText,
    blockText,
    setBlockText,
    cityText,
    setCityText,
    handleUpdateProfileImage,
    handleSaveAddress,
    handleLogout,
    handleBack: () => router.back(),
  };
}
