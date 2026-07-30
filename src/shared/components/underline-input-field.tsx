import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/core/theme/colors';
import { fontFamilies, typography } from '@/core/theme/typography';

interface UnderlineInputFieldProps extends TextInputProps {
  label: string;
  prefix?: string;
  rightIconName?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  isDropdown?: boolean;
  dropdownValue?: string;
  inputRef?: React.RefObject<TextInput | null>;
}

export function UnderlineInputField({
  label,
  prefix,
  rightIconName,
  onRightIconPress,
  isDropdown,
  dropdownValue,
  inputRef,
  returnKeyType = 'next',
  ...textInputProps
}: UnderlineInputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.formGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>

      {isDropdown ? (
        <TouchableOpacity
          style={[styles.underlineInputRow, isFocused && styles.underlineInputRowFocused]}
          onPress={onRightIconPress}
          activeOpacity={0.8}
        >
          <Text style={styles.underlineInput}>{dropdownValue || 'Please select'}</Text>
          <Ionicons name="chevron-down" size={20} color={colors.textDark} />
        </TouchableOpacity>
      ) : (
        <View
          style={[
            styles.underlineInputRow,
            isFocused && styles.underlineInputRowFocused,
          ]}
        >
          {prefix ? <Text style={styles.prefixText}>{prefix}</Text> : null}
          <TextInput
            ref={inputRef}
            style={styles.underlineInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholderTextColor={colors.textMuted}
            returnKeyType={returnKeyType}
            {...textInputProps}
          />
          {rightIconName ? (
            <TouchableOpacity style={styles.infoIcon} onPress={onRightIconPress} disabled={!onRightIconPress}>
              <Ionicons name={rightIconName} size={20} color={colors.textDark} />
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 24,
  },
  fieldLabel: {
    ...typography.sectionLabel,
    marginBottom: 6,
  },
  underlineInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  underlineInputRowFocused: {
    borderBottomColor: colors.darkGreen,
  },
  underlineInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: fontFamilies.semiBold,
    color: colors.textDark,
    padding: 0,
  },
  prefixText: {
    fontSize: 16,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
    marginRight: 10,
  },
  infoIcon: {
    paddingLeft: 10,
  },
});
