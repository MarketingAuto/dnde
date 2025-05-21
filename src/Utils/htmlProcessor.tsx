import React, { createElement, ReactNode } from 'react';
import { HtmlWrapper } from '../Components/HtmlWrapper';
import { logger } from './logger';
import possibleStandardNames from './reactPropertyNames';
import { WrapWithOutline } from './wrapWithOutline';

const DEBUG = false;

export const domParser: any = new DOMParser();

export const htmlProcessor = (html: string): ReactNode => {
  if (typeof html !== 'string') {
    logger.error('htmlParser: html is not a string');
    return React.createElement('div', {}, 'errors: please check dev console') as ReactNode;
  }

  let doc = domParser.parseFromString(html, 'text/html');

  if (doc === null) {
    logger.error('htmlParser: doc is null, unable to process html');
    return React.createElement('p', {}, 'errors: please check dev console') as ReactNode;
  }
  return converter(doc as unknown as HTMLElement, 1);
};

const converter = (element: HTMLElement, key: number | string = 0) => {
  if (element === undefined) {
    return;
  }

  let nodeName = element.nodeName.toLowerCase();

  // Convert head and html tags to div to prevent invalid nesting
  if (nodeName === 'head' || nodeName === 'html' || nodeName === 'body' || nodeName === '#document') {
    nodeName = 'div';
  }

  // meta, script, style, ..etc, tags don't have children,
  if (
    nodeName === 'script' ||
    nodeName === 'style' ||
    nodeName === 'meta' ||
    nodeName === 'link' ||
    nodeName === 'title' ||
    nodeName === 'br'
  ) {
    if (nodeName === 'meta') {
      let el = element as HTMLMetaElement;
      return React.createElement(
        nodeName,
        { httpEquiv: el.httpEquiv, content: el.content, key: `meta-${key}` },
        null
      );
    }
    if (nodeName === 'link') {
      let el = element as HTMLLinkElement;
      let type = null;
      if (el.type) {
        type = el.type;
      }
      return React.createElement(
        nodeName,
        {
          href: el.href,
          rel: el.rel,
          type,
          key: `link-${key}`,
        },
        null
      );
    }
    if (nodeName === 'br') {
      return React.createElement(nodeName, { key: `br-${key}` }, null);
    }
    if (nodeName === 'title') {
      return React.createElement(nodeName, { key: `title-${key}` }, element.textContent);
    }

    return React.createElement(nodeName, {
      dangerouslySetInnerHTML: { __html: element.innerHTML },
      key: `${nodeName}-${key}`,
    });
  }

  let attributes: { [key: string]: string | { [key: string]: string } | any } = {};

  for (var i = 0; element.attributes && i < element.attributes.length; i++) {
    let attribute = element.attributes[i];
    let reactName = possibleStandardNames[attribute.name];

    if (reactName === undefined) {
      reactName = toCamelCase(attribute.name);
      const msg = `htmlParser: ${attribute.name} is not found in possible attributes,
      using ${reactName} instead.`;
      DEBUG && logger.error(msg, element);
    }

    let value = attribute.name === 'style' ? convertStyleStringToObject(attribute.value) : attribute.value.trim();

    attributes[reactName] = value;
  }

  attributes['key'] = `${nodeName}-${key}`;

  let children: ReactNode[] = [];

  if (element.className && element.className.includes('mj-text')) {
    const original = {
      nodeName,
      props: { ...attributes },
      children: [createElement('span', { key: `mj-text-span-${key}`, dangerouslySetInnerHTML: { __html: element.innerHTML } })],
    };

    return <HtmlWrapper uniqueKey={`mj-text-wrapper-${key}`} originalNode={original} />;
  }

  // Add handling for mj-raw content
  if (element.className && element.className.includes('mj-raw')) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = element.innerHTML;
    
    const children = Array.from(tempDiv.childNodes).map((child, index) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const childElement = child as HTMLElement;
        const childNodeName = childElement.nodeName.toLowerCase();
        const childAttributes: { [key: string]: any } = {};
        
        Array.from(childElement.attributes).forEach(attr => {
          if (attr.name === 'style') {
            childAttributes.style = convertStyleStringToObject(attr.value);
          } else {
            childAttributes[attr.name] = attr.value;
          }
        });

        // Special handling for input elements
        if (childNodeName === 'input') {
          return React.createElement('input', {
            ...childAttributes,
            key: `raw-input-${key}-${index}`
          });
        }

        // For other elements
        return React.createElement(childNodeName, {
          ...childAttributes,
          key: `raw-element-${key}-${index}`,
          dangerouslySetInnerHTML: { __html: childElement.innerHTML }
        });
      }
      return null;
    }).filter(Boolean);

    const original = {
      nodeName,
      props: { ...attributes },
      children
    };

    return <HtmlWrapper uniqueKey={`mj-raw-wrapper-${key}`} originalNode={original} />;
  }

  for (let i = 0; i < element.childNodes.length; i++) {
    let child = element.childNodes[i];

    if (child['nodeName'] === '#text') {
      if (child.textContent) {
        const content = child.textContent.replaceAll('\n', '').trim();
        if (content) {
          children.push(React.createElement('span', { key: `text-${key}-${i}` }, content));
        }
      }
      continue;
    }

    if (child['nodeName'] === '#comment') {
      continue;
    }

    if (nodeName !== 'script' && nodeName !== 'style') {
      const childElement = converter(child as HTMLElement, `${key}-${i}`);
      if (childElement) {
        children.push(childElement);
      }
    }
  }

  if (element.classList && element.classList.contains('mjml-tag')) {
    DEBUG && logger.info(`identified mjml-tag for : ${nodeName}, with attributes: ${JSON.stringify(attributes)}`);
    const original = { nodeName, props: { ...attributes }, children };

    return <HtmlWrapper key={`mjml-tag-${key}`} uniqueKey={`mjml-tag-${key}`} originalNode={original} />;
  }

  if (element.classList && element.classList.contains('placeitem-placeholder')) {
    return <WrapWithOutline key={`placeholder-${key}`} id={Number(key)} nodeName={nodeName} props={{ ...attributes }} children={children} />;
  }

  // remove href in link
  if (nodeName === 'a') {
    delete attributes['href'];
    delete attributes['target'];
  }

  // img tag should not have child param passed to it
  if (nodeName === 'img') {
    return React.createElement(nodeName, { key: `img-${key}`, ...attributes }, null);
  } else if (element.nodeType === 3) {
    return React.createElement(nodeName, { ...attributes, key: `text-node-${key}` }, element.textContent);
  }

  // Ensure all elements have a key
  const elementKey = attributes.key || `${nodeName}-${key}`;
  delete attributes.key; // Remove the key from attributes to avoid duplicate
  return React.createElement(nodeName, { ...attributes, key: elementKey }, children);
};

