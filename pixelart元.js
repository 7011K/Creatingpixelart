// pixelart.js

async function fetchBanList() {
  try {
    const res = await fetch('https://7011k.github.io/creatingpixelart/BANList.text');
    if (!res.ok) return [];
    const text = await res.text();
    return text.split('\n').map(x => x.trim().toLowerCase()).filter(x => x);
  } catch (e) {
    return [];
  }
}

export function blendColors(base, material, blendRatio, mixBackground) {
  if (!mixBackground && material[3] === 0) return material;
  return [
    Math.round(base[0] * blendRatio + material[0] * (1 - blendRatio)),
    Math.round(base[1] * blendRatio + material[1] * (1 - blendRatio)),
    Math.round(base[2] * blendRatio + material[2] * (1 - blendRatio)),
    Math.round(base[3] * blendRatio + material[3] * (1 - blendRatio))
  ];
}

export function getImageDataFromImg(img, w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h);
}

export async function generatePixelArt(
  baseImg, materialImgs, blendRatio, mixBackground, callbackProgress, userEmail
) {
  // メールアドレス未取得時はエラー
  if (!userEmail || userEmail.trim() === '') {
    throw new Error('Googleログインしてメールアドレスを取得してください');
  }

  // BANチェック
  const banList = await fetchBanList();
  if (banList.includes(userEmail.toLowerCase())) {
    throw new Error('このメールアドレスは利用できません（BANリスト一致）');
  }

  let baseW = Math.min(baseImg.width, 500);
  let baseH = Math.min(baseImg.height, 500);

  const baseCanvas = document.createElement('canvas');
  baseCanvas.width = baseW;
  baseCanvas.height = baseH;
  const baseCtx = baseCanvas.getContext('2d');
  baseCtx.drawImage(baseImg, 0, 0, baseW, baseH);
  const baseData = baseCtx.getImageData(0, 0, baseW, baseH).data;

  let materialW = Math.min(materialImgs[0].width, 50);
  let materialH = Math.min(materialImgs[0].height, 50);
  const materialImageDataArray = [];
  for (let i = 0; i < materialImgs.length; i++) {
    materialImageDataArray.push(getImageDataFromImg(materialImgs[i], materialW, materialH));
  }

  const outputW = baseW * materialW;
  const outputH = baseH * materialH;
  if (outputW > 25000 || outputH > 25000) {
    throw new Error('出力画像サイズが大きすぎます');
  }

  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = outputW;
  outputCanvas.height = outputH;
  const outputCtx = outputCanvas.getContext('2d');
  let outputImageData = outputCtx.createImageData(outputW, outputH);

  let materialIndex = 0;
  let processedPixels = 0;

  function processChunk(startY, chunkSize, resolve) {
    for (let y = startY; y < Math.min(baseH, startY + chunkSize); y++) {
      for (let x = 0; x < baseW; x++) {
        const idx = (y * baseW + x) * 4;
        const baseRGBA = [
          baseData[idx], baseData[idx+1], baseData[idx+2], baseData[idx+3]
        ];
        if (baseRGBA[3] === 0) continue;

        const matImageData = materialImageDataArray[materialIndex];
        const matData = matImageData.data;
        for (let j = 0; j < materialH; j++) {
          for (let i = 0; i < materialW; i++) {
            const matIdx = (j * materialW + i) * 4;
            const matRGBA = [
              matData[matIdx],
              matData[matIdx+1],
              matData[matIdx+2],
              matData[matIdx+3]
            ];
            if (!mixBackground && matRGBA[3] === 0) continue;

            const blended = blendColors(baseRGBA, matRGBA, blendRatio, mixBackground);
            const targetX = x * materialW + i;
            const targetY = y * materialH + j;
            const outIdx = (targetY * outputW + targetX) * 4;
            outputImageData.data[outIdx] = blended[0];
            outputImageData.data[outIdx+1] = blended[1];
            outputImageData.data[outIdx+2] = blended[2];
            outputImageData.data[outIdx+3] = blended[3];
          }
        }
        materialIndex = (materialIndex + 1) % materialImageDataArray.length;
      }
      processedPixels++;
      if (typeof callbackProgress === 'function' && y % 10 === 0) {
        callbackProgress(Math.round((processedPixels/baseH)*100));
      }
    }
    if (startY + chunkSize < baseH) {
      setTimeout(() => processChunk(startY + chunkSize, chunkSize, resolve), 0);
    } else {
      outputCtx.putImageData(outputImageData, 0, 0);
      resolve(outputCanvas);
    }
  }

  return new Promise((resolve, reject) => {
    try {
      processChunk(0, 10, resolve);
    } catch (e) {
      reject(e);
    }
  });
}

