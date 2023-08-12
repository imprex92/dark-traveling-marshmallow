import { useState, useEffect } from 'react';
import { projectStorage } from '../../firebase/config';
import {useAuth} from '../../contexts/AuthContext'

//! Saving user defined files to upload to storage

const useStorage = (file, initiator) => {
  const {currentUser} = useAuth();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    // references
    
    const refToPostBucket = projectStorage.app.storage('gs://dark-traveling-marshmallow.appspot.com').ref(`userData/${currentUser.uid}/${file.name}`) ?? ''
    const refToRecipeBucket = projectStorage.app.storage('gs://dark-traveling-marshmallow-recipes').ref(`userData/${currentUser.uid}/${file.name}`) ?? ''

    const storageRef = initiator === 'POST_UPLOAD' ? refToPostBucket 
    : initiator === 'RECIPE_UPLOAD' ? refToRecipeBucket : '';
    
    storageRef.put(file).on('state_changed', (snap) => {
      let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
      setProgress(percentage);
    }, (err) => {
      setError(err);
    }, async () => {
      const url = await storageRef.getDownloadURL();
      setUrl(url);
    });
  }, [file]);

  return { progress, url, error };
}

export default useStorage;