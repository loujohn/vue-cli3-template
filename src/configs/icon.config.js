import iconLocationRed from 'assets/images/sj/location.png';
import iconLocationBlue from 'assets/images/sj/location-blue.png';
import iconLocationYellow from 'assets/images/sj/location-yellow.png';
import iconLocationGreen from 'assets/images/sj/location-green.png';
import iconLocationGrey from 'assets/images/sj/location-grey.png';
import iconDirection from 'assets/images/sj/single-direction.png';

function generateImage(icon, height = '20px', width = '20px') {
  const image = new Image();
  image.src = icon;
  image.style.height = height;
  image.style.width = width;

  return image;
}

const locationRed = generateImage(iconLocationRed);
const locationBlue = generateImage(iconLocationBlue);
const locationYellow = generateImage(iconLocationYellow);
const locationGreen = generateImage(iconLocationGreen);
const locationGrey = generateImage(iconLocationGrey);
const direction = generateImage(iconDirection);

export {
  locationRed,
  locationBlue,
  locationYellow,
  locationGreen,
  locationGrey,
  direction,
};
