import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface AnimatedGalaxyBackgroundProps {
  children: React.ReactNode;
}

export default function AnimatedGalaxyBackground({ children }: AnimatedGalaxyBackgroundProps) {
           const star1Anim = useRef(new Animated.Value(0)).current;
         const star2Anim = useRef(new Animated.Value(0)).current;
         const star3Anim = useRef(new Animated.Value(0)).current;
         const star4Anim = useRef(new Animated.Value(0)).current;
         const star5Anim = useRef(new Animated.Value(0)).current;
         const star6Anim = useRef(new Animated.Value(0)).current;
         const star7Anim = useRef(new Animated.Value(0)).current;
         const star8Anim = useRef(new Animated.Value(0)).current;
         const star9Anim = useRef(new Animated.Value(0)).current;
         const star10Anim = useRef(new Animated.Value(0)).current;
         const star11Anim = useRef(new Animated.Value(0)).current;
         const star12Anim = useRef(new Animated.Value(0)).current;
         const star13Anim = useRef(new Animated.Value(0)).current;
         const star14Anim = useRef(new Animated.Value(0)).current;
         const star15Anim = useRef(new Animated.Value(0)).current;
  
  const nebula1Anim = useRef(new Animated.Value(0)).current;
  const nebula2Anim = useRef(new Animated.Value(0)).current;
  const nebula3Anim = useRef(new Animated.Value(0)).current;
  
  const orb1Anim = useRef(new Animated.Value(0)).current;
  const orb2Anim = useRef(new Animated.Value(0)).current;
  const orb3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate stars with different speeds and directions
    const animateStars = () => {
      Animated.parallel([
        Animated.loop(
          Animated.timing(star1Anim, {
            toValue: 1,
            duration: 8000,
            useNativeDriver: true,
          })
        ),
        Animated.loop(
          Animated.timing(star2Anim, {
            toValue: 1,
            duration: 12000,
            useNativeDriver: true,
          })
        ),
        Animated.loop(
          Animated.timing(star3Anim, {
            toValue: 1,
            duration: 10000,
            useNativeDriver: true,
          })
        ),
        Animated.loop(
          Animated.timing(star4Anim, {
            toValue: 1,
            duration: 15000,
            useNativeDriver: true,
          })
        ),
        Animated.loop(
          Animated.timing(star5Anim, {
            toValue: 1,
            duration: 9000,
            useNativeDriver: true,
          })
        ),
        Animated.loop(
          Animated.timing(star6Anim, {
            toValue: 1,
            duration: 11000,
            useNativeDriver: true,
          })
        ),
        Animated.loop(
          Animated.timing(star7Anim, {
            toValue: 1,
            duration: 13000,
            useNativeDriver: true,
          })
        ),
                       Animated.loop(
                 Animated.timing(star8Anim, {
                   toValue: 1,
                   duration: 14000,
                   useNativeDriver: true,
                 })
               ),
               Animated.loop(
                 Animated.timing(star9Anim, {
                   toValue: 1,
                   duration: 9500,
                   useNativeDriver: true,
                 })
               ),
               Animated.loop(
                 Animated.timing(star10Anim, {
                   toValue: 1,
                   duration: 12500,
                   useNativeDriver: true,
                 })
               ),
               Animated.loop(
                 Animated.timing(star11Anim, {
                   toValue: 1,
                   duration: 10500,
                   useNativeDriver: true,
                 })
               ),
               Animated.loop(
                 Animated.timing(star12Anim, {
                   toValue: 1,
                   duration: 13500,
                   useNativeDriver: true,
                 })
               ),
               Animated.loop(
                 Animated.timing(star13Anim, {
                   toValue: 1,
                   duration: 11500,
                   useNativeDriver: true,
                 })
               ),
               Animated.loop(
                 Animated.timing(star14Anim, {
                   toValue: 1,
                   duration: 14500,
                   useNativeDriver: true,
                 })
               ),
               Animated.loop(
                 Animated.timing(star15Anim, {
                   toValue: 1,
                   duration: 10000,
                   useNativeDriver: true,
                 })
               ),
      ]).start();

      // Animate nebula clouds with slow floating motion
      Animated.parallel([
        Animated.loop(
          Animated.timing(nebula1Anim, {
            toValue: 1,
            duration: 20000,
            useNativeDriver: true,
          })
        ),
        Animated.loop(
          Animated.timing(nebula2Anim, {
            toValue: 1,
            duration: 25000,
            useNativeDriver: true,
          })
        ),
        Animated.loop(
          Animated.timing(nebula3Anim, {
            toValue: 1,
            duration: 18000,
            useNativeDriver: true,
          })
        ),
      ]).start();

      // Animate orbs with gentle floating
      Animated.parallel([
        Animated.loop(
          Animated.timing(orb1Anim, {
            toValue: 1,
            duration: 16000,
            useNativeDriver: true,
          })
        ),
        Animated.loop(
          Animated.timing(orb2Anim, {
            toValue: 1,
            duration: 22000,
            useNativeDriver: true,
          })
        ),
        Animated.loop(
          Animated.timing(orb3Anim, {
            toValue: 1,
            duration: 19000,
            useNativeDriver: true,
          })
        ),
      ]).start();
    };

    animateStars();
  }, []);

  return (
    <View style={styles.container}>
      {/* Black Galaxy Background */}
      <LinearGradient 
        colors={['#000000', '#0B0B2A', '#1A0B3B', '#000000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.galaxyBackground}
      />
      
      {/* Subtle Purple Nebula Layer */}
      <LinearGradient 
        colors={['rgba(138, 11, 232, 0.08)', 'rgba(74, 11, 138, 0.05)', 'transparent']}
        start={{ x: 0.3, y: 0.2 }}
        end={{ x: 0.7, y: 0.8 }}
        style={styles.nebulaLayer}
      />

      {/* Animated Cosmic Elements */}
      <View style={styles.cosmicElements}>
        {/* Animated Nebula Clouds */}
        <Animated.View 
          style={[
            styles.nebulaCloud1,
            {
              transform: [
                {
                  translateX: nebula1Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 30],
                  }),
                },
                {
                  translateY: nebula1Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View 
          style={[
            styles.nebulaCloud2,
            {
              transform: [
                {
                  translateX: nebula2Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -25],
                  }),
                },
                {
                  translateY: nebula2Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 15],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View 
          style={[
            styles.nebulaCloud3,
            {
              transform: [
                {
                  translateX: nebula3Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 20],
                  }),
                },
                {
                  translateY: nebula3Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10],
                  }),
                },
              ],
            },
          ]}
        />
        
        {/* Animated Stars */}
        <Animated.View 
          style={[
            styles.star1,
            {
              transform: [
                {
                  translateX: star1Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 40],
                  }),
                },
                {
                  translateY: star1Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -30],
                  }),
                },
              ],
            },
          ]}
        >
          <Star size={3} color="#FFD700" fill="#FFD700" />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.star2,
            {
              transform: [
                {
                  translateX: star2Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -35],
                  }),
                },
                {
                  translateY: star2Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 25],
                  }),
                },
              ],
            },
          ]}
        >
          <Star size={2} color="#FFFFFF" fill="#FFFFFF" />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.star3,
            {
              transform: [
                {
                  translateX: star3Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 30],
                  }),
                },
                {
                  translateY: star3Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }),
                },
              ],
            },
          ]}
        >
          <Star size={4} color="#FFD700" fill="#FFD700" />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.star4,
            {
              transform: [
                {
                  translateX: star4Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -25],
                  }),
                },
                {
                  translateY: star4Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 15],
                  }),
                },
              ],
            },
          ]}
        >
          <Star size={2} color="#FFFFFF" fill="#FFFFFF" />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.star5,
            {
              transform: [
                {
                  translateX: star5Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 35],
                  }),
                },
                {
                  translateY: star5Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -25],
                  }),
                },
              ],
            },
          ]}
        >
          <Star size={3} color="#FFD700" fill="#FFD700" />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.star6,
            {
              transform: [
                {
                  translateX: star6Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -30],
                  }),
                },
                {
                  translateY: star6Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 20],
                  }),
                },
              ],
            },
          ]}
        >
          <Star size={2} color="#FFFFFF" fill="#FFFFFF" />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.star7,
            {
              transform: [
                {
                  translateX: star7Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 25],
                  }),
                },
                {
                  translateY: star7Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -15],
                  }),
                },
              ],
            },
          ]}
        >
          <Star size={3} color="#FFD700" fill="#FFD700" />
        </Animated.View>
        
                       <Animated.View 
                 style={[
                   styles.star8,
                   {
                     transform: [
                       {
                         translateX: star8Anim.interpolate({
                           inputRange: [0, 1],
                           outputRange: [0, -20],
                         }),
                       },
                       {
                         translateY: star8Anim.interpolate({
                           inputRange: [0, 1],
                           outputRange: [0, 30],
                         }),
                       },
                     ],
                   },
                 ]}
               >
                 <Star size={2} color="#FFFFFF" fill="#FFFFFF" />
               </Animated.View>
               
               <Animated.View 
                 style={[
                   styles.star9,
                   {
                     transform: [
                       {
                         translateX: star9Anim.interpolate({
                           inputRange: [0, 1],
                           outputRange: [0, 25],
                         }),
                       },
                       {
                         translateY: star9Anim.interpolate({
                           inputRange: [0, 1],
                           outputRange: [0, -18],
                         }),
                       },
                     ],
                   },
                 ]}
               >
                 <Star size={3} color="#FFD700" fill="#FFD700" />
               </Animated.View>
               
               <Animated.View 
                 style={[
                   styles.star10,
                   {
                     transform: [
                       {
                         translateX: star10Anim.interpolate({
                           inputRange: [0, 1],
                           outputRange: [0, -30],
                         }),
                       },
                       {
                         translateY: star10Anim.interpolate({
                           inputRange: [0, 1],
                           outputRange: [0, 22],
                         }),
                       },
                     ],
                   },
                 ]}
               >
                 <Star size={2} color="#FFFFFF" fill="#FFFFFF" />
               </Animated.View>
               
               <Animated.View 
                 style={[
                   styles.star11,
                   {
                     transform: [
                       {
                         translateX: star11Anim.interpolate({
                           inputRange: [0, 1],
                           outputRange: [0, 28],
                         }),
                       },
                       {
                         translateY: star11Anim.interpolate({
                           inputRange: [0, 1],
                           outputRange: [0, -15],
                         }),
                       },
                     ],
                   },
                 ]}
               >
                 <Star size={4} color="#FFD700" fill="#FFD700" />
               </Animated.View>
               
               <Animated.View 
                 style={[
                   styles.star12,
                   {
                     transform: [
                       {
                         translateX: star12Anim.interpolate({
                           inputRange: [0, 1],
                           outputRange: [0, -22],
                         }),
                       },
                       {
                         translateY: star12Anim.interpolate({
                           inputRange: [0, 1],
                           outputRange: [0, 18],
                         }),
                       },
                     ],
                   },
                 ]}
               >
                 <Star size={2} color="#FFFFFF" fill="#FFFFFF" />
               </Animated.View>
               
               <Animated.View 
                 style={[
                   styles.star13,
                   {
                     transform: [
                       {
                         translateX: star13Anim.interpolate({
                           inputRange: [0, 1],
                           outputRange: [0, 32],
                         }),
                       },
                       {
                         translateY: star13Anim.interpolate({
                           inputRange: [0, 1],
                           outputRange: [0, -20],
                         }),
                       },
                     ],
                   },
                 ]}
               >
                 <Star size={3} color="#FFD700" fill="#FFD700" />
               </Animated.View>
               
               <Animated.View 
                 style={[
                   styles.star14,
                   {
                     transform: [
                       {
                         translateX: star14Anim.interpolate({
                           inputRange: [0, 1],
                           outputRange: [0, -28],
                         }),
                       },
                       {
                         translateY: star14Anim.interpolate({
                           inputRange: [0, 1],
                           outputRange: [0, 25],
                         }),
                       },
                     ],
                   },
                 ]}
               >
                 <Star size={2} color="#FFFFFF" fill="#FFFFFF" />
               </Animated.View>
               
               <Animated.View 
                 style={[
                   styles.star15,
                   {
                     transform: [
                       {
                         translateX: star15Anim.interpolate({
                           inputRange: [0, 1],
                           outputRange: [0, 20],
                         }),
                       },
                       {
                         translateY: star15Anim.interpolate({
                           inputRange: [0, 1],
                           outputRange: [0, -12],
                         }),
                       },
                     ],
                   },
                 ]}
               >
                 <Star size={3} color="#FFD700" fill="#FFD700" />
               </Animated.View>
        
        {/* Animated Floating Orbs */}
        <Animated.View 
          style={[
            styles.orb1,
            {
              transform: [
                {
                  translateX: orb1Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 15],
                  }),
                },
                {
                  translateY: orb1Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View 
          style={[
            styles.orb2,
            {
              transform: [
                {
                  translateX: orb2Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -12],
                  }),
                },
                {
                  translateY: orb2Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 8],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View 
          style={[
            styles.orb3,
            {
              transform: [
                {
                  translateX: orb3Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 10],
                  }),
                },
                {
                  translateY: orb3Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -12],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  galaxyBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  nebulaLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cosmicElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  nebulaCloud1: {
    position: 'absolute',
    top: height * 0.05,
    right: width * 0.1,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(138, 11, 232, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(138, 11, 232, 0.15)',
    shadowColor: '#8A0BE8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
  },
  nebulaCloud2: {
    position: 'absolute',
    top: height * 0.25,
    left: width * 0.05,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(74, 11, 138, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(74, 11, 138, 0.12)',
    shadowColor: '#4A0B8A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
  },
  nebulaCloud3: {
    position: 'absolute',
    bottom: height * 0.15,
    right: width * 0.2,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(160, 32, 240, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(160, 32, 240, 0.1)',
    shadowColor: '#A020F0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 35,
  },
  star1: {
    position: 'absolute',
    top: height * 0.12,
    left: width * 0.15,
  },
  star2: {
    position: 'absolute',
    top: height * 0.18,
    right: width * 0.25,
  },
  star3: {
    position: 'absolute',
    top: height * 0.35,
    left: width * 0.3,
  },
  star4: {
    position: 'absolute',
    top: height * 0.45,
    right: width * 0.1,
  },
  star5: {
    position: 'absolute',
    bottom: height * 0.25,
    left: width * 0.2,
  },
  star6: {
    position: 'absolute',
    bottom: height * 0.35,
    right: width * 0.3,
  },
  star7: {
    position: 'absolute',
    top: height * 0.6,
    left: width * 0.4,
  },
           star8: {
           position: 'absolute',
           bottom: height * 0.1,
           right: width * 0.4,
         },
         star9: {
           position: 'absolute',
           top: height * 0.08,
           left: width * 0.25,
         },
         star10: {
           position: 'absolute',
           top: height * 0.22,
           right: width * 0.35,
         },
         star11: {
           position: 'absolute',
           top: height * 0.42,
           left: width * 0.15,
         },
         star12: {
           position: 'absolute',
           bottom: height * 0.28,
           right: width * 0.25,
         },
         star13: {
           position: 'absolute',
           top: height * 0.55,
           left: width * 0.45,
         },
         star14: {
           position: 'absolute',
           bottom: height * 0.18,
           left: width * 0.35,
         },
         star15: {
           position: 'absolute',
           top: height * 0.68,
           right: width * 0.15,
         },
  orb1: {
    position: 'absolute',
    top: height * 0.4,
    right: width * 0.05,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 105, 180, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.2)',
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  orb2: {
    position: 'absolute',
    bottom: height * 0.3,
    left: width * 0.1,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(138, 11, 232, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(138, 11, 232, 0.25)',
    shadowColor: '#8A0BE8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  orb3: {
    position: 'absolute',
    top: height * 0.6,
    right: width * 0.35,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 20, 147, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 20, 147, 0.15)',
    shadowColor: '#FF1493',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
}); 