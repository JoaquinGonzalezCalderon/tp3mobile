import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { passwordChecks } from '@/lib/validation';
import { colors, spacing } from '@/theme/tokens';

const labels = {
  length: '8 caracteres como mínimo',
  uppercase: 'Una letra mayúscula',
  lowercase: 'Una letra minúscula',
  number: 'Un número',
  symbol: 'Un símbolo',
};

export function PasswordChecklist({ password }: { password: string }) {
  const checks = passwordChecks(password);

  return (
    <View style={styles.grid}>
      {(Object.keys(labels) as (keyof typeof labels)[]).map((key) => {
        const valid = checks[key];
        return (
          <View key={key} style={styles.item}>
            <Ionicons
              color={valid ? colors.success : colors.muted}
              name={valid ? 'checkmark-circle' : 'ellipse-outline'}
              size={17}
            />
            <Text style={[styles.text, valid && styles.valid]}>{labels[key]}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: spacing.xs, paddingVertical: 2 },
  item: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  text: { color: colors.muted, fontSize: 12 },
  valid: { color: colors.success, fontWeight: '600' },
});

