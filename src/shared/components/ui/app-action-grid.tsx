import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';
import { transactionsStyles } from '@/features/transactions/presentation/screens/transactions-screen.styles';

export interface ActionGridItem {
  id: string;
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  iconColor?: string;
}

interface AppActionGridProps {
  items: ActionGridItem[];
}

export function AppActionGrid({ items }: AppActionGridProps) {
  if (!items || items.length === 0) return null;

  return (
    <View style={transactionsStyles.actionsGrid}>
      {items.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={transactionsStyles.actionCard}
          onPress={action.onPress}
          activeOpacity={0.8}
        >
          <View style={transactionsStyles.actionIconBox}>
            <Ionicons name={action.iconName} size={22} color={action.iconColor || colors.darkGreen} />
          </View>
          <Text style={transactionsStyles.actionLabel}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
