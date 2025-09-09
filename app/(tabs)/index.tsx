import { ActivityIndicator, FlatList, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';


// api functions
import RecipeList from '@/components/recipe/RecipeList';
import { type Tag } from '@/utils/api/tags';
import { navigate } from 'expo-router/build/global-state/routing';

// react query
import { useRecipeQuery } from '@/hooks/query/useRecipeQuery';
import { useTagQuery } from '@/hooks/query/useTagQuery';

export default function HomeScreen() {
  // const { data: recipes, isPending: recipeIsPending, error: queryRecipeError } = useQuery(createRecipeQueryOptions());
  const { data: recipes, isPending: recipeIsPending, error: queryRecipeError } = useRecipeQuery();
  const { data: tags, isPending: tagIsPendintg, error: queryTagError } = useTagQuery();

  return (
    <SafeAreaView style={styles.recipesContainer}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: 0, marginBottom: 16 }}>
          <ThemedText type="subtitle" style={{ marginLeft: 0, marginBottom: 8 }}>Popular Tags</ThemedText>
          {tagIsPendintg ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
            </View>
          ) : queryTagError ? (
            <View style={styles.errorContainer}>
              <ThemedText type="defaultSemiBold" style={styles.errorText}>{JSON.stringify(queryTagError)}</ThemedText>
            </View>
          ) : (
            <FlatList
              data={tags.data}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 0, paddingVertical: 5 }}
              renderItem={({ item }: { item: Tag }) => (
                <Pressable onPress={() => navigate(`recipes/${item}`)}>
                  <ThemedView style={{ marginRight: 8, paddingVertical: 4, paddingHorizontal: 12, backgroundColor: '#000000', borderRadius: 20 }}>
                    <ThemedText type="defaultSemiBold" style={{ color: '#ffffff' }}>{item}</ThemedText>
                  </ThemedView>
                </Pressable>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>

        <View>
          <ThemedText type="subtitle" style={{ marginLeft: 0, marginBottom: 8 }}>Popular Recipes</ThemedText>
          {recipeIsPending ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
            </View>
          ) : queryRecipeError ? (
            <View style={styles.errorContainer}>
              <ThemedText type="defaultSemiBold" style={styles.errorText}>{queryRecipeError}</ThemedText>
            </View>
          ) : (
            <RecipeList data={recipes.data} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  }
});