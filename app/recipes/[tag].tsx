import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';


// react query hooks
import RecipeList from '@/components/recipe/RecipeList';
import { useRecipeByTagQuery } from '@/hooks/query/useRecipeByTagQuery';

export default function Recipes() {
    const { tag } = useLocalSearchParams();

    const { data: recipes, isPending, error } = useRecipeByTagQuery(tag as string);

    return (
        <ScrollView
            contentContainerStyle={{}}
            showsVerticalScrollIndicator={false}
            style={styles.recipesContainer}
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
                    <RecipeList data={recipes.data} />
                )}
            </View>
        </ScrollView>
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
        paddingVertical: 8,
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