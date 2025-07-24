import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { postsApi } from '../../services/api';

const PostScreen: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePost = async () => {
    if (!title.trim()) {
      Alert.alert('错误', '请输入标题');
      return;
    }

    try {
      setIsLoading(true);
      await postsApi.createPost({
        title: title.trim(),
        description: description.trim() || undefined,
        image_url: imageUrl.trim() || undefined,
      });

      Alert.alert('成功', '美食分享发布成功！', [
        {
          text: '确定',
          onPress: () => {
            setTitle('');
            setDescription('');
            setImageUrl('');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('发布失败', '请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>分享美食</Text>
        <Text style={styles.headerSubtitle}>记录你的美食时光</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Meal Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>选择餐点类型</Text>
          <View style={styles.mealTypeContainer}>
            <TouchableOpacity style={styles.mealTypeButton}>
              <Text style={styles.mealTypeEmoji}>🌅</Text>
              <Text style={styles.mealTypeText}>早餐</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mealTypeButton}>
              <Text style={styles.mealTypeEmoji}>☀️</Text>
              <Text style={styles.mealTypeText}>午餐</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mealTypeButton}>
              <Text style={styles.mealTypeEmoji}>🌙</Text>
              <Text style={styles.mealTypeText}>晚餐</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mealTypeButton}>
              <Text style={styles.mealTypeEmoji}>🍃</Text>
              <Text style={styles.mealTypeText}>小食</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Post Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>标题</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="给你的美食起个好听的名字"
              maxLength={50}
            />
            <Text style={styles.characterCount}>{title.length}/50</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>描述</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="分享一下这道美食的故事吧..."
              multiline
              numberOfLines={4}
              maxLength={200}
            />
            <Text style={styles.characterCount}>{description.length}/200</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>图片链接 (可选)</Text>
            <TextInput
              style={styles.input}
              value={imageUrl}
              onChangeText={setImageUrl}
              placeholder="https://example.com/image.jpg"
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          {/* Location Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>位置信息</Text>
            <View style={styles.locationContainer}>
              <TouchableOpacity style={styles.locationButton}>
                <Text style={styles.locationEmoji}>📍</Text>
                <Text style={styles.locationText}>添加位置</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Nutrition Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>营养信息 (可选)</Text>
            <View style={styles.nutritionContainer}>
              <TouchableOpacity style={styles.nutritionButton}>
                <Text style={styles.nutritionEmoji}>🔥</Text>
                <Text style={styles.nutritionText}>热量</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nutritionButton}>
                <Text style={styles.nutritionEmoji}>🥩</Text>
                <Text style={styles.nutritionText}>蛋白质</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nutritionButton}>
                <Text style={styles.nutritionEmoji}>🍞</Text>
                <Text style={styles.nutritionText}>碳水</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.postButton, isLoading && styles.disabledButton]}
          onPress={handlePost}
          disabled={isLoading}
        >
          <Text style={styles.postButtonText}>
            {isLoading ? '发布中...' : '发布分享'}
          </Text>
        </TouchableOpacity>
      </View>
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
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  mealTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealTypeButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  mealTypeEmoji: {
    fontSize: 20,
    marginBottom: 8,
  },
  mealTypeText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  form: {
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  locationContainer: {
    flexDirection: 'row',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  locationEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
  },
  nutritionEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  nutritionText: {
    fontSize: 12,
    color: '#666',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  postButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PostScreen;