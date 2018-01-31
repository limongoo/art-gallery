import html from './picture.html';
import Template from '../Template';
import { getUrl } from '../../services/cloudinary';

const template = new Template(html);

export default class Picture {
  constructor(cloudinaryObj) {
    this.cloudinaryObj = cloudinaryObj;
  }

  create(cloudinaryObj) {
    let pictureHTML = '';

    for(let i=0; i < cloudinaryObj.aspectRatios.length; i++) {
      
      // regualr image
      const imgOptions = `${cloudinaryObj.options},ar_${cloudinaryObj.aspectRatios[i]},w_${cloudinaryObj.breakpoints[i]}`;
      const imgUrl = getUrl(cloudinaryObj.fileName, imgOptions);
      
      // 2x image
      const retinaOptions = `${cloudinaryObj.options},ar_${cloudinaryObj.aspectRatios[i]},w_${cloudinaryObj.breakpoints[i] * 2}`;
      const retinaUrl = getUrl(cloudinaryObj.fileName, retinaOptions);

      if(i < cloudinaryObj.aspectRatios.length - 1) {
        
        // if this is NOT the last image in the array, output the <source> element
        pictureHTML += `<source media="(min-width: ${cloudinaryObj.breakpoints[(i + 1)]}px)" srcset=${imgUrl}, ${retinaUrl} 2x">`;
      } else {

        // if this IS the last image, output the <img> element
        pictureHTML += `<img srcset="${imgUrl}, ${retinaUrl} 2x" alt="${cloudinaryObj.alt}">`;
      }
    }
    return pictureHTML;
  }

  render() {
    const dom = template.clone();
  
    dom.querySelector('picture').innerHTML = this.create(this.cloudinaryObj);

    return dom;
  }
}