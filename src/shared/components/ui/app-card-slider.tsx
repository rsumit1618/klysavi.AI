import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { fontFamilies } from '@/core/theme/typography';
import { CARD_WIDTH, transactionsStyles } from '@/features/transactions/presentation/screens/transactions-screen.styles';
import { getCardStatusImage } from '@/core/constants/product-image-map';

export interface CardSliderItem {
  id: string;
  title: string;
  bankName: string;
  refNumber: string;
  balanceLabel: string;
  balanceValue: string;
  progressWidth?: `${number}%` | string;
  meta1Text?: string;
  meta2Text?: string;
  statusBadgeText?: string;
  statusBadgeColor?: string;
  imageId?: string;
  productId?: string;
  rightTopContent?: React.ReactNode;
  footerRightContent?: React.ReactNode;
  overlayContent?: React.ReactNode;
}

interface AppCardSliderProps {
  items: CardSliderItem[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  themes?: string[];
  actionButtonText?: string;
  onActionButtonPress?: () => void;
}

const DEFAULT_THEMES = ['#0F2F28', '#1C2D42', '#3C2A1E', '#1E182A'];

export function AppCardSlider({
  items,
  activeIndex,
  onIndexChange,
  themes = DEFAULT_THEMES,
  actionButtonText,
  onActionButtonPress,
}: AppCardSliderProps) {
  if (!items || items.length === 0) return null;

  return (
    <View style={transactionsStyles.cardViewport}>
      <ScrollView
        horizontal
        pagingEnabled={false}
        snapToInterval={CARD_WIDTH + 12}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={transactionsStyles.cardSliderContent}
        onScroll={(e) => {
          const xOffset = e.nativeEvent.contentOffset.x;
          const newIndex = Math.round(xOffset / (CARD_WIDTH + 12));
          if (newIndex >= 0 && newIndex < items.length && newIndex !== activeIndex) {
            onIndexChange(newIndex);
          }
        }}
        scrollEventThrottle={16}
      >
        {items.map((item, idx) => {
          const bgTheme = themes[idx % themes.length];
          const badgeText = item.statusBadgeText || 'ACTIVE';
          const badgeColor = item.statusBadgeColor || '#68D391';

          return (
            <View
              key={item.id || idx}
              style={[transactionsStyles.creditCard3D, { backgroundColor: bgTheme }]}
            >
              <Image
                source={getCardStatusImage('TAB', item.imageId, item.productId)}
                style={[StyleSheet.absoluteFillObject, { opacity: 0.25 }]}
                resizeMode="cover"
              />

              {item.overlayContent}

              {/* Card Top Row */}
              <View style={transactionsStyles.cardTopRow}>
                <View style={{ flex: 1 }}>
                  <Text style={transactionsStyles.bankBrandLogo}>{item.bankName.toUpperCase()}</Text>
                  <Text
                    style={{
                      fontSize: 9.5,
                      color: 'rgba(255,255,255,0.7)',
                      fontFamily: fontFamilies.bold,
                      textTransform: 'uppercase',
                    }}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                </View>
                <View style={transactionsStyles.cardRightIcons}>
                  {item.rightTopContent ? (
                    item.rightTopContent
                  ) : (
                    <View style={{ backgroundColor: 'rgba(56, 161, 105, 0.25)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }}>
                      <Text style={{ fontSize: 9.5, fontFamily: fontFamilies.bold, color: badgeColor }}>{badgeText}</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Card Ref / Number Row */}
              <View style={transactionsStyles.cardNumberRow}>
                <Text style={transactionsStyles.cardNumberText}>{item.refNumber}</Text>
              </View>

              {/* Balance / Sanctioned Amount Section */}
              <View style={transactionsStyles.balanceSection}>
                <Text style={transactionsStyles.balanceLabel}>{item.balanceLabel}</Text>
                <Text style={transactionsStyles.balanceValue}>{item.balanceValue}</Text>
                <View style={transactionsStyles.spendingBarBg}>
                  <View style={[transactionsStyles.spendingBarFill, { width: (item.progressWidth as any) || '50%' }]} />
                </View>
              </View>

              {/* Card Footer Meta Row */}
              <View style={transactionsStyles.cardFooterRow}>
                <View style={transactionsStyles.cardFooterMeta}>
                  {item.meta1Text ? <Text style={transactionsStyles.cardMetaText}>{item.meta1Text}</Text> : null}
                  {item.meta2Text ? <Text style={transactionsStyles.cardMetaText}>{item.meta2Text}</Text> : null}
                </View>
                {item.footerRightContent}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Slider Pagination Dots Indicator */}
      <View style={transactionsStyles.paginationDotsRow}>
        {items.length > 1 ? (
          items.map((_, idx) => (
            <View
              key={idx}
              style={[
                transactionsStyles.dot,
                activeIndex === idx && transactionsStyles.activeDot,
              ]}
            />
          ))
        ) : (
          <View style={{ height: 7 }} />
        )}
      </View>

      {/* Action Button (e.g. View Card/Loan/Policy Details) */}
      {actionButtonText && onActionButtonPress ? (
        <TouchableOpacity
          style={transactionsStyles.viewDetailsBtn}
          onPress={onActionButtonPress}
          activeOpacity={0.85}
        >
          <Text style={transactionsStyles.viewDetailsBtnText}>{actionButtonText}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
