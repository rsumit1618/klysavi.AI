import React, { useState, useEffect, useRef } from 'react';
import { FinancialCalculatorScreen } from '@/features/financial-calculator/presentation/screens/financial-calculator-screen';
import { FinancialCalculatorOverviewScreen } from '@/features/financial-calculator/presentation/screens/financial-calculator-overview-screen';
import { useRouter } from 'expo-router';
import { BackHandler, Animated, Dimensions, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/shared/components/app-header';
import { colors } from '@/core/theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function FinancialCalculatorRoute() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Animation Values
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleProceed = () => {
    // Animate to Step 1 (slide left to reveal right screen)
    Animated.timing(slideAnim, {
      toValue: -SCREEN_WIDTH,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      setStep(1);
    });
  };

  const handleBack = () => {
    if (step === 0) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(main)/home');
      }
    } else {
      // Animate back to Step 0 (slide right to reveal left screen)
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start(() => {
        setStep(0);
      });
    }
  };

  useEffect(() => {
    const onBackPress = () => {
      handleBack();
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [step]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Fixed App Header - Does not animate during step transitions */}
      <AppHeader showBack title="Financial Calculator" onBackPress={handleBack} />

      <View style={styles.container}>
        <Animated.View
          style={[
            styles.animatedWrapper,
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          <View style={styles.screenWrapper}>
            <FinancialCalculatorOverviewScreen
              onProceed={handleProceed}
              onBack={handleBack}
            />
          </View>
          <View style={styles.screenWrapper}>
            <FinancialCalculatorScreen onBack={handleBack} />
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  animatedWrapper: {
    flex: 1,
    flexDirection: 'row',
    width: SCREEN_WIDTH * 2,
  },
  screenWrapper: {
    width: SCREEN_WIDTH,
    flex: 1,
  }
});
