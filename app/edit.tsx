import React, { useState } from 'react';
import { View, TextInput, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import { updatePost } from '../store/postsSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  EditPost: { id: number; text: string; image: string | null };
};

type EditPostScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditPost'>;
type EditPostScreenRouteProp = RouteProp<RootStackParamList, 'EditPost'>;

export default function EditPostScreen() {
  const route = useRoute<EditPostScreenRouteProp>();
  const navigation = useNavigation<EditPostScreenNavigationProp>();

  const { id, text: initialText, image: initialImage } = route.params;

  const [text, setText] = useState<string>(initialText || '');
  const [image, setImage] = useState<string | null>(initialImage || null);

  const dispatch = useDispatch();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    dispatch(updatePost({ id, text, image }));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeButton}>X</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSave}
          style={[
            styles.saveButtonContainer,
            { backgroundColor: text.trim() ? '#007BFF' : '#CCCCCC' },
          ]}
          disabled={!text.trim()}
        >
          <Text style={styles.saveButton}>Sauvegarder</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Modifier votre post..."
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
  saveButton: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  saveButtonContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  input: {
    borderWidth: 0,
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
