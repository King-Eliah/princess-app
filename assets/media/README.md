# 📁 Media Assets Folder

This folder contains all your photos, videos, and songs for the app.

## 📂 Folder Structure

```
assets/media/
├── photos/     📸 Your photos here (.jpg, .png, .jpeg)
├── videos/     🎥 Your videos here (.mp4, .mov, .avi)
├── songs/      🎵 Your songs here (.mp3, .wav, .m4a)
└── mediaConfig.ts  ⚙️ Configuration file
```

## 📝 How to Add Your Media

### **Step 1: Add Your Files**

1. Copy your photos to `assets/media/photos/`
2. Copy your videos to `assets/media/videos/`
3. Copy your songs to `assets/media/songs/`

### **Step 2: Update Configuration**

Edit `assets/media/mediaConfig.ts` and update the arrays:

```javascript
photos: [
  {
    id: 1,
    filename: 'your-photo.jpg', // Your actual filename
    title: 'Your Photo Title',
    date: 'Date',
    description: 'Description',
  },
],

videos: [
  {
    id: 1,
    filename: 'your-video.mp4', // Your actual filename
    thumbnail: 'thumbnail.jpg', // Optional thumbnail
    title: 'Your Video Title',
    date: 'Date',
    description: 'Description',
  },
],

songs: [
  {
    id: 1,
    filename: 'your-song.mp3', // Your actual filename
    title: 'Your Song Title',
    artist: 'Artist Name',
    duration: '3:45',
    description: 'Description',
  },
],
```

### **Step 3: Supported File Types**

**Photos**: `.jpg`, `.jpeg`, `.png`, `.gif`
**Videos**: `.mp4`, `.mov`, `.avi`, `.mkv`
**Songs**: `.mp3`, `.wav`, `.m4a`, `.aac`

## 🎯 Benefits

✅ **All in One Place**: All media organized in one folder  
✅ **Easy to Update**: Just replace files and update config  
✅ **No External Dependencies**: No need for external hosting  
✅ **Fast Loading**: Local files load instantly  
✅ **Privacy**: Your media stays private

## 📱 How It Works

The app automatically loads your media from these folders and displays them in:

- **Photos Screen**: Shows photos and videos in a carousel
- **Music Screen**: Plays your songs with controls
- **Other Screens**: Uses photos for backgrounds and thumbnails

## 🔄 Updating Media

1. **Replace Files**: Put new files in the appropriate folders
2. **Update Config**: Edit `mediaConfig.ts` with new file info
3. **Restart App**: The changes will appear immediately

## 💡 Tips

- **File Names**: Use simple names without spaces (e.g., `first-date.jpg`)
- **File Sizes**: Keep files reasonably sized for fast loading
- **Backup**: Keep a backup of your media files
- **Organization**: Use descriptive filenames for easy management

## 🎨 Customization

You can customize:

- **Titles**: Change the display titles
- **Dates**: Update the dates shown
- **Descriptions**: Add personal descriptions
- **Order**: Reorder items by changing the `id` values

Your media, your story! 💜
