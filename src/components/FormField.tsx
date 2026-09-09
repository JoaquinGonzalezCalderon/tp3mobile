import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { colors, radius, spacing } from '@/theme/tokens';

type IconName = keyof typeof Ionicons.glyphMap;

type Props = TextInputProps & {
  label: string;
  error?: string;
  icon?: IconName;
  password?: boolean;
};

export const FormField = forwardRef<TextInput, Props>(function FormField(
  { label, error, icon, password, editable = true, ...props },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputShell,
        focused && styles.inputFocused,
        error && styles.inputError,
        !editable && styles.inputDisabled,
      ]}>
        {icon ? <Ionicons color={colors.muted} name={icon} size={20} /> : null}
        <TextInput
          {...props}
          ref={ref}
          editable={editable}
          onBlur={(event) => {
            setFocused(false);
            props.onBlur?.(event);
          }}
          onFocus={(event) => {
            setFocused(true);
            props.onFocus?.(event);
          }}
          placeholderTextColor="#AAA6B7"
          secureTextEntry={password && !visible}
          selectionColor={colors.primary}
          style={styles.input}
        />
        {password ? (
          <Pressable
            accessibilityLabel={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            accessibilityRole="button"
            hitSlop={10}
            onPress={() => setVisible((value) => !value)}
          >
            <Ionicons color={colors.muted} name={visible ? 'eye-off-outline' : 'eye-outline'} size={21} />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  label: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  inputShell: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 56,
    paddingHorizontal: spacing.md,
  },
  inputFocused: { borderColor: colors.primary },
  inputError: { borderColor: colors.danger },
  inputDisabled: { backgroundColor: colors.background, opacity: 0.7 },
  input: { color: colors.ink, flex: 1, fontSize: 16, minHeight: 52, paddingVertical: 0 },
  error: { color: colors.danger, fontSize: 12, lineHeight: 17 },
});

