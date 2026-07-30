import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/shared/components/app-header';
import { colors } from '@/core/theme/colors';
import { fontFamilies } from '@/core/theme/typography';

const FAQ_DATA = [
  {
    question: 'How do I apply for a new credit card?',
    answer: 'You can apply for a new credit card directly from the Home screen by selecting your preferred card and clicking "Apply". The process is 100% digital and takes less than 5 minutes.',
  },
  {
    question: 'How can I redeem my reward points?',
    answer: 'Navigate to the Home screen and tap on your "Reward Points" card. Click "REDEEM" to convert your points into instant cash credit or other available offers.',
  },
  {
    question: 'What should I do if my card is lost or stolen?',
    answer: 'Go to the "Cards" tab, select your card, and use the "FREEZE CARD" option immediately. You can then contact our support team to request a replacement.',
  },
  {
    question: 'How long does it take for a loan approval?',
    answer: 'Our AI engine provides instant preliminary approval. Final verification and disbursement typically happen within 24-48 business hours.',
  },
];

export default function ContactUsRoute() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleCall = () => Linking.openURL('tel:80001122');
  const handleEmail = () => Linking.openURL('mailto:support@klysavo.ai');

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader title="Contact Us" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="chatbubbles-outline" size={40} color={colors.darkGreen} />
          </View>
          <Text style={styles.heroTitle}>How can we help you?</Text>
          <Text style={styles.heroSub}>Our support team and AI assistance are available 24/7 to help with your banking needs.</Text>
        </View>

        {/* Contact Methods — full-width rows so email has room to render */}
        <View style={styles.methodsList}>
          <TouchableOpacity style={styles.contactRow} onPress={handleCall} activeOpacity={0.8}>
            <View style={[styles.methodIconBox, { backgroundColor: '#E6F4ED' }]}>
              <Ionicons name="call" size={22} color={colors.darkGreen} />
            </View>
            <View style={styles.contactTextCol}>
              <Text style={styles.methodLabel}>Call Support</Text>
              <Text style={styles.methodValue}>8000 1122</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactRow} onPress={handleEmail} activeOpacity={0.8}>
            <View style={[styles.methodIconBox, { backgroundColor: '#FFF9E6' }]}>
              <Ionicons name="mail" size={22} color={colors.goldDark} />
            </View>
            <View style={styles.contactTextCol}>
              <Text style={styles.methodLabel}>Email Support</Text>
              <Text style={styles.methodValue} numberOfLines={1} adjustsFontSizeToFit>
                support@klysavo.ai
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <View style={styles.faqHeaderRow}>
            <Ionicons name="help-circle-outline" size={22} color={colors.textDark} />
            <Text style={styles.faqHeaderTitle}>FREQUENTLY ASKED QUESTIONS</Text>
          </View>

          {FAQ_DATA.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.faqItem}
              onPress={() => toggleExpand(index)}
              activeOpacity={0.7}
            >
              <View style={styles.faqQuestionRow}>
                <Text style={styles.faqQuestionText}>{item.question}</Text>
                <Ionicons
                  name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={colors.textMuted}
                />
              </View>
              {expandedIndex === index && (
                <View style={styles.faqAnswerBox}>
                  <Text style={styles.faqAnswerText}>{item.answer}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>Klysavo AI Banking Services</Text>
          <Text style={styles.footerSub}>Kingdom of Bahrain</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: colors.darkGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  heroTitle: {
    fontSize: 22,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 14,
    fontFamily: fontFamilies.regular,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  methodsList: {
    marginBottom: 32,
    gap: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contactTextCol: {
    flex: 1,
  },
  methodIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodLabel: {
    fontSize: 11,
    fontFamily: fontFamilies.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  methodValue: {
    fontSize: 15,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
  },
  faqSection: {
    marginBottom: 24,
  },
  faqHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingLeft: 4,
  },
  faqHeaderTitle: {
    fontSize: 11,
    fontFamily: fontFamilies.bold,
    color: colors.textMuted,
    letterSpacing: 1.2,
  },
  faqItem: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  faqQuestionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestionText: {
    fontSize: 14.5,
    fontFamily: fontFamilies.semiBold,
    color: colors.textDark,
    flex: 1,
    paddingRight: 12,
  },
  faqAnswerBox: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  faqAnswerText: {
    fontSize: 13.5,
    fontFamily: fontFamilies.regular,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  footerInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 13,
    fontFamily: fontFamilies.bold,
    color: colors.textMuted,
  },
  footerSub: {
    fontSize: 12,
    fontFamily: fontFamilies.medium,
    color: colors.textMuted,
    marginTop: 2,
  },
});
