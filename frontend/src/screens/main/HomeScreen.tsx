import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Post } from '../../types';
import { postsApi } from '../../services/api';

const HomeScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const fetchedPosts = await postsApi.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>旦食</Text>
        <Text style={styles.headerSubtitle}>发现校园美食</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {posts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>还没有美食分享</Text>
            <Text style={styles.emptySubtitle}>快去发布你的第一份美食吧！</Text>
          </View>
        ) : (
          posts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <Text style={styles.authorName}>@{post.author.username}</Text>
                <Text style={styles.postDate}>
                  {new Date(post.created_at).toLocaleDateString('zh-CN')}
                </Text>
              </View>
              
              <Text style={styles.postTitle}>{post.title}</Text>
              {post.description && (
                <Text style={styles.postDescription}>{post.description}</Text>
              )}
              
              <TouchableOpacity style={styles.likeButton}>
                <Text style={styles.likeButtonText}>❤️ 点赞</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* Meal Time Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>今日推荐</Text>
          <View style={styles.mealTimeCards}>
            <TouchableOpacity style={styles.mealTimeCard}>
              <Text style={styles.mealTimeEmoji}>🌅</Text>
              <Text style={styles.mealTimeTitle}>早餐</Text>
              <Text style={styles.mealTimeSubtitle}>开启美好一天</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.mealTimeCard}>
              <Text style={styles.mealTimeEmoji}>☀️</Text>
              <Text style={styles.mealTimeTitle}>午餐</Text>
              <Text style={styles.mealTimeSubtitle}>补充能量</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.mealTimeCard}>
              <Text style={styles.mealTimeEmoji}>🌙</Text>
              <Text style={styles.mealTimeTitle}>晚餐</Text>
              <Text style={styles.mealTimeSubtitle}>温暖结束</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
  },
  postCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
  postDate: {
    fontSize: 12,
    color: '#666',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  postDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  likeButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  likeButtonText: {
    fontSize: 12,
    color: '#FF6B35',
  },
  section: {
    marginTop: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  mealTimeCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealTimeCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  mealTimeEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  mealTimeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  mealTimeSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen;