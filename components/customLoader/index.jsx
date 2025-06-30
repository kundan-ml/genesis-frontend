export const customLoader = ({ src, width }) => {
    const imageUrl = `${process.env.BACKEND_URL}/${src}`;
    const quality = width > 750 ? 75 : 50; // Adjust quality based on width
    return `${imageUrl}?w=${width}&q=${quality}&fit=cover`;
  };
  