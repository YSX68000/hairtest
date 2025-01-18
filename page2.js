const statusUrl = 'https://api.magicapi.dev/api/v1/magicapi/hair/predictions/';
const storageBucketUrl = 'https://storage.googleapis.com/hairtest68/';

document.getElementById('getResultButton').addEventListener('click', async () => {
  const requestId = localStorage.getItem('request_id');
  if (!requestId) {
    alert('No request ID found!');
    return;
  }

  let status = 'processing';
  let imageUrl = '';

  while (status === 'processing') {
    const response = await fetch(`${statusUrl}${requestId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'x-magicapi-key': 'cm60r5hlt0001jo03gnjm1t7g',
      },
    });

    const data = await response.json();
    status = data.status;

    if (status === 'succeeded') {
      imageUrl = data.result;
      break;
    } else if (status === 'failed') {
      alert('Processing failed!');
      return;
    } else {
      console.log('Processing... retrying in 5 seconds');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  if (imageUrl) {
    const downloadedImageUrl = await downloadImageToCloudStorage(imageUrl);
    const resultImage = document.getElementById('resultImage');
    resultImage.src = downloadedImageUrl;
  }
});

// Google Cloud Storageに画像をダウンロード (仮実装)
async function downloadImageToCloudStorage(imageUrl) {
  const fileName = imageUrl.split('/').pop(); // ファイル名を抽出
  const fullUrl = `${storageBucketUrl}${fileName}`;

  // 実際のダウンロード処理をここに実装
  return fullUrl; // ダウンロードされた画像のURLを返す
}
