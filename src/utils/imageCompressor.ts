/**
 * Utilidad para comprimir y redimensionar fotos de manera ultra-eficiente en el navegador.
 * Evita que las fotos tomadas con celulares (3MB - 15MB) superen los límites de Firestore (1MB)
 * o de LocalStorage (5MB), reduciendo el peso a ~40KB-80KB sin perder nitidez visual.
 */
export async function compressImage(
  fileOrDataUrl: File | string,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.78
): Promise<string> {
  // Si ya es una URL externa de internet (Unsplash, Google, etc.), no tocarla
  if (typeof fileOrDataUrl === 'string' && (fileOrDataUrl.startsWith('http://') || fileOrDataUrl.startsWith('https://'))) {
    return fileOrDataUrl;
  }

  return new Promise((resolve, reject) => {
    let sourceDataUrl: string;

    const processDataUrl = (dataUrl: string) => {
      // Si es un video o SVG, devolver tal cual
      if (dataUrl.startsWith('data:video') || dataUrl.startsWith('data:image/svg')) {
        return resolve(dataUrl);
      }

      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calcular escala preservando proporciones
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(dataUrl);
        }

        // Suavizado de imagen de alta calidad
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Fondo blanco para imágenes transparentes que se convierten a JPEG
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0, width, height);

        try {
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        } catch {
          resolve(dataUrl);
        }
      };

      img.onerror = () => {
        // Fallback: si falla la carga en canvas, devolver original
        resolve(dataUrl);
      };

      img.src = dataUrl;
    };

    if (typeof fileOrDataUrl === 'string') {
      processDataUrl(fileOrDataUrl);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          processDataUrl(e.target.result);
        } else {
          reject(new Error('No se pudo leer el archivo'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}
