// ui.js

export function toggleMaterialInput() {
  const useFolder = document.getElementById('useFolder').checked;
  document.getElementById('materialInput').style.display = useFolder ? 'none' : '';
  document.getElementById('materialFolderInput').style.display = useFolder ? '' : 'none';
}

export function showFileName(inputId, labelId) {
  const input = document.getElementById(inputId);
  const label = document.getElementById(labelId);
  if (input.files.length === 0) {
    label.textContent = '';
  } else if (input.files.length === 1) {
    label.textContent = `選択ファイル: ${input.files[0].name}`;
  } else {
    label.textContent = `選択ファイル数: ${input.files.length}`;
    let names = '';
    for (let i = 0; i < input.files.length; i++) {
      names += input.files[i].name + ', ';
    }
    label.textContent += ' (' + names.slice(0,-2) + ')';
  }
}

export function showInformation() {
  alert(
    `本アプリは
選択した元画像の色を解析し素材画像を変更して並べることでピクセルアートを作成するものです
・元画像は最大500×500、素材画像は最大50×50ピクセルまでです
・素材画像サイズは正方形推奨です
・複数素材画像を使う場合は、フォルダ選択を利用してください
生成後、「画像をダウンロード」リンクから保存できます。
生成画像は下部にプレビュー表示されます（大きい画像は縮小表示されます）。`
  );
}

export function showTerms() {
  alert(
    `利用規約です
　　これらが守られていない場合製作者による利用停止措置を行いますのでご注意下さい
（
・コードの解析やアプリを使った有料コンテンツの作成は禁止です
・本アプリを使用して生成した画像の著作権は使用した画像の製作者に依存します
・生成された画像の販売は禁止です
・生成された画像はSNSでの公開、アイコンでの使用のみ許可します　
　※画像公開の際は本アプリのURLを乗せてください
・生成された画像に関してのトラブルには一切かかわりませんのでご注意ください
）`
  );
}
