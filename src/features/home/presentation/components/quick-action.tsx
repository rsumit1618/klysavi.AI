import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';
import { quickActionStyles } from './quick-action.styles';

interface QuickActionProps {
  label?: string;
  onPress?: () => void;
}

export function QuickAction({ label, onPress }: QuickActionProps) {
  const [isFrozen, setIsFrozen] = useState(false);

  const handleFreezeToggle = () => {
    setIsFrozen(!isFrozen);
    Alert.alert(
      !isFrozen ? 'Card Frozen' : 'Card Unfrozen',
      !isFrozen ? 'Your card has been temporarily locked.' : 'Your card is active and ready to use.'
    );
  };

  return (
    <View style={quickActionStyles.gridRow}>
      {/* Pay */}
      <TouchableOpacity
        style={quickActionStyles.actionItem}
        onPress={() => Alert.alert('Quick Pay', 'Pay feature activated.')}
        activeOpacity={0.8}
      >
        <View style={quickActionStyles.iconCircle}>
          <Ionicons name="card" size={22} color={colors.darkGreen} />
        </View>
        <Text style={quickActionStyles.actionLabel}>Pay</Text>
      </TouchableOpacity>

      {/* Freeze / Unfreeze */}
      <TouchableOpacity
        style={[quickActionStyles.actionItem, isFrozen && quickActionStyles.actionItemFrozen]}
        onPress={handleFreezeToggle}
        activeOpacity={0.8}
      >
        <View style={quickActionStyles.iconCircle}>
          <Ionicons
            name={isFrozen ? 'lock-closed' : 'snow-outline'}
            size={22}
            color={isFrozen ? colors.error : colors.darkGreen}
          />
        </View>
        <Text style={[quickActionStyles.actionLabel, isFrozen && quickActionStyles.actionLabelFrozen]}>
          {isFrozen ? 'Unfreeze' : 'Freeze'}
        </Text>
      </TouchableOpacity>

      {/* Statement */}
      <TouchableOpacity
        style={quickActionStyles.actionItem}
        onPress={() => Alert.alert('Statement', 'Generating monthly e-statement...')}
        activeOpacity={0.8}
      >
        <View style={quickActionStyles.iconCircle}>
          <Ionicons name="document-text-outline" size={22} color={colors.darkGreen} />
        </View>
        <Text style={quickActionStyles.actionLabel}>Statement</Text>
      </TouchableOpacity>
    </View>
  );
}
