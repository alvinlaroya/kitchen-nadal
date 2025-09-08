import {
    useQuery
} from '@tanstack/react-query';
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

import RecipeList from '@/components/recipe/RecipeList';

// api functions
import { fetchRecipeByTag } from '@/utils/api/recipes';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Recipes() {
    const { tag } = useLocalSearchParams();

    const { data: recipes, isPending, error } = useQuery({
        queryKey: ['recipesByTag', tag],
        queryFn: () => fetchRecipeByTag(tag as string),
        enabled: !!tag, // Only run the query if id is defined
    });

    return (
        <SafeAreaView style={styles.recipesContainer}>
            <ScrollView
                contentContainerStyle={{}}
                showsVerticalScrollIndicator={false}
            >
                <View>
                    {isPending ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" />
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <ThemedText type="defaultSemiBold" style={styles.errorText}>{error}</ThemedText>
                        </View>
                    ) : (
                        <RecipeList data={recipes.data.recipes} />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
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
        paddingHorizontal: 16,
    },
    flatListContent: {
        //paddingHorizontal: 8,
    },
    row: {
        justifyContent: 'space-between',
    },
    reactLogo: {
        height: '100%',
        width: '100%',
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});