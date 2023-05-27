import {PermissionsAndroid, Platform} from 'react-native';

import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

// 안드로이드에서만 CAMERA, WRITE_EXTERNAL_STORAGE 권한 체크
const checkCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true;
  }

  const grantedCamera = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA,
  );
  const grantedStorage = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  );

  return [grantedCamera, grantedStorage].every(
    granted => granted === PermissionsAndroid.RESULTS.GRANTED,
  );
};

export const openCamera = async (): Promise<Asset | undefined> => {
  const isCameraPermissionGiven = await checkCameraPermission();
  if (!isCameraPermissionGiven) {
    return;
  }

  const result = await launchCamera({
    mediaType: 'photo',
    cameraType: 'back',
  });

  if (result.didCancel || !result.assets) {
    return;
  }

  return result.assets[0];
};

const IMAGE_SELECTION_LIMIT = 10;

export const openGallery = async (): Promise<Asset | Asset[] | undefined> => {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    selectionLimit: IMAGE_SELECTION_LIMIT,
  });

  if (result.didCancel || !result.assets) {
    return;
  }

  if (result.assets.length === 1) {
    return result.assets[0];
  }

  return result.assets;
};

export const parseFormData = (assets: Asset | Asset[]): FormData => {
  const data = new FormData();

  (Array.isArray(assets) ? assets : [assets]).forEach(asset => {
    data.append(
      'file',
      JSON.stringify({
        type: asset.type,
        name: asset.fileName,
        size: asset.fileSize,
        data: `data:${asset.type};base64,${asset.uri}`,
      }),
    );
  });

  return data;
};
