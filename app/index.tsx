import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { deletePost } from '../store/postsSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  add: undefined;
  edit: { id: number; text: string; image: string | null };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'add'>;

export default function HomeScreen() {
  const posts = useSelector((state: RootState) => state.posts.posts);
  const dispatch = useDispatch();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleDeletePost = (id: number) => {
    dispatch(deletePost(id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileCircle}>
          <Image
            source={require('../assets/images/image-profil.jpg')}
            style={styles.profileImage}
            resizeMode="cover"
          />
        </View>
        <TouchableOpacity
          style={styles.addPostButtonContainer}
          onPress={() => navigation.navigate('add')}
        >
          <Text style={styles.addPostButtonText}>Ajouter un Post</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <View style={styles.iconsRow}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('edit', {
                    id: item.id,
                    text: item.text,
                    image: item.image,
                  })
                }
              >
                <Image
                  source={require('../assets/images/edit-icon.png')}
                  style={styles.iconImage}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDeletePost(item.id)}>
                <Image
                  source={require('../assets/images/delete-icon.png')}
                  style={styles.iconImage}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.postText}>{item.text}</Text>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.postImage} resizeMode="cover" />
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#ddd',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  addPostButtonContainer: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addPostButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  post: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginBottom: 10,
    borderBottomWidth: 3,
    borderBottomColor: '#E5E5E5',
  },
  iconsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  postText: {
    fontSize: 16,
    marginBottom: 10,
  },
  iconImage: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
  postImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
});
