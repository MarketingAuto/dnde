import { SyntheticEvent } from 'react';
import { useEditor } from '../Hooks/Editor.hook';
import { dragStart } from '../Utils/dragStart';
import { cleanMjmlJson } from '../Utils/mjmlProcessor';
import { UiWrapper } from './UiWrapper';

export type DragEvent = SyntheticEvent & { dataTransfer: DataTransfer };

const properties = [
  'type', 'placeholder', 'value', 'name', 'required', 'disabled',
  'readonly', 'maxlength', 'minlength', 'pattern', 'css-class',
  'font-size', 'font-family', 'color', 'width', 'height',
  'border', 'border-radius', 'padding'
];

const properties_with_default_values = {
  type: 'text',
  placeholder: 'Enter your text here',
  value: '',
  name: '',
  required: false,
  disabled: false,
  readonly: false,
  maxlength: '',
  minlength: '',
  pattern: '',
  'css-class': 'mjml-tag identifier-mj-text',
  'font-size': '14px',
  'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
  color: '#000000',
  width: '100%',
  height: '',
  border: '1px solid #ccc',
  'border-radius': '4px',
  padding: '8px'
};

export const TextBox = () => {
  const { mjmlJson, setMjmlJson } = useEditor();

  const config = {
    tagName: 'mj-text',
    attributes: {
      ...properties_with_default_values,
      'css-class': 'mjml-tag identifier-mj-text',
    },
    content: `<input 
      type="text"
      name="text_input"
    />`,
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
