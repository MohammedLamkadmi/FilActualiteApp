import React, { useState } from 'react';
import { View, TextInput, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useDispatch } from 'react-redux';
import { addPost } from '../store/postsSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  index: undefined;
};

type AddPostScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'index'>;

export default function AddPostScreen() {
  const [text, setText] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigation = useNavigation<AddPostScreenNavigationProp>();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const fileName = result.assets[0].uri.split('/').pop();
      const newPath = `${FileSystem.documentDirectory}${fileName}`;
      try {
        await FileSystem.copyAsync({
          from: result.assets[0].uri,
          to: newPath,
        });
        setImage(newPath);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'image :', error);
      }
    }
  };

  const handleAddPost = () => {
    dispatch(addPost({ text, image }));
    navigation.navigate('index');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('index')}>
          <Text style={styles.closeButton}>X</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleAddPost}
          style={[
            styles.postButtonContainer,
            { backgroundColor: text.trim() ? '#007BFF' : '#CCCCCC' },
          ]}
          disabled={!text.trim()}
        >
          <Text style={styles.postButton}>Poster</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Écrivez votre post..."
        value={text}
        onChangeText={setText}
        multiline
      />
      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.postImage} resizeMode="cover" />
          <TouchableOpacity style={styles.deleteImageIcon} onPress={() => setImage(null)}>
            <Image
              source={require('../assets/images/delete-icon.png')}
              style={styles.iconImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      )}
      {!image && (
        <View style={styles.addImageContainer}>
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={{ uri: "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png" }}
              style={styles.addImageIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  postButton: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  postButtonContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  input: {
    fontSize: 16,
    marginBottom: 20,
    paddingHorizontal: 5,
    height: 300,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  deleteImageIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  iconImage: {
    width: 30,
    height: 30,
  },
  addImageIcon: {
    width: 30,
    height: 30,
  },
  addImageContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
  },
});