const convertStyleStringToObject = (style: string) => {
  let styleObject: { [key: string]: string } = {};

  //  edgecase
  //  "background:#ffffff url('background:#ffffff url('https://lh3.googleusercontent.com/-y_e1bS8pZSc/YKkCKwNrxgI/AAAAAAAADuY/l1ygemViAp8ZXd44mAvqypqg7zsTD2gIACLcBGAsYHQ/s1600/1621688872017805-1.png') center top / auto repeat;') center top / auto repeat;background-position:center top;background-repeat:repeat;background-size:auto;margin:0px auto;border-radius:0px;max-width:600px;"
  // https://stackoverflow.com/a/9219386/6843092, with negative lookahead
  let styleArray = style.split(/;+(?![^(]*\))/g);

  for (let i = 0; i < styleArray.length; i++) {
    if (styleArray[i] === '') {
      continue;
    }

    // bug while parsing
    // 'background:#ffffff url('https://...') center top / auto repeat;'
    let [key, ..._value] = styleArray[i].split(':');

    let stylePair = [key, _value.join(':')];
    let property = stylePair[0].trim();
    property = toCamelCase(property);
    let value = stylePair[1].trim();
    styleObject[property] = value;
  }

  return styleObject;
};

const toCamelCase = (str: string) => {
  return str.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });
};
