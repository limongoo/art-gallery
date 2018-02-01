import html from './brooklyn.html';
import '../portland/portland.css';
import '../home/slide.css';
import Picture from '../picture/Picture';
import Template from '../Template';

const template = new Template(html);

export default class Brooklyn {

  render() {
    const dom = template.clone();

    const bkyImg = ['chris-barbalis-349279_husxn2.jpg', 'chris-barbalis-340798_xvmole.jpg', 'chris-barbalis-229357_gsxmot.jpg', 'chris-barbalis-108774_hbqgdd.jpg', 'annie-spratt-253797_m4mkwl.jpg'];
    const bkyAlt = ['Photo by Chris Barbalis via Unsplash', 'Photo by Chris Barbalis via Unsplash', 'Photo by Chris Barbalis via Unsplash', 'Photo by Chris Barbalis via Unsplash', 'Photo by Annie Spratt via Unsplash'];

    for(let i = 0; i < bkyImg.length; i++) {
      const brooklyn = new Picture({
        aspectRatios: ['1:1', '2:1', '2:1'],
        breakpoints: [1200, 900, 500],
        options: 'c_fill,g_auto,q_auto,g_face,f_auto',
        fileName: bkyImg[i],
        alt: bkyAlt[i]
      });
      const brooklynDom = brooklyn.render();
      dom.querySelector('#brooklyn').appendChild(brooklynDom);
    }

    return dom;
  }
}