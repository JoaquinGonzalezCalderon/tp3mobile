import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius } from '@/theme/tokens';

type Props = {
  label: string;
  loadingLabel?: string;
  isLoading?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function PrimaryButton({ label, loadingLabel = 'Cargando…', isLoading, disabled, onPress }: Props) {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: isLoading, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {isLoading ? <ActivityIndicator color={colors.surface} size="small" /> : null}
      <Text style={styles.label}>{isLoading ? loadingLabel : label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: 20,
  },
  disabled: { backgroundColor: colors.disabled },
  pressed: { backgroundColor: colors.primaryDark, transform: [{ scale: 0.99 }] },
  label: { color: colors.surface, fontSize: 16, fontWeight: '800' },
});

