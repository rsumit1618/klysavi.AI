import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/shared/components/app-header';
import { colors } from '@/core/theme/colors';

export default function NotificationsRoute() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader title="Notification Center" showBack showLogo />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.emptyCard}>
          <Ionicons name="notifications-outline" size={48} color={colors.darkGreen} />
          <Text style={styles.emptyTitle}>{"You're all caught up!"}</Text>
          <Text style={styles.emptySub}>No new notifications at this time.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  emptyCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 16,
  },
  emptySub: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
});
