import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Heart, Star, Sparkles, Flower, Music, Camera, Palette, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const favorites = [
  {
    id: 1,
    type: 'memory',
    title: 'Love At First Sight',
    description: 'The moment that changed everything',
    icon: Heart,
    color: '#FF69B4',
    date: 'March 15, 2024',
  },
  {
    id: 2,
    type: 'song',
    title: 'My worship',
    description: 'One of the many songs you made me fall inlove with',
    icon: Music,
    color: '#A020F0',
    date: 'Always',
  },
  {
    id: 3,
    type: 'place',
    title: 'My First Move',
    description: 'Finally gathering the courage to text you as more than a rep',
    icon: Star,
    color: '#DA70D6',
    date: 'February 18, 2025',
  },
  {
    id: 4,
    type: 'moment',
    title: 'Angelic Voice',
    description: 'Blew my mind with your voice',
    icon: Sparkles,
    color: '#FF1493',
    date: 'March 22, 2025',
  },
  {
    id: 5,
    type: 'gift',
    title: 'The Necklace',
    description: 'The first gift I gave you',
    icon: Flower,
    color: '#8A2BE2',
    date: 'June 10, 2025',
  },
  {
    id: 6,
    type: 'First Spam',
    title: 'The First Spam',
    description: 'The first spam i got from you, i was so happy',
    icon: Camera,
    color: '#BA55D3',
    date: 'June 2, 2025',
  },
  {
    id: 7,
    type: 'food',
    title: 'Pizza Night',
    description: 'Sharing our favorite meal and you destroying me in uno',
    icon: Heart,
    color: '#9370DB',
    date: '..., 2025',
  },
  {
    id: 8,
    type: 'movie',
    title: 'Kdrama',
    description: 'When life Gives You Tangerines',
    icon: Star,
    color: '#DDA0DD',
    date: 'April 25, 2025',
  },
];

export default function FavoritesScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: Heart },
    { id: 'memory', name: 'Memories', icon: Star },
    { id: 'song', name: 'Songs', icon: Music },
    { id: 'place', name: 'Places', icon: Camera },
    { id: 'moment', name: 'Moments', icon: Sparkles },
  ];

  const filteredFavorites = selectedCategory === 'all' 
    ? favorites 
    : favorites.filter(fav => fav.type === selectedCategory);

  const renderFavoriteCard = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.favoriteCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={[styles.cardHeader, { backgroundColor: item.color }]}>
        <item.icon size={24} color="#FFFFFF" />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
          {item.description}
        </Text>
        <Text style={[styles.cardDate, { color: colors.primary }]}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Heart size={30} color={colors.primary} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>My Favorites</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: selectedCategory === category.id ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <category.icon 
                  size={20} 
                  color={selectedCategory === category.id ? '#FFFFFF' : colors.text} 
                />
                <Text style={[
                  styles.categoryText,
                  { color: selectedCategory === category.id ? '#FFFFFF' : colors.text }
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Favorites Grid */}
        <View style={styles.favoritesGrid}>
          {filteredFavorites.map(renderFavoriteCard)}
        </View>

        {/* Empty State */}
        {filteredFavorites.length === 0 && (
          <View style={styles.emptyState}>
            <Heart size={60} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No favorites in this category yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Add some favorites to see them here
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            These are the things that make my heart smile 💜
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    padding: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
  },
  categoriesContainer: {
    marginBottom: 30,
  },
  categoriesScroll: {
    flexDirection: 'row',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  favoritesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 30,
  },
  favoriteCard: {
    width: (width - 55) / 2,
    borderWidth: 1,
    borderRadius: 15,
    overflow: 'hidden',
  },
  cardHeader: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    padding: 15,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  cardDate: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 5,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});