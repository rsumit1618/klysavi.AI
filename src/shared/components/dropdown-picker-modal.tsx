import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/core/theme/colors';
import { fontFamilies } from '@/core/theme/typography';

interface DropdownPickerModalProps {
  visible: boolean;
  title: string;
  options: string[];
  selectedValue?: string;
  onSelect: (option: string) => void;
  onClose: () => void;
}

export function DropdownPickerModal({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}: DropdownPickerModalProps) {
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.sheetContainer,
                { paddingBottom: Math.max(insets.bottom + 16, 24) },
              ]}
            >
              {/* Handle Bar */}
              <View style={styles.handleBarRow}>
                <View style={styles.handleBar} />
              </View>

              {/* Title & Close */}
              <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>{title}</Text>
                <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                  <Ionicons name="close" size={20} color={colors.textDark} />
                </TouchableOpacity>
              </View>

              {/* Options List */}
              <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
                {options.map((option) => {
                  const isSelected = selectedValue === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionRow,
                        isSelected && styles.optionRowSelected,
                      ]}
                      onPress={() => {
                        onSelect(option);
                        onClose();
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                      {isSelected ? (
                        <View style={styles.checkBadge}>
                          <Ionicons name="checkmark" size={16} color={colors.white} />
                        </View>
                      ) : (
                        <View style={styles.uncheckDot} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    maxHeight: '65%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  handleBarRow: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  handleBar: {
    width: 40,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: '#CBD5E0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F2',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EDEEED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsList: {
    marginTop: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: colors.lightBg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionRowSelected: {
    backgroundColor: 'rgba(18, 60, 48, 0.08)',
    borderColor: colors.darkGreen,
  },
  optionText: {
    fontSize: 15,
    fontFamily: fontFamilies.medium,
    color: colors.textDark,
  },
  optionTextSelected: {
    fontFamily: fontFamilies.bold,
    color: colors.darkGreen,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uncheckDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E0',
  },
});
