import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Recipe } from '../../types';
import { recipesApi } from '../../services/api';

const DiscoverScreen: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      const fetchedRecipes = await recipesApi.getRecipes();
      setRecipes(fetchedRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>发现</Text>
        <Text style={styles.headerSubtitle}>探索校园美食</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="搜索美食、食谱..."
        />
      </View>

      <ScrollView style={styles.content}>
        {/* Category Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>美食分类</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryContainer}>
              <TouchableOpacity style={styles.categoryCard}>
                <Text style={styles.categoryEmoji}>🥐</Text>
                <Text style={styles.categoryText}>早餐</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryCard}>
                <Text style={styles.categoryEmoji}>🍜</Text>
                <Text style={styles.categoryText}>午餐</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryCard}>
                <Text style={styles.categoryEmoji}>🍱</Text>
                <Text style={styles.categoryText}>晚餐</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryCard}>
                <Text style={styles.categoryEmoji}>🧋</Text>
                <Text style={styles.categoryText}>饮品</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryCard}>
                <Text style={styles.categoryEmoji}>🍰</Text>
                <Text style={styles.categoryText}>甜点</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Popular Locations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>热门位置</Text>
          <View style={styles.locationGrid}>
            <TouchableOpacity style={styles.locationCard}>
              <Text style={styles.locationEmoji}>🏫</Text>
              <Text style={styles.locationText}>学生食堂</Text>
              <Text style={styles.locationSubtext}>256 家店铺</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.locationCard}>
              <Text style={styles.locationEmoji}>🍕</Text>
              <Text style={styles.locationText}>校门口</Text>
              <Text style={styles.locationSubtext}>128 家店铺</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.locationCard}>
              <Text style={styles.locationEmoji}>🛒</Text>
              <Text style={styles.locationText}>商业街</Text>
              <Text style={styles.locationSubtext}>89 家店铺</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.locationCard}>
              <Text style={styles.locationEmoji}>🏠</Text>
              <Text style={styles.locationText}>宿舍区</Text>
              <Text style={styles.locationSubtext}>45 家店铺</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recipes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>精选食谱</Text>
          {recipes.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>暂无食谱</Text>
              <Text style={styles.emptySubtitle}>快来分享你的拿手菜谱吧！</Text>
            </View>
          ) : (
            recipes.map((recipe) => (
              <View key={recipe.id} style={styles.recipeCard}>
                <View style={styles.recipeHeader}>
                  <Text style={styles.recipeTitle}>{recipe.title}</Text>
                  <Text style={styles.recipeAuthor}>by @{recipe.author.username}</Text>
                </View>
                
                {recipe.description && (
                  <Text style={styles.recipeDescription}>{recipe.description}</Text>
                )}
                
                {recipe.ingredients && recipe.ingredients.length > 0 && (
                  <View style={styles.ingredientsContainer}>
                    <Text style={styles.ingredientsTitle}>主要食材:</Text>
                    <Text style={styles.ingredientsText}>
                      {recipe.ingredients.slice(0, 3).join(', ')}
                      {recipe.ingredients.length > 3 && '...'}
                    </Text>
                  </View>
                )}
                
                <TouchableOpacity style={styles.viewRecipeButton}>
                  <Text style={styles.viewRecipeButtonText}>查看食谱</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Trending Hashtags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>热门话题</Text>
          <View style={styles.hashtagContainer}>
            <TouchableOpacity style={styles.hashtagButton}>
              <Text style={styles.hashtagText}>#早餐日记</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.hashtagButton}>
              <Text style={styles.hashtagText}>#健康轻食</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.hashtagButton}>
              <Text style={styles.hashtagText}>#校园美食</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.hashtagButton}>
              <Text style={styles.hashtagText}>#自制料理</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.hashtagButton}>
              <Text style={styles.hashtagText}>#营养搭配</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.hashtagButton}>
              <Text style={styles.hashtagText}>#减脂餐</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: 80,
  },
  categoryEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  locationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  locationCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  locationEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  locationSubtext: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
  },
  recipeCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  recipeHeader: {
    marginBottom: 12,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  recipeAuthor: {
    fontSize: 12,
    color: '#FF6B35',
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  ingredientsContainer: {
    marginBottom: 12,
  },
  ingredientsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  ingredientsText: {
    fontSize: 12,
    color: '#666',
  },
  viewRecipeButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  viewRecipeButtonText: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '500',
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hashtagButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  hashtagText: {
    fontSize: 12,
    color: '#666',
  },
});

export default DiscoverScreen;