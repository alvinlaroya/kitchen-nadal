import {
  useQuery
} from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// icons
import Ionicons from '@expo/vector-icons/Ionicons';

// api functions
import { fetchRecipeById } from '@/utils/api/recipes';

export default function Details() {
  const { id } = useLocalSearchParams();

  const { data: details, isPending, error } = useQuery({
    queryKey: ['details', id],
    queryFn: () => fetchRecipeById(Number(id)),
    enabled: !!id, // Only run the query if id is defined
  });

  return (
    isPending ? (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    ) : error ? (
      <ThemedView style={styles.errorContainer}>
        <ThemedText type="defaultSemiBold" style={styles.errorText}>{error}</ThemedText>
      </ThemedView>
    ) : (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={{ uri: details.data?.image || '' }}
            style={styles.reactLogo}
          />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">{details?.data.name}</ThemedText>
        </ThemedView>

        <ThemedView style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          <ThemedView style={styles.recipeInfo}>
            <ThemedText type="subtitle" style={styles.recipeTitle}>Prep Time</ThemedText>
            <ThemedView style={styles.cookTimeContainer}>
              <Ionicons name="time-outline" size={16} color="gray" />
              <ThemedText style={styles.cookTimeText}>{details.data.prepTimeMinutes} mins</ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.recipeInfo}>
            <ThemedText type="subtitle" style={styles.recipeTitle}>Cook Time</ThemedText>
            <ThemedView style={styles.cookTimeContainer}>
              <Ionicons name="time-outline" size={16} color="gray" />
              <ThemedText style={styles.cookTimeText}>{details.data.cookTimeMinutes} mins</ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.recipeInfo}>
            <ThemedText type="subtitle" style={styles.recipeTitle}>Cuisine</ThemedText>
            <ThemedView style={styles.cookTimeContainer}>
              <ThemedText style={styles.cookTimeText}>{details.data.cuisine}</ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.recipeInfo}>
            <ThemedText type="subtitle" style={styles.recipeTitle}>Meal Type</ThemedText>
            <ThemedView style={styles.cookTimeContainer}>
              <ThemedText style={styles.cookTimeText}>{details.data.mealType}</ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={{ marginTop: 10, width: '100%' }}>
            <ThemedText type="subtitle" style={{ fontSize: 14 }}>Ingridients</ThemedText>
            {details.data.ingredients?.map((ingredient, index) => (
              <ThemedText key={index} style={styles.cookTimeText}>• {ingredient}</ThemedText>
            ))}
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView >
    ));
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    margin: 16,
  },
  errorText: {
    color: '#c62828',
  },
  recipesContainer: {
    flex: 1,
    padding: 0
  },
  flatListContent: {
    //paddingHorizontal: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  recipeInfo: {
    backgroundColor: '#eee',
    borderRadius: 10,
    width: '23%',
    padding: 7,
    gap: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recipeTitle: {
    fontSize: 12,
    lineHeight: 18,
  },
  cookTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#eee',
  },
  cookTimeText: {
    fontSize: 11,
    opacity: 0.7,
  },
  clockIcon: {
    width: 16,
    height: 16,
    elevation: 4,
  },
  reactLogo: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});