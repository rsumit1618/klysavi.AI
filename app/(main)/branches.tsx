import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/shared/components/app-header';
import { colors } from '@/core/theme/colors';

export default function BranchesRoute() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader title="Branch Locator" showBack showLogo />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.branchCard}>
          <Ionicons name="business-outline" size={32} color={colors.darkGreen} />
          <View style={styles.infoCol}>
            <Text style={styles.branchName}>Main Headquarters Branch</Text>
            <Text style={styles.branchAddress}>Diplomatic Area, Manama, Kingdom of Bahrain</Text>
            <Text style={styles.branchHours}>Sun - Thu: 8:00 AM - 4:00 PM</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  branchCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoCol: { marginLeft: 16, flex: 1 },
  branchName: { fontSize: 16, fontWeight: '700', color: colors.textDark },
  branchAddress: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  branchHours: { fontSize: 12, color: colors.darkGreen, marginTop: 6, fontWeight: '600' },
});
