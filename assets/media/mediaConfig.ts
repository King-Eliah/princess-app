// Media Configuration File
// Add your photos, videos, and songs here

export const mediaConfig = {
  photos: [
    {
      id: 1,
      filename: 'first-date.jpg', // Put your actual photo file here
      title: 'Our First Date',
      date: 'February 18, 2024',
      description: 'The day that changed everything 💜',
    },
    {
      id: 2,
      filename: 'coffee-together.jpg',
      title: 'Coffee Together',
      date: 'March 5, 2024',
      description: 'Simple moments, beautiful memories ☕',
    },
    {
      id: 3,
      filename: 'sunset-walk.jpg',
      title: 'Sunset Walk',
      date: 'March 22, 2024',
      description: 'Walking hand in hand as the sun sets 🌅',
    },
    {
      id: 4,
      filename: 'beach-day.jpg',
      title: 'Beach Day',
      date: 'April 10, 2024',
      description: 'Sand, sea, and endless love 🌊',
    },
    {
      id: 5,
      filename: 'mountain-adventure.jpg',
      title: 'Mountain Adventure',
      date: 'May 15, 2024',
      description: 'Reaching new heights together ⛰️',
    },
    {
      id: 6,
      filename: 'dinner-date.jpg',
      title: 'Dinner Date',
      date: 'June 8, 2024',
      description: 'Candlelit dinner and sweet conversations 🕯️',
    },
  ],

  videos: [
    {
      id: 1,
      filename: '1.mp4',
      thumbnail: 'video1-thumbnail.jpg',
      title: 'Our First Video',
      date: 'March 5, 2024',
      description: 'Capturing our beautiful moments on video 🎥',
    },
    {
      id: 2,
      filename: '2.mp4',
      thumbnail: 'video2-thumbnail.jpg',
      title: 'Beach Adventures',
      date: 'April 10, 2024',
      description: 'Fun times at the beach together 🌊',
    },
    {
      id: 3,
      filename: '3.mp4',
      thumbnail: 'video3-thumbnail.jpg',
      title: 'Sunset Memories',
      date: 'May 15, 2024',
      description: 'Watching the sunset together 🌅',
    },
    {
      id: 4,
      filename: '4.mp4',
      thumbnail: 'video4-thumbnail.jpg',
      title: 'Dinner Date',
      date: 'June 8, 2024',
      description: 'Romantic dinner moments 🕯️',
    },
    {
      id: 5,
      filename: '5.mp4',
      thumbnail: 'video5-thumbnail.jpg',
      title: 'Adventure Time',
      date: 'July 12, 2024',
      description: 'Exploring new places together 🗺️',
    },
    {
      id: 6,
      filename: '6.mp4',
      thumbnail: 'video6-thumbnail.jpg',
      title: 'Special Moments',
      date: 'August 20, 2024',
      description: 'Every moment with you is special 💜',
    },
  ],

  songs: [
    {
      id: 1,
      filename: 'our-song.mp3', // Put your actual song file here
      title: 'Our Special Song',
      artist: 'Artist Name',
      duration: '3:45',
      description: 'The song that reminds me of us 💜',
    },
    {
      id: 2,
      filename: 'romantic-melody.mp3',
      title: 'Romantic Melody',
      artist: 'Artist Name',
      duration: '4:20',
      description: 'Perfect for our quiet moments together 🎵',
    },
    {
      id: 3,
      filename: 'dance-with-me.mp3',
      title: 'Dance With Me',
      artist: 'Artist Name',
      duration: '3:30',
      description: 'Let\'s dance together forever 💃',
    },
    {
      id: 4,
      filename: 'love-story.mp3',
      title: 'Our Love Story',
      artist: 'Artist Name',
      duration: '4:15',
      description: 'Every note tells our story 📖',
    },
    {
      id: 5,
      filename: 'forever-yours.mp3',
      title: 'Forever Yours',
      artist: 'Artist Name',
      duration: '3:55',
      description: 'My heart belongs to you forever 💕',
    },
  ],
};

// Helper function to get file path - Fixed to avoid dynamic require()
export const getMediaPath = (type: 'photos' | 'videos' | 'songs', filename: string) => {
  if (type === 'photos') {
    // For photos, use placeholder URLs since we can't use dynamic require()
    return { uri: `https://via.placeholder.com/400x300/8B5A9B/FFFFFF?text=${filename}` };
  } else if (type === 'videos') {
    // For videos, use a simple file path approach
    return { uri: `file:///assets/media/videos/${filename}` };
  } else {
    // For songs, use a simple file path approach
    return { uri: `file:///assets/media/songs/${filename}` };
  }
};

// Helper function to get all media items for photos screen
export const getAllMediaItems = (): Array<{
  id: string;
  type: 'photo' | 'video';
  url: any;
  title: string;
  date: string;
  description: string;
  thumbnail?: any;
}> => {
  const mediaItems: Array<{
    id: string;
    type: 'photo' | 'video';
    url: any;
    title: string;
    date: string;
    description: string;
    thumbnail?: any;
  }> = [];
  
  // Add photos
  mediaConfig.photos.forEach(photo => {
    mediaItems.push({
      id: `photo-${photo.id}`,
      type: 'photo',
      url: getMediaPath('photos', photo.filename),
      title: photo.title,
      date: photo.date,
      description: photo.description,
    });
  });
  
  // Add videos
  mediaConfig.videos.forEach(video => {
    mediaItems.push({
      id: `video-${video.id}`,
      type: 'video',
      url: getMediaPath('videos', video.filename),
      title: video.title,
      date: video.date,
      description: video.description,
      thumbnail: video.thumbnail ? getMediaPath('photos', video.thumbnail) : null,
    });
  });
  
  return mediaItems;
};

// Helper function to get all songs for music screen
export const getAllSongs = () => {
  return mediaConfig.songs.map(song => ({
    id: song.id,
    title: song.title,
    artist: song.artist,
    duration: song.duration,
    description: song.description,
    audioUrl: getMediaPath('songs', song.filename),
  }));
}; 