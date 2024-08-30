import { Text, View, StyleSheet, StatusBar, Dimensions, ActivityIndicator, Button } from 'react-native';
import GradientButton from '@components/GradientButton';
import { StackProps } from '@navigator/stack';
import { colors } from '@theme';
import React, {useState} from 'react';
import Pdf from 'react-native-pdf';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import PdfRendererView from 'react-native-pdf-renderer';
import * as FileSystem from 'expo-file-system';

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
  const [toggle, setToggle] = useState(true);
  const [source, setSource] = useState<string>();
  const [downloading, setDownloading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [singlePage, setSinglePage] = useState(false);

  const PDF_URL =
  'https://www.nasa.gov/wp-content/uploads/static/history/alsj/a11/a11final-fltpln.pdf'; // 618 pages
// const PDF_URL = 'https://www.africau.edu/images/default/sample.pdf'; // 2 pages

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
  const downloadWithExpoFileSystem = React.useCallback(async () => {
    try {
      setDownloading(true);
      const response = await FileSystem.downloadAsync(
        PDF_URL,
        FileSystem.documentDirectory + 'file.pdf',
      );
      setSource(response.uri);
    } catch (err) {
      console.warn(err);
    } finally {
      setDownloading(false);
    }
  }, []);

  // const downloadWithBlobUtil = useCallback(async () => {
  //   try {
  //     setDownloading(true);
  //     /**
  //      * Download the PDF file with any other library, like  "expo-file-system", "rn-fetch-blob" or "react-native-blob-util"
  //      */
  //     const dirs = ReactNativeBlobUtil.fs.dirs;
  //     const response = await ReactNativeBlobUtil.config({
  //       path: dirs.DocumentDir + '/file.pdf',
  //     }).fetch('GET', PDF_URL);
  //     /*
  //      * Then, set the local file URI to state and pass to the PdfRendererView source prop.
  //      */
  //     setSource(response.path());
  //   } catch (err) {
  //     console.warn(err);
  //   } finally {
  //     setDownloading(false);
  //   }
  // }, []);

  React.useEffect(() => {
    downloadWithExpoFileSystem();
    // downloadWithBlobUtil();
  }, [downloadWithExpoFileSystem]);

  const renderPdfView = () => {
    if (downloading) {
      return <Text>Downloading...</Text>;
    }

    if (!toggle) {
      return <Text>Unmounted</Text>;
    }

    return (
      <>
        <Button
          title="Single Page"
          onPress={() => setSinglePage(prev => !prev)}
        />
        <PdfRendererView
          style={{backgroundColor: 'white'}}
          source={source}
          distanceBetweenPages={16}
          maxZoom={5}
          singlePage={singlePage}
          onPageChange={(current, total) => {
            console.log('onPageChange', {current, total});
            setCurrentPage(current);
            setTotalPages(total);
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 16,
            left: 0,
            right: 0,
            alignItems: 'center',
          }}>
          <Text
            style={{
              backgroundColor: 'rgba(255,255,255,0.5)',
              color: 'black',
              padding: 4,
              borderRadius: 4,
            }}>
            {currentPage + 1}/{totalPages}
          </Text>
        </View>
      </>
    );
  };

  return (
    <View style={styles.root}>
      {/* <Button title="Pick PDF" onPress={pickDocument} /> */}
      <Button title="Mount/Unmount" onPress={() => setToggle(prev => !prev)} />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {renderPdfView()}

      {permissionGranted === false && (
        <Text style={styles.permissionText}>Storage permission is required to pick a file.</Text>
      )}
    </View>
  );
}
