// Videos de casos de éxito. Hoy se reproducen embebidos directo desde Google Drive
// (con el formato https://drive.google.com/file/d/FILE_ID/preview), tal como los subiste.
//
// Si en algún momento notás que cargan lento, se pueden migrar a YouTube "no listado"
// (recomendado para mejor rendimiento) usando el formato https://www.youtube.com/embed/VIDEO_ID —
// avisame y lo cambio.
//
// El campo "thumbnail" es una foto real tomada del propio video (miniatura autogenerada
// por Google Drive), para que se vea de qué trata antes de hacer click.

export type VideoCaso = {
  titulo: string;
  descripcion?: string;
  embedUrl: string;
  thumbnail?: string;
};

export const videos: VideoCaso[] = [
  {
    titulo: "Caso de éxito: tendón de Aquiles",
    embedUrl: "https://drive.google.com/file/d/1owEMzKSylY0UtbxSdf8fEQtA3qQKfy2O/preview",
    thumbnail: "/images/video-aquiles.jpg",
  },
  {
    titulo: "Caso de éxito: tendinopatía rotuliana",
    embedUrl: "https://drive.google.com/file/d/1a0I5hqNndCecI2VaUVvT0RPTVODTFwUM/preview",
    thumbnail: "/images/video-tendinopatia.jpg",
  },
  {
    titulo: "Lesión de rodilla compleja: ruptura de ligamento, menisco y hueso",
    embedUrl: "https://drive.google.com/file/d/1UJ3tDLrbKNeqFYfzg9RAvy62H1MV4gJd/preview",
    thumbnail: "/images/video-rodilla.jpg",
  },
  {
    titulo: "Dolor de rodilla hace años sin solución médica",
    embedUrl: "https://drive.google.com/file/d/1c5shB3Fk2BEo2TV-eY9BmPy4QoJUYNlp/preview",
    thumbnail: "/images/video-rodilla-cronica.jpg",
  },
  {
    titulo: "Desgarro/ardor en la pierna, sin respuesta",
    embedUrl: "https://drive.google.com/file/d/1UwHN9AgBqyO86KUGif0BkDHF9LqFpzY6/preview",
    thumbnail: "https://drive.google.com/thumbnail?id=1UwHN9AgBqyO86KUGif0BkDHF9LqFpzY6&sz=w320",
  },
  {
    titulo: "Penso que la solucion era el reposo y esperar/dolor de rodilla",
    embedUrl: "https://drive.google.com/file/d/1Dxp1Su8eEzEYZRZn845W05iRwlK4NF9J/preview",
    thumbnail: "https://drive.google.com/thumbnail?id=1Dxp1Su8eEzEYZRZn845W05iRwlK4NF9J&sz=w320",
  },
  {
    titulo: "Dolor de rodilla en artes marciales",
    embedUrl: "https://drive.google.com/file/d/1gIqCQ7C3GNw3nox1ve2LBbAp3eji26Fe/preview",
    thumbnail: "https://drive.google.com/thumbnail?id=1gIqCQ7C3GNw3nox1ve2LBbAp3eji26Fe&sz=w320",
  },
];
