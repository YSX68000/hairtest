const uploadForm = document.getElementById('uploadForm');
const imageInput = document.getElementById('imageInput');
const hairstyleSelect = document.getElementById('hairstyleSelect');
const fetchResultButton = document.getElementById('fetchResult');
const resultImage = document.getElementById('resultImage');

// 最初の画像アップロード処理
uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const file = imageInput.files[0];
  if (!file) {
    alert('Please select an image.');
    return;
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('editing_type', 'both');  // ヘアスタイルとカラー両方を編集
  formData.append('color_description', 'blond');  // ヘアカラー（必要に応じて変更）
  formData.append('hairstyle_description', hairstyleSelect.value);  // ヘアスタイルの選択内容

  try {
    // APIに画像とヘアスタイルのリクエストを送信
    const response = await fetch('https://api.magicapi.dev/api/v1/magicapi/hair/hair', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'x-magicapi-key': 'cm60r5hlt0001jo03gnjm1t7g',
      },
      body: formData,
    });
    const data = await response.json();

    if (data.error_code) {
      alert('Error: ' + data.error_msg);
      return;
    }

    const requestId = data.request_id;
    console.log('Request ID:', requestId);

    // request_idを保存
    localStorage.setItem('request_id', requestId);

    // 画像処理結果を取得するボタンを表示
    fetchResultButton.style.display = 'block';
  } catch (error) {
    console.error('Error uploading image:', error);
    alert('There was an error processing the image.');
  }
});

// 処理結果の画像を取得
fetchResultButton.addEventListener('click', async () => {
  const requestId = localStorage.getItem('request_id');
  if (!requestId) {
    alert('No request_id found.');
    return;
  }

  try {
    // request_idを使って結果を取得
    const response = await fetch(`https://api.magicapi.dev/api/v1/magicapi/hair/hair/${requestId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'x-magicapi-key': 'cm60r5hlt0001jo03gnjm1t7g',
      },
    });
    const data = await response.json();

    if (data.error_code) {
      alert('Error: ' + data.error_msg);
      return;
    }

    const imageUrl = data.result_image_url;
    resultImage.src = imageUrl;
    resultImage.style.display = 'block';  // 画像を表示
  } catch (error) {
    console.error('Error fetching the image:', error);
    alert('There was an error fetching the result.');
  }
});
