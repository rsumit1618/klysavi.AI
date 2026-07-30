import React, { useEffect } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { splashStyles } from './splash-screen.styles';
import { ShieldLogo } from './components/shield-logo';

export function SplashScreen() {
  const logoScale = React.useRef(new Animated.Value(0.9)).current;
  const logoOpacity = React.useRef(new Animated.Value(0)).current;

  const textOpacity = React.useRef(new Animated.Value(0)).current;
  const textTranslateY = React.useRef(new Animated.Value(16)).current;

  const loaderOpacity = React.useRef(new Animated.Value(0)).current;

  // Pulsating glow ring
  const pulseRingScale = React.useRef(new Animated.Value(1)).current;

  // Bouncing loading dots
  const dot1Y = React.useRef(new Animated.Value(0)).current;
  const dot2Y = React.useRef(new Animated.Value(0)).current;
  const dot3Y = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequential Entrance
    Animated.sequence([
      // 1. Logo Scale & Fade
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      // 2. Brand Text Fade & Slide
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      // 3. Loader Section Fade
      Animated.timing(loaderOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous AI Pulse Ring
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseRingScale, {
          toValue: 1.15,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseRingScale, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Continuous Bouncing Dots Loop
    const createDotBounce = (anim: Animated.Value, delay: number) => {
      return Animated.sequence([
        Animated.delay(delay),
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: -6,
              duration: 350,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 350,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.delay(450),
          ])
        ),
      ]);
    };

    createDotBounce(dot1Y, 0).start();
    createDotBounce(dot2Y, 150).start();
    createDotBounce(dot3Y, 300).start();
  }, []);

  return (
    <View style={splashStyles.container}>
      {/* Ambient Glow */}
      <View style={splashStyles.glowContainer} />

      {/* Logo & Pulsating AI Rings */}
      <Animated.View
        style={[
          splashStyles.logoWrapper,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Animated.View
          style={[
            splashStyles.outerPulseRing,
            { transform: [{ scale: pulseRingScale }] },
          ]}
        />
        <Animated.View
          style={[
            splashStyles.innerPulseRing,
            { transform: [{ scale: pulseRingScale }] },
          ]}
        />
        <View style={splashStyles.emblemContainer}>
          <ShieldLogo size={128} />
        </View>
      </Animated.View>

      {/* Brand Name & Tagline */}
      <Animated.View
        style={[
          splashStyles.brandContainer,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
          },
        ]}
      >
        <View style={splashStyles.titleRow}>
          <Text style={splashStyles.brandName}>klysavo</Text>
          <Text style={splashStyles.aiAccent}>.AI</Text>
        </View>
        <Text style={splashStyles.tagline}>PRECISION INTELLIGENCE</Text>
      </Animated.View>

      {/* Status Loader Section */}
      <Animated.View style={[splashStyles.loaderSection, { opacity: loaderOpacity }]}>
        <View style={splashStyles.dotsRow}>
          <Animated.View style={[splashStyles.dot, { transform: [{ translateY: dot1Y }] }]} />
          <Animated.View style={[splashStyles.dot, { transform: [{ translateY: dot2Y }] }]} />
          <Animated.View style={[splashStyles.dot, { transform: [{ translateY: dot3Y }] }]} />
        </View>
        <Text style={splashStyles.loaderText}>Calibrating neural nodes...</Text>
      </Animated.View>

      {/* Decorative Bottom Accent Line */}
      <View style={splashStyles.bottomAccentLine} />
    </View>
  );
}
