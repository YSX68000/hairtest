const apiKey = 'cm60r5hlt0001jo03gnjm1t7g'; // Magic APIキー
const apiUrl = 'https://api.magicapi.dev/api/v1/magicapi/hair/hair';

document.getElementById('uploadForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const imageInput = document.getElementById('imageInput');
  const file = imageInput.files[0];
  if (!file) {
    alert('Please select an image!');
    return;
  }

  // 画像をGoogle Cloud Storageにアップロード (例: プレースホルダー)
  const imageUrl = await uploadImageToCloudStorage(file);

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'x-magicapi-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: imageUrl,
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
    window.location.href = 'page2.html'; // 次のページへジャンプ
  } else {
    alert('Failed to get Request ID.');
  }
});

// Google Cloud Storageに画像をアップロードする例（仮）
async function uploadImageToCloudStorage(file) {
  const storageUrl = 'https://storage.googleapis.com/hairtest68/';
  const fileName = file.name;
  const fullUrl = `${storageUrl}${fileName}`;

  // 実際のアップロード処理をここに実装
  return fullUrl; // アップロードされた画像のURLを返す
}
