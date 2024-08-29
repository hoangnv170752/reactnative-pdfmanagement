import { Text, View, StyleSheet, StatusBar, Dimensions, ActivityIndicator, Button } from 'react-native';
import GradientButton from '@components/GradientButton';
import { StackProps } from '@navigator/stack';
import { colors } from '@theme';
import React, {useState} from 'react';
import Pdf from 'react-native-pdf';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';

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
    height: 44,
    width: '50%',
  },
  pdf: {
    flex:1,
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
  },
  permissionText: {
    marginTop: 20,
    color: 'red',
  },
});

export default function Details({ navigation, route }: StackProps) {
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  const checkPermissions = async (): Promise<boolean> => {
    try {
      const result = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      if (result === RESULTS.GRANTED) {
        return true;
      } else if (result === RESULTS.DENIED) {
        const requestResult = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        return requestResult === RESULTS.GRANTED;
      } else {
        console.log('Storage permission is not available');
        return false;
      }
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  };

  const pickDocument = async (): Promise<void> => {
    if (permissionGranted === null) {
      const hasPermission = await checkPermissions();
      setPermissionGranted(hasPermission);
      if (!hasPermission) return;
    }

    try {
      setLoading(true);
      const results: DocumentPickerResponse[] = await DocumentPicker.pick({
        type: ['application/pdf'],
      });

      if (results.length > 0) {
        const result = results[0];
        setPdfUri(result.uri);
      }

      setLoading(false);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled the picker');
      } else {
        console.error('DocumentPicker Error:', error);
      }
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <Button title="Pick PDF" onPress={pickDocument} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {pdfUri && (
        <Pdf
          source={{ uri: pdfUri, cache: true }}
          onLoadComplete={(numberOfPages: number, filePath: string) => {
            console.log(`number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page: number, numberOfPages: number) => {
            console.log(`current page: ${page}`);
          }}
          onError={(error: any) => {
            console.log(error);
          }}
          onPressLink={(uri: string) => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdf}
        />
      )}
      {permissionGranted === false && (
        <Text style={styles.permissionText}>Storage permission is required to pick a file.</Text>
      )}
    </View>
  );
}
