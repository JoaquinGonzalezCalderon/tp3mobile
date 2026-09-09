import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { PropsWithChildren } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/BrandMark';
import { colors, spacing } from '@/theme/tokens';

type Props = PropsWithChildren<{
  title: string;
  subtitle: string;
  canGoBack?: boolean;
  footer?: React.ReactNode;
}>;

export function AuthScaffold({ title, subtitle, canGoBack, footer, children }: Props) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topRow}>
            {canGoBack ? (
              <Pressable
                accessibilityLabel="Volver"
                accessibilityRole="button"
                hitSlop={12}
                onPress={() => router.back()}
                style={({ pressed }) => [styles.back, pressed && styles.pressed]}
              >
                <Ionicons color={colors.ink} name="arrow-back" size={22} />
              </Pressable>
            ) : <View style={styles.backPlaceholder} />}
            <BrandMark />
            <View style={styles.backPlaceholder} />
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          <View style={styles.form}>{children}</View>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.surface, flex: 1 },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    marginHorizontal: 'auto',
    maxWidth: 520,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    width: '100%',
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 68,
  },
  back: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  backPlaceholder: { width: 44 },
  pressed: { opacity: 0.65 },
  header: { marginBottom: spacing.xl, marginTop: spacing.xl },
  title: { color: colors.ink, fontSize: 30, fontWeight: '800', letterSpacing: -1.1 },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 23, marginTop: spacing.sm },
  form: { gap: spacing.md },
  footer: { marginTop: 'auto', paddingTop: spacing.xl },
});

