

// lucide icons

// custom components
import RecipeCard from '@/components/RecipeCard';

import { FlatList, StyleSheet, View } from 'react-native';


// api functions
import { Recipe } from '@/utils/api/recipes';
import { Recipes } from '@/utils/query_options/createRecipeQueryOptions';

export default function RecipeList({ data }: { data: Recipes }) {
    const renderRecipeItem = ({ item }: { item: Recipe }) => (
        <RecipeCard id={item.id} image={item.image} name={item.name} mealType={item.mealType} cookTimeMinutes={item.cookTimeMinutes} />
    );

    return (
        <View style={styles.recipesContainer}>
            <FlatList
                data={data.recipes}
                renderItem={renderRecipeItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false} // Since we're inside ParallaxScrollView
                contentContainerStyle={styles.flatListContent}
            />
        </View>
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
        padding: 0
    },
    flatListContent: {
        //paddingHorizontal: 8,
    },
    row: {
        justifyContent: 'space-between',
    }
});