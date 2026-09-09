import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme/tokens';

type Props = { message: string; type?: 'error' | 'success' | 'warning' };

export function FeedbackBanner({ message, type = 'error' }: Props) {
  const palette = type === 'success'
    ? { background: colors.successSoft, foreground: colors.success, icon: 'checkmark-circle' as const }
    : type === 'warning'
      ? { background: colors.warningSoft, foreground: colors.warning, icon: 'time' as const }
      : { background: colors.dangerSoft, foreground: colors.danger, icon: 'alert-circle' as const };

  return (
    <View accessibilityLiveRegion="polite" style={[styles.banner, { backgroundColor: palette.background }]}>
      <Ionicons color={palette.foreground} name={palette.icon} size={20} />
      <Text style={[styles.text, { color: palette.foreground }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { alignItems: 'flex-start', borderRadius: radius.sm, flexDirection: 'row', gap: spacing.sm, padding: 13 },
  text: { flex: 1, fontSize: 13, fontWeight: '600', lineHeight: 19 },
});

