import html from './lazyload.html';
import './lazyload.css';
import Template from '../Template';
import { getUrl } from '../../services/cloudinary';

const template = new Template(html);

export default class Lazyload {
  constructor(imgObj) {
    this.imgObj = imgObj;
  }

  getLoRes(imgTarget, captionTarget) {
    const { width, height, options, fileName, caption } = this.imgObj;
    const loResWidth = Math.round(width / 100);
    const loResHeight = Math.round(height / 100);
    const loResOptions = `${options},w_${loResWidth},h_${loResHeight},e_blur:500`;
    const loResUrl = getUrl(fileName, loResOptions);
    imgTarget.src = loResUrl;
    captionTarget.innerHTML = caption;
  }

  getHiResImage(target) {
    const { options, fileName, alt } = this.imgObj;
    const imgSizes = [500, 1000, 1500, 2000, 2500];
    let hiResHTML = '';
    for(let i = 0; i < imgSizes.length; i++) {
      const hiResOptions = `${options},w_${imgSizes[i]}`;
      const hiResUrl = getUrl(fileName, hiResOptions);
      if(i === 0) {
        hiResHTML += `<img src="${hiResUrl}" srcset="`;
      } else if(i < imgSizes.length - 1) {
        hiResHTML += `${hiResUrl} ${imgSizes[i]}w, `;
      } else {
        hiResHTML += `${hiResUrl} ${imgSizes[i]}w" alt="${alt}">`;
      }
    }
    target.innerHTML = hiResHTML;
  }



  render() {
    const dom = template.clone();

    this.getLoResImage(dom.querySelector('.loRes'), dom.querySelector('figcaption'));
    
    const config = {
      rootMargin: '-200px 0px',
      threshold: 0.01
    };

    const wrapper = dom.querySelector('.lazy');
    setTimeout(() => {
      let observer = new IntersectionObserver(([entry]) => {
        if(!entry || !entry.isIntersecting) return;
        observer.unobserve(wrapper);
        this.getHiResImage(wrapper.querySelector('.hiRes'));
      }, config);
      observer.observe(wrapper);
    });

    return dom;
  }
}