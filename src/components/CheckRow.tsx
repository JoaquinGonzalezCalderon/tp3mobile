import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/tokens';

type Props = { checked: boolean; disabled?: boolean; onChange: (value: boolean) => void };

export function CheckRow({ checked, disabled, onChange }: Props) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onChange(!checked)}
      style={styles.row}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? <Ionicons color={colors.surface} name="checkmark" size={15} /> : null}
      </View>
      <Text style={styles.text}>Acepto los <Text style={styles.link}>Términos y condiciones</Text></Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: 'center', flexDirection: 'row', gap: 10, minHeight: 44 },
  box: { alignItems: 'center', borderColor: colors.border, borderRadius: 5, borderWidth: 1.5, height: 22, justifyContent: 'center', width: 22 },
  boxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { color: colors.muted, flex: 1, fontSize: 13 },
  link: { color: colors.primary, fontWeight: '700' },
});

