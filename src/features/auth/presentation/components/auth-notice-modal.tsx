import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';
import { fontFamilies } from '@/core/theme/typography';

export type NoticeType = 'NOT_REGISTERED' | 'MISSING_COLLECTION' | 'INACTIVE_ACCOUNT' | null;

interface AuthNoticeModalProps {
  visible: boolean;
  type: NoticeType;
  email?: string;
  onClose: () => void;
  onCreateAccount: () => void;
}

export function AuthNoticeModal({
  visible,
  type,
  email,
  onClose,
  onCreateAccount,
}: AuthNoticeModalProps) {
  if (!visible || !type) return null;

  const isNotRegistered = type === 'NOT_REGISTERED';
  const isInactiveAccount = type === 'INACTIVE_ACCOUNT';
  const needsSupport = type === 'MISSING_COLLECTION' || isInactiveAccount;

  const getTitle = () => {
    if (isNotRegistered) return 'Account Not Found';
    if (isInactiveAccount) return 'Account Inactive';
    return 'Account Notice';
  };

  const getMessage = () => {
    if (isNotRegistered)
      return `No account was found for email:\n"${email || 'your email'}"\n\nPlease create an account to start banking with us.`;
    if (isInactiveAccount)
      return `Your account is not currently active.\n\nPlease contact our bank customer care team to activate your account and continue.`;
    return `Your account requires assistance to complete sign in.\n\nPlease contact our bank customer care team for support.`;
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.modalCard} activeOpacity={1} onPress={() => {}}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={20} color={colors.textDark} />
          </TouchableOpacity>

          {/* Icon Badge */}
          <View style={styles.iconBadgeWrapper}>
            <View style={[styles.iconBadge, needsSupport && styles.iconBadgeBank]}>
              <Ionicons
                name={isNotRegistered ? 'person-add-outline' : isInactiveAccount ? 'lock-closed-outline' : 'headset-outline'}
                size={30}
                color={colors.darkGreen}
              />
            </View>
          </View>

          {/* General Title & Message */}
          <Text style={styles.modalTitle}>{getTitle()}</Text>

          <Text style={styles.modalMessage}>{getMessage()}</Text>

          {/* Toll Free Banner Card */}
          {needsSupport && (
            <View style={styles.tollFreeCard}>
              <Ionicons name="call-outline" size={20} color={colors.darkGreen} />
              <View style={{ flex: 1 }}>
                <Text style={styles.tollFreeLabel}>TOLL-FREE BANK SUPPORT</Text>
                <Text style={styles.tollFreeNumber}>8000-1122 / +973 1700 8000</Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonStack}>
            {isNotRegistered ? (
              <TouchableOpacity
                style={styles.primaryYellowBtn}
                onPress={() => {
                  onClose();
                  onCreateAccount();
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryYellowBtnText}>CREATE ACCOUNT</Text>
                <Ionicons name="arrow-forward" size={18} color={colors.darkGreen} />
              </TouchableOpacity>
            ) : (
              /* Call Customer Support Button */
              <TouchableOpacity
                style={styles.primaryYellowBtn}
                onPress={() => Linking.openURL('tel:80001122')}
                activeOpacity={0.85}
              >
                <Ionicons name="call" size={18} color={colors.darkGreen} />
                <Text style={styles.primaryYellowBtnText}>CALL TOLL-FREE SUPPORT</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(12, 35, 30, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F7FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeWrapper: {
    marginTop: 8,
    marginBottom: 16,
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EBF4F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(18, 60, 48, 0.12)',
  },
  iconBadgeBank: {
    backgroundColor: '#FEF9C3',
    borderColor: '#FDE047',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  modalMessage: {
    fontSize: 14,
    fontFamily: fontFamilies.regular,
    color: '#4A5568',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 20,
  },

  // Toll Free Card Banner
  tollFreeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#EBF4F0',
    borderRadius: 14,
    padding: 14,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(18, 60, 48, 0.1)',
  },
  tollFreeLabel: {
    fontSize: 10,
    fontFamily: fontFamilies.bold,
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  tollFreeNumber: {
    fontSize: 15,
    fontFamily: fontFamilies.bold,
    color: colors.darkGreen,
    marginTop: 2,
  },

  // Button Stack
  buttonStack: {
    width: '100%',
    gap: 10,
  },
  primaryYellowBtn: {
    backgroundColor: colors.buttonYellow,
    borderRadius: 16,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: colors.buttonYellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryYellowBtnText: {
    fontSize: 13,
    fontFamily: fontFamilies.extraBold,
    letterSpacing: 1,
    color: colors.darkGreen,
  },
});
