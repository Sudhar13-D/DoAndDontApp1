import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Animated, 
  TouchableWithoutFeedback 
} from 'react-native';

const categories = ['Health', 'Career', 'Learning', 'Custom'];

const Goal = () => {
  // State to track if the menu is open
  const [isOpen, setIsOpen] = useState(false);
  
  // Animation value for the menu state
  const animation = useRef(new Animated.Value(0)).current;
  
  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    
    Animated.spring(animation, {
      toValue,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
    
    setIsOpen(!isOpen);
  };
  
  const handleCategoryPress = (category: string) => {
    console.log('Selected Category:', category);
    toggleMenu(); // Close the menu after selection
  };
  
  // Rotation animation for the plus icon
  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });
  
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Choose Your Goal Category</Text>
      
      {/* Background overlay for when the menu is open */}
      {isOpen && (
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}
      
      {/* FAB menu */}
      <View style={styles.fabContainer}>
        {/* Category buttons */}
        {categories.map((category, index) => {
          // Calculate angle for arc layout
          const angle = Math.PI / 2 + (Math.PI / (categories.length + 1)) * (index + 1);
          const radius = 120;
          
          // Position calculations
          const translateX = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, radius * Math.cos(angle)],
          });
          
          const translateY = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, radius * Math.sin(angle)],
          });
          
          // Scale and opacity animations
          const scale = animation.interpolate({
            inputRange: [0, 0.7, 1],
            outputRange: [0, 1.2, 1],
          });
          
          const opacity = animation.interpolate({
            inputRange: [0, 0.7, 1],
            outputRange: [0, 0.7, 1],
          });
          
          return (
            <Animated.View
              key={category}
              style={[
                styles.categoryButtonContainer,
                {
                  transform: [
                    { translateX },
                    { translateY },
                    { scale }
                  ],
                  opacity,
                }
              ]}
            >
              <TouchableOpacity
                style={styles.categoryButton}
                onPress={() => handleCategoryPress(category)}
              >
                <Text style={styles.categoryButtonText}>{category}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
        
        {/* Main FAB with plus icon */}
        <TouchableOpacity
          style={styles.fab}
          onPress={toggleMenu}
          activeOpacity={0.8}
        >
          <Animated.Text
            style={[
              styles.fabIcon,
              {
                transform: [{ rotate: rotation }]
              }
            ]}
          >+</Animated.Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Goal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 10,
  },
  fabIcon: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold',
    lineHeight: 60,
    textAlign: 'center',
  },

  categoryButtonContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  categoryButtonText: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
    paddingHorizontal: 3,
  },
});
