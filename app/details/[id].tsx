import { Image } from 'expo-image';
import { useLocalSearchParams } from "expo-router";
import { useRef } from 'react';

import {
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// icons
import Ionicons from '@expo/vector-icons/Ionicons';

// react query hooks
import { useRecipeByIdQuery } from '@/hooks/query/useRecipeQuery';

import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_HEIGHT = 250;
const STICKY_HEADER_HEIGHT = 90;

const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Ionicons key={i} name="star" size={16} color="#FFD700" />);
  }

  if (hasHalfStar) {
    stars.push(<Ionicons key="half" name="star-half" size={16} color="#FFD700" />);
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#FFD700" />);
  }

  return stars;
};

export default function Details() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;

  const { data: details, isPending, error } = useRecipeByIdQuery(parseInt(id as string, 10));

  // Header animation interpolation
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - STICKY_HEADER_HEIGHT - 50, HEADER_HEIGHT - STICKY_HEADER_HEIGHT],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - STICKY_HEADER_HEIGHT - 50, HEADER_HEIGHT - STICKY_HEADER_HEIGHT],
    outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.9)'],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: 'clamp',
  });

  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT * 0.3],
    extrapolate: 'clamp',
  });

  if (isPending) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText type="defaultSemiBold" style={styles.errorText}>{error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Animated Sticky Header */}
      <Animated.View 
        style={[
          styles.stickyHeader,
          {
            backgroundColor: headerBackgroundColor,
            opacity: headerOpacity,
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.stickyHeaderButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <Animated.Text 
          style={[styles.stickyHeaderTitle, { opacity: headerOpacity }]}
          numberOfLines={1}
        >
          {details.data.name}
        </Animated.Text>
        
        <TouchableOpacity style={styles.stickyHeaderButton}>
          <Ionicons name="heart-outline" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Parallax Header Image */}
        <View style={styles.imageContainer}>
          <Animated.View
            style={[
              styles.imageWrapper,
              {
                transform: [
                  { scale: imageScale },
                  { translateY: imageTranslateY }
                ]
              }
            ]}
          >
            <Image 
              source={{ uri: details.data.image }} 
              contentFit='cover' 
              style={styles.recipeImage} 
            />
            <View style={styles.imageOverlay} />
          </Animated.View>
          
          {/* Floating Header Buttons */}
          <View style={styles.floatingHeaderButtons}>
            <TouchableOpacity 
              style={styles.floatingButton} 
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatingButton}>
              <Ionicons name="heart-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Container with Card Design */}
        <View style={styles.contentCard}>
          {/* Title and Rating */}
          <View style={styles.titleSection}>
            <Text style={styles.recipeName}>{details.data.name}</Text>
            
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {renderStars(details.data.rating)}
              </View>
              <Text style={styles.ratingText}>
                {details.data.rating} ({details.data.reviewCount} reviews)
              </Text>
            </View>
          </View>

          {/* Tags with Modern Design */}
          <View style={styles.tagsContainer}>
            {details.data.tags.map((tag, index) => (
              <View key={index} style={styles.modernTag}>
                <Text style={styles.modernTagText}>{tag}</Text>
              </View>
            ))}
            <View style={styles.difficultyTag}>
              <Text style={styles.difficultyTagText}>{details.data.difficulty}</Text>
            </View>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="time-outline" size={20} color="#FF6B6B" />
              </View>
              <Text style={styles.statLabel}>Prep</Text>
              <Text style={styles.statValue}>{details.data.prepTimeMinutes}min</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="flame-outline" size={20} color="#FF6B6B" />
              </View>
              <Text style={styles.statLabel}>Cook</Text>
              <Text style={styles.statValue}>{details.data.cookTimeMinutes}min</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="people-outline" size={20} color="#FF6B6B" />
              </View>
              <Text style={styles.statLabel}>Servings</Text>
              <Text style={styles.statValue}>{details.data.servings}</Text>
            </View>
          </View>

          {/* Additional Info Cards */}
          <View style={styles.additionalInfoCards}>
            <View style={styles.infoCard}>
              <Ionicons name="fitness-outline" size={22} color="#4ECDC4" />
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardValue}>{details.data.caloriesPerServing}</Text>
                <Text style={styles.infoCardLabel}>cal/serving</Text>
              </View>
            </View>
            
            <View style={styles.infoCard}>
              <Ionicons name="restaurant-outline" size={22} color="#FFA726" />
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardValue}>{details.data.cuisine}</Text>
                <Text style={styles.infoCardLabel}>cuisine</Text>
              </View>
            </View>
          </View>

          {/* Ingredients Section */}
          <View style={styles.modernSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Ionicons name="list-outline" size={15} color="white" />
              </View>
              <Text style={styles.modernSectionTitle}>Ingredients</Text>
            </View>
            
            <View style={styles.ingredientsGrid}>
              {details.data.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.modernIngredientItem}>
                  <View style={styles.ingredientCheckbox}>
                    <Ionicons name="checkmark" size={12} color="white" />
                  </View>
                  <Text style={styles.modernIngredientText}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Instructions Section */}
          <View style={styles.modernSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Ionicons name="receipt-outline" size={15} color="white" />
              </View>
              <Text style={styles.modernSectionTitle}>Instructions</Text>
            </View>
            
            {details.data.instructions.map((instruction, index) => (
              <View key={index} style={styles.modernInstructionItem}>
                <View style={styles.modernStepNumber}>
                  <Text style={styles.modernStepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.modernInstructionText}>{instruction}</Text>
              </View>
            ))}
          </View>

          {/* Modern Action Buttons */}
          <View style={styles.modernActionButtons}>
            <TouchableOpacity style={styles.modernPrimaryButton}>
              <Ionicons name="bookmark" size={22} color="white" />
              <Text style={styles.modernPrimaryButtonText}>Save Recipe</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modernSecondaryButton}>
              <Ionicons name="share-social" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
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
  
  // Sticky Header Styles
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: STICKY_HEADER_HEIGHT + 4,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    zIndex: 1000,
  },
  stickyHeaderButton: {
    width: 44,
    height: 44,
    top: 6,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickyHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  
  // Image Header Styles
  imageContainer: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  floatingHeaderButtons: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  floatingButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  
  // Content Card Styles
  contentCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  
  // Title Section
  titleSection: {
    marginBottom: 20,
  },
  recipeName: {
    fontSize: 23,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 12,
    lineHeight: 23,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  
  // Modern Tags
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  modernTag: {
    backgroundColor: '#f0f4f8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 8,
  },
  modernTagText: {
    fontSize: 12,
    color: '#4a5568',
    fontWeight: '600',
  },
  difficultyTag: {
    backgroundColor: '#fff5f5',
    borderColor: '#FF6B6B',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 8,
  },
  difficultyTagText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  
  // Stats Cards
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '700',
  },
  
  // Info Cards
  additionalInfoCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoCardContent: {
    marginLeft: 14,
  },
  infoCardValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  infoCardLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  
  // Modern Sections
  modernSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 22,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modernSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  
  // Ingredients
  ingredientsGrid: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
  },
  modernIngredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  ingredientCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modernIngredientText: {
    fontSize: 12,
    color: '#374151',
    flex: 1,
    lineHeight: 12,
    fontWeight: '500',
  },
  
  // Instructions
  modernInstructionItem: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  modernStepNumber: {
    width: 20,
    height: 20,
    borderRadius: 16,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  modernStepNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  modernInstructionText: {
    fontSize: 12,
    color: '#374151',
    flex: 1,
    lineHeight: 12,
    fontWeight: '500',
  },
  
  // Modern Action Buttons
  modernActionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modernPrimaryButton: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modernPrimaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  modernSecondaryButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});