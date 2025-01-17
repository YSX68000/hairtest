document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    event.preventDefault();
  
    const imageInput = document.getElementById('imageInput');
    const hairstyleSelect = document.getElementById('hairstyleSelect');
    const file = imageInput.files[0];
    const hairstyle = hairstyleSelect.value;
  
    if (!file) {
      alert('Please upload an image!');
      return;
    }
  
    // 画像をFormDataで送信する準備
    const formData = new FormData();
    formData.append('image', file);
    formData.append('editing_type', 'both');
    formData.append('color_description', 'blond'); // ヘアカラーの変更があればここを変更
    formData.append('hairstyle_description', hairstyle);
  
    try {
      // 画像の処理をリクエスト
      const response = await fetch('https://api.magicapi.dev/api/v1/magicapi/hair/hair', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'x-magicapi-key': 'cm60r5hlt0001jo03gnjm1t7g',  // ここに実際のAPIキーを入力
        },
        body: formData, // 画像を含むFormDataを送信
      });
  
      const result = await response.json();
  
      if (result.error_code) {
        console.error('Error:', result.error_msg);
        alert(result.error_msg);
        return;
      }
  
      // ここで request_id を受け取ります
      const requestId = result.request_id; // request_idを取得
  
      // request_idを使って画像処理結果を取得
      const resultResponse = await fetch(`https://api.magicapi.dev/api/v1/magicapi/hair/hair/${requestId}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'x-magicapi-key': 'cm60r5hlt0001jo03gnjm1t7g',  // ここにもAPIキーが必要
        },
      });
  
      const resultData = await resultResponse.json();
  
      if (resultData.error_code) {
        console.error('Error:', resultData.error_msg);
        alert(resultData.error_msg);
        return;
      }
  
      // 結果の画像を表示
      const resultImage = document.getElementById('resultImage');
      resultImage.src = resultData.image_url;  // 処理された画像のURLを表示
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }
  });
  