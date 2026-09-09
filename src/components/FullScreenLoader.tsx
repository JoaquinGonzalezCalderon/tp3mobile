import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/BrandMark';
import { colors } from '@/theme/tokens';

export function FullScreenLoader() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <BrandMark />
        <ActivityIndicator color={colors.primary} size="small" />
        <Text style={styles.text}>Cargando tu sesión…</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.surface, flex: 1 },
  content: { alignItems: 'center', flex: 1, gap: 18, justifyContent: 'center' },
  text: { color: colors.muted, fontSize: 14 },
});
