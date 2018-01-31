import html from './portland.html';
import './portland.css';
import Template from '../Template';

const template = new Template(html);

export default class Portland {

  render() {
    const dom = template.clone();

    return dom;
  }
}