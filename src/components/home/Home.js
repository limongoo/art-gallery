import html from './home.html';
import './home.css';
import Picture from '../picture/Picture';
import Template from '../Template';

const template = new Template(html);

export default class Home {

  render() {
    const dom = template.clone();

    const hero = new Picture({
      aspectRatios: ['3:1', '2:1', '1:1'],
      breakpoints: [1100, 900, 500],
      options: 'c_fill,g_auto,q_auto,g_face,f_auto',
      fileName: 'toa-heftiba-417510_cs53kn.jpg',
      alt: 'Bear Mural by Tao Heftiba via Unsplash.com'
    });
    const heroDom = hero.render();


    dom.querySelector('#hero').appendChild(heroDom);

    return dom;
  }
}