import React from 'react';
import { Text, View, StyleSheet, StatusBar } from 'react-native';
import Button from '@components/Button';
import { StackProps } from '@navigator/stack';
import { colors } from '@theme';
import Svg, { Path, G } from 'react-native-svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGrayPurple,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  buttonTitle: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: colors.lightPurple,
    height: 44,
    width: '50%',
  },
});

export default function Home({ navigation }: StackProps) {
  const source = { uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf', cache: true };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>PDF Upload</Text>
      <TouchableOpacity onPress={() => navigation.navigate('DetailsStack', { from: 'Home' })}>
        
        <Svg
          width={80}
          height={80}
          viewBox="0 0 374.116 374.116"
          fill="#000000"
        >
          <G>
            <Path d="M344.058,207.506c-16.568,0-30,13.432-30,30v76.609h-254v-76.609c0-16.568-13.432-30-30-30c-16.568,0-30,13.432-30,30
              v106.609c0,16.568,13.432,30,30,30h314c16.568,0,30-13.432,30-30V237.506C374.058,220.938,360.626,207.506,344.058,207.506z"/>
            <Path d="M123.57,135.915l33.488-33.488v111.775c0,16.568,13.432,30,30,30c16.568,0,30-13.432,30-30V102.426l33.488,33.488
              c5.857,5.858,13.535,8.787,21.213,8.787c7.678,0,15.355-2.929,21.213-8.787c11.716-11.716,11.716-30.71,0-42.426L208.271,8.788
              c-11.715-11.717-30.711-11.717-42.426,0L81.144,93.489c-11.716,11.716-11.716,30.71,0,42.426
              C92.859,147.631,111.855,147.631,123.57,135.915z"/>
          </G>
        </Svg>
      </TouchableOpacity>
    </View>
  );
}
