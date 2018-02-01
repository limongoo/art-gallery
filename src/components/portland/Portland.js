import html from './portland.html';
import './portland.css';
import Picture from '../picture/Picture';
import Template from '../Template';

const template = new Template(html);

export default class Portland {

  render() {
    const dom = template.clone();

    const pdxImg = ['wes-carr-377398_vhdjwo.jpg', 'meric-dagli-487825_krjhna.jpg', 'jordan-andrews-317311_fj2pjx.jpg', 'jon-tyson-228428_iqlxfa.jpg', 'henrik-donnestad-469641_nx9zdr.jpg'];
    const pdxAlt = ['Photo by Wes Carr via Unsplash', 'Photo by Meric Dagli via Unsplash', 'Photo by Jordan Andrews via Unsplash', 'Photo by John Tyson via Unsplash', 'Photo by Henrik Donnestad via Unsplash'];

    for(let i = 0; i < pdxImg.length; i++) {
      const portland = new Picture({
        aspectRatios: ['1:1', '2:1', '2:1'],
        breakpoints: [1200, 900, 500],
        options: 'c_fill,g_auto,q_auto,g_face,f_auto',
        fileName: pdxImg[i],
        alt: pdxAlt[i]
      });
      const portlandDom = portland.render();
      dom.querySelector('#portland').appendChild(portlandDom);
    }

    return dom;
  }
}