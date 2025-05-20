import { SyntheticEvent } from 'react';
import { useEditor } from '../Hooks/Editor.hook';
import { dragStart } from '../Utils/dragStart';
import { cleanMjmlJson } from '../Utils/mjmlProcessor';
import { UiWrapper } from './UiWrapper';

export type DragEvent = SyntheticEvent & { dataTransfer: DataTransfer };

// prettier-ignore
const properties = ['align', 'background-color', 'border', 'border-bottom', 'border-left', 'border-radius', 'border-right', 'border-top', 'color', 'container-background-color', 'css-class', 'font-family', 'font-size', 'font-style', 'font-weight', 'height', 'inner-padding', 'letter-spacing', 'line-height', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'text-align', 'text-decoration', 'text-transform', 'vertical-align', 'width'];

// prettier-ignore
const properties_with_default_values = {"align": "left", "background-color": "#ffffff", "border": "1px solid #cccccc", "border-bottom": "", "border-left": "", "border-radius": "3px", "border-right": "", "border-top": "", "color": "#000000", "container-background-color": "", "css-class": "", "font-family": "Ubuntu, Helvetica, Arial, sans-serif", "font-size": "13px", "font-style": "", "font-weight": "normal", "height": "", "inner-padding": "10px 25px", "letter-spacing": "", "line-height": "120%", "padding": "10px 25px", "padding-bottom": "", "padding-left": "", "padding-right": "", "padding-top": "", "text-align": "left", "text-decoration": "none", "text-transform": "none", "vertical-align": "middle", "width": ""}

// prettier-ignore
const assigned_default_values = {"align": "left", "background-color": "#ffffff", "border": "1px solid #cccccc", "border-radius": "3px", "color": "#000000", "font-family": "Ubuntu, Helvetica, Arial, sans-serif", "font-size": "13px", "font-weight": "normal", "inner-padding": "10px 25px", "line-height": "120%", "padding": "10px 25px", "text-align": "left", "text-decoration": "none", "text-transform": "none", "vertical-align": "middle"}

export const TextBox = () => {
  const { mjmlJson, setMjmlJson } = useEditor();

  const config = {
    tagName: 'mj-text',
    attributes: {
      ...assigned_default_values,
      'css-class': 'mjml-tag identifier-mj-text',
    },
    children: [],
    content: 'Enter your text here',
    mutableProperties: properties,
    mutalbePropertiesWithDefaultValues: properties_with_default_values,
  };

  const onDragStart = (e: any) => {
    dragStart(e, config);
  };

  const onDragEnd = (e: DragEvent) => {
    const cleaned = cleanMjmlJson(mjmlJson);
    setMjmlJson({ ...cleaned });
  };

  return (
    <div onDragEnd={onDragEnd} onDragStart={onDragStart} draggable={true}>
      <UiWrapper background="textbox" label="Text Box" />
    </div>
  );
}; 