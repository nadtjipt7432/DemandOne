import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { Btn, Divider, InfoRow, Screen, Txt } from '@/components/base';
import { Header } from '@/components/domain';
import { LocationPicker } from '@/components/LocationPicker';
import { useAppState } from '@/data/hooks';
import { setLocation } from '@/data/service';
import { colors, space } from '@/theme';

export default function Account() {
  const router = useRouter();
  const { people, viewerId } = useAppState();
  const viewer = people[viewerId];
  const [editingLocation, setEditingLocation] = useState(false);
  const [busy, setBusy] = useState(false);

  const saveLocation = async (loc: string) => {
    setBusy(true);
    await setLocation(loc);
    setBusy(false);
    setEditingLocation(false);
  };

  return (
    <Screen scroll>
      <Header onBack={() => router.back()} title="Account & login" />

      <View style={{ marginTop: space.lg }}>
        <InfoRow icon="user" label={viewer.name} value="Name" />
        <Divider />
        <InfoRow icon="mail" label="nadia@light.inc" value="Email" />
        <Divider />
        {editingLocation ? (
          <View style={{ paddingVertical: space.md, gap: space.sm }}>
            <Txt variant="small" color={colors.textFaint}>
              Location
            </Txt>
            {busy ? (
              <Txt variant="small" color={colors.textFaint}>
                Saving…
              </Txt>
            ) : (
              <LocationPicker onChange={saveLocation} />
            )}
            <Btn title="Cancel" variant="ghost" onPress={() => setEditingLocation(false)} />
          </View>
        ) : (
          <InfoRow
            icon="map-pin"
            label={viewer.location}
            value="Location"
            right={<Feather name="chevron-right" size={16} color={colors.textFaint} />}
            onPress={() => setEditingLocation(true)}
          />
        )}
      </View>

      <Txt variant="small" color={colors.textFaint} style={{ marginTop: space.xl }}>
        Your data is not inventory. Never sold, never used for advertising.
      </Txt>

      <Btn title="Sign out" variant="ghost" style={{ marginTop: space.xl }} onPress={() => router.replace('/')} />
    </Screen>
  );
}
