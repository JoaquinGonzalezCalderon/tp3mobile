import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/tokens';

export function BrandMark() {
  return (
    <View accessible accessibilityLabel="iBank" style={styles.row}>
      <View style={styles.symbol}>
        <View style={styles.barShort} />
        <View style={styles.barTall} />
      </View>
      <Text style={styles.wordmark}>iBank</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  symbol: {
    alignItems: 'flex-end',
    backgroundColor: colors.primary,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 3,
    height: 36,
    justifyContent: 'center',
    paddingBottom: 8,
    width: 36,
  },
  barShort: { backgroundColor: colors.surface, borderRadius: 2, height: 10, width: 5 },
  barTall: { backgroundColor: colors.surface, borderRadius: 2, height: 18, width: 5 },
  wordmark: { color: colors.ink, fontSize: 23, fontWeight: '800', letterSpacing: -0.7 },
});

