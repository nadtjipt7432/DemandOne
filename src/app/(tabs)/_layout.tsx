import { Tabs } from 'expo-router';
import { TabBar, TabBarProps } from '@/components/TabBar';

export default function TabsLayout() {
  return (
    <Tabs
      // `freezeOnBlur` would stop an inactive tab's screen from re-rendering at all —
      // fatal for this app's theming, which works by mutating a shared `colors`
      // object and relying on every mounted screen re-rendering to pick it up (see
      // theme.ts). Without this, a tab left in the background during a dark-mode
      // toggle can get stuck showing the old palette even after switching back to
      // it. `sceneStyle`'s background is intentionally left to each screen's own
      // `<Screen>` component instead of being set once here — this component never
      // re-renders on theme change, so a color baked in here would go stale the
      // same way.
      screenOptions={{ headerShown: false, freezeOnBlur: false }}
      tabBar={(props) => <TabBar {...(props as unknown as TabBarProps)} />}>
      <Tabs.Screen name="today" />
      <Tabs.Screen name="discover" />
      <Tabs.Screen name="ask" />
      <Tabs.Screen name="matches" />
      <Tabs.Screen name="you" />
    </Tabs>
  );
}
