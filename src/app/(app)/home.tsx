import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/BrandMark';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { colors, radius, spacing } from '@/theme/tokens';

export default function HomeScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const name = session?.user.user_metadata?.full_name as string | undefined;

  const signOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    await supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <BrandMark />
          <Pressable
            accessibilityLabel="Cerrar sesión"
            accessibilityRole="button"
            disabled={signingOut}
            onPress={signOut}
            style={styles.logout}
          >
            <Ionicons color={colors.ink} name="log-out-outline" size={21} />
          </Pressable>
        </View>

        <View style={styles.hero}>
          <View>
            <Text style={styles.greeting}>Hola{name ? `, ${name.split(' ')[0]}` : ''}</Text>
            <Text style={styles.caption}>Tu cuenta está protegida y lista.</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.cardLabel}>SALDO DISPONIBLE</Text>
              <Ionicons color="rgba(255,255,255,0.8)" name="wifi" size={22} />
            </View>
            <Text style={styles.balance}>$ 0,00</Text>
            <Text style={styles.cardEmail} numberOfLines={1}>{session?.user.email}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Accesos rápidos</Text>
        <View style={styles.actions}>
          {[
            ['paper-plane-outline', 'Transferir'],
            ['card-outline', 'Tarjetas'],
            ['receipt-outline', 'Pagos'],
          ].map(([icon, label]) => (
            <View key={label} style={styles.action}>
              <View style={styles.actionIcon}>
                <Ionicons color={colors.primary} name={icon as keyof typeof Ionicons.glyphMap} size={23} />
              </View>
              <Text style={styles.actionText}>{label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.demoNotice}>
          <Ionicons color={colors.primary} name="shield-checkmark" size={24} />
          <View style={styles.demoText}>
            <Text style={styles.demoTitle}>Autenticación completada</Text>
            <Text style={styles.demoCopy}>Esta pantalla demuestra la protección de rutas y el cierre de sesión.</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.surface, flex: 1 },
  container: { flex: 1, marginHorizontal: 'auto', maxWidth: 620, padding: spacing.lg, width: '100%' },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  logout: { alignItems: 'center', borderColor: colors.border, borderRadius: 12, borderWidth: 1, height: 44, justifyContent: 'center', width: 44 },
  hero: { gap: spacing.lg, marginTop: spacing.xl },
  greeting: { color: colors.ink, fontSize: 28, fontWeight: '800', letterSpacing: -0.8 },
  caption: { color: colors.muted, fontSize: 14, marginTop: spacing.xs },
  card: { backgroundColor: colors.primary, borderRadius: radius.lg, minHeight: 190, padding: spacing.lg },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  balance: { color: colors.surface, fontSize: 34, fontWeight: '800', letterSpacing: -1, marginTop: 34 },
  cardEmail: { color: 'rgba(255,255,255,0.78)', fontSize: 13, marginTop: 'auto' },
  sectionTitle: { color: colors.ink, fontSize: 18, fontWeight: '800', marginTop: spacing.xl },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  action: { alignItems: 'center', flex: 1, gap: spacing.sm },
  actionIcon: { alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: radius.md, height: 58, justifyContent: 'center', width: '100%' },
  actionText: { color: colors.ink, fontSize: 12, fontWeight: '700' },
  demoNotice: { alignItems: 'flex-start', backgroundColor: colors.background, borderRadius: radius.md, flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl, padding: spacing.md },
  demoText: { flex: 1, gap: 4 },
  demoTitle: { color: colors.ink, fontSize: 14, fontWeight: '800' },
  demoCopy: { color: colors.muted, fontSize: 12, lineHeight: 18 },
});
