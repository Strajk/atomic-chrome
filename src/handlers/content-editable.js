import BaseHandler from './base';
import string from 'ac-util/string';

class ContentEditableHandler extends BaseHandler {
  getValue() {
    const result = this.extractText(this.elem);
    return Promise.resolve(result);
  }

  // TODO: extract this to a dedicated class
  extractText(elem, options) {
    options = options || {};
    return Array.from(elem.childNodes).map((child, i) => {
      if (child.wholeText) {
        return child.wholeText + (options.noLinebreak ? '' : '\n');
      }
      const tag = child.tagName.toLowerCase();
      switch (tag) {
      case 'div':
        return this.extractText(child, {noLinebreak: true}) + '\n';
      case 'br':
        const noBreak = options.noLinebreak || i === this.elem.childNodes.length - 1;
        return noBreak ? '' : '\n';
      default:
        return this.extractTextFromUnknownElem(child, options);
      }
    }).join('');
  }

  extractTextFromUnknownElem(elem, _options) {
    return elem.outerHTML;
  }

  setValue(value) {
    const htmlValue = value.split('\n').map((v) => {
      if (v.trim().length === 0) {
        return '<br>';
      }
      return '<div>' + string.htmlEscape(v) + '</div>';
    }).join('');
    this.elem.innerHTML = htmlValue;
    super.setValue(value);
  }
}

ContentEditableHandler.canHandle = function (elem) {
  return elem.isContentEditable;
};

export default ContentEditableHandler;
