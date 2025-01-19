import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBFSiyBdYVduIfCLknn4ppQFl1uSPF38iM",
  authDomain: "hairtest-18780.firebaseapp.com",
  projectId: "hairtest-18780",
  storageBucket: "hairtest-18780.firebasestorage.app",
  messagingSenderId: "721724464874",
  appId: "1:721724464874:web:d6451fc814377c2e2b0193"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const apiKey = 'cm60r5hlt0001jo03gnjm1t7g';
const apiUrl = 'https://api.magicapi.dev/api/v1/magicapi/hair/hair';

document.getElementById('uploadForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const imageInput = document.getElementById('imageInput');
  const file = imageInput.files[0];
  if (!file) {
    alert('Please select an image!');
    return;
  }

  try {
    const gcsImageUrl = await uploadImageToFirebase(file);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'x-magicapi-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: gcsImageUrl,
        editing_type: 'both',
        color_description: 'blonde',
        hairstyle_description: 'BuzzCut',
      }),
    });

    const data = await response.json();
    const requestId = data.request_id;

    if (requestId) {
      localStorage.setItem('request_id', requestId);
      alert(`Request ID saved: ${requestId}`);
      window.location.href = 'page2.html'; 
    } else {
      alert('Failed to get Request ID from API.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
});

async function uploadImageToFirebase(file) {
  const storageRef = ref(storage, `images/${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}
