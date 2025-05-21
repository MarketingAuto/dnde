import { Form, Input } from 'antd';
import _ from 'lodash';
import { ChangeEvent, useEffect, useState } from 'react';
import { useVisibility } from '../../Hooks/Attribute.hook';
import { useEditor } from '../../Hooks/Editor.hook';
import { logger } from '../../Utils/logger';
import { UpdateValue } from '../../Utils/operations';

const ATTRIBUTE = 'name';

const Name = () => {
  let [visible, path] = useVisibility({ attribute: ATTRIBUTE });
  const { mjmlJson, setMjmlJson } = useEditor();
  const [value, setValue] = useState<string>();

  useEffect(() => {
    if (visible && path) {
      const item = _.get(mjmlJson, path);
      if (item && item.attributes && item.attributes[ATTRIBUTE]) {
        setValue(item.attributes[ATTRIBUTE]);
      }
    }
  }, [visible, path]);

  useEffect(() => {
    value && UpdateValue({ visible, path, mjmlJson, setMjmlJson, value, attribute: ATTRIBUTE });
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newName = e.currentTarget.value;
    logger.log('name value', newName);
    if (path && visible) {
      setValue(newName);
      // Also update the content property if it exists and contains an <input ... name="..." />
      let item = _.get(mjmlJson, path);
      if (item && item.content) {
        // Replace the name attribute in the input tag inside content
        item.content = item.content.replace(/name="[^"]*"/, `name="${newName}"`);
        const updated = _.set(mjmlJson, path, item);
        setMjmlJson({ ...updated });
      }
    }
  };

  return visible ? (
    <Form.Item label="Name :">
      <Input onChange={handleChange} type="text" value={value} />
    </Form.Item>
  ) : null;
};

export default Name; 