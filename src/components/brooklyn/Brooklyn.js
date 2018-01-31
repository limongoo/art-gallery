import html from './brooklyn.html';
import '../portland/portland.css';
import Template from '../Template';

const template = new Template(html);

export default class Brooklyn {

  render() {
    const dom = template.clone();

    return dom;
  }
}