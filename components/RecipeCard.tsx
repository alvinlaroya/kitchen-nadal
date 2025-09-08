import { navigate } from 'expo-router/build/global-state/routing';

import Ionicons from '@expo/vector-icons/Ionicons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Image } from 'expo-image';
import { Pressable, StyleSheet } from 'react-native';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

// types
import { type Recipe } from '@/utils/api/recipes';

export default function RecipeCard({ id, image, name, mealType, cookTimeMinutes }: Recipe) {
    return (
        <Pressable style={styles.recipeCard} onPress={() => navigate('details/' + id, { image })}>
            <Image
                source={{ uri: image }}
                style={styles.recipeImage}
                placeholder={{ blurhash }}
                contentFit="cover"
                transition={200}
            />
            <ThemedView style={styles.recipeInfo}>
                <ThemedText type="subtitle" style={styles.recipeTitle}>{name}</ThemedText>
                <ThemedView style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    <ThemedView style={styles.cookTimeContainer}>
                        <Ionicons name="fast-food-outline" size={16} color="gray" />
                        <ThemedText style={styles.cookTimeText}>{mealType}</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.cookTimeContainer}>
                        <Ionicons name="time-outline" size={16} color="gray" />
                        <ThemedText style={styles.cookTimeText}>{cookTimeMinutes} mins</ThemedText>
                    </ThemedView>
                </ThemedView>
            </ThemedView>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    recipeCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        flex: 1,
        marginHorizontal: 4,
        marginVertical: 8,
    },
    recipeImage: {
        width: '100%',
        height: 150,
    },
    recipeInfo: {
        padding: 7,
        gap: 2,
    },
    recipeTitle: {
        fontSize: 12,
        lineHeight: 18,
    },
    cookTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    cookTimeText: {
        fontSize: 10,
        opacity: 0.7,
    },
    clockIcon: {
        width: 16,
        height: 16,
        elevation: 4,
    }
});