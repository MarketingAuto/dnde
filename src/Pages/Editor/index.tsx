import { Editor, EmailEditorProps } from './Editor';
import { DNDContext } from '../../Context/DragAndDrop.context';
import { EDContext } from '../../Context/Editor.context';
import { Ckeditor } from '../../Context/Ckeditor.context';
import { HtmlContextProvider } from '../../Context/Htmlwrapper.context';
import { CustomEditor } from '../../Context/CustomEditor.context';
import { forwardRef } from 'react';

const wrapContext = forwardRef((props: EmailEditorProps, ref) => (
  <HtmlContextProvider>
    <CustomEditor>
      <Ckeditor>
        <DNDContext>
          <EDContext>
            <Editor {...props} ref={ref} />
          </EDContext>
        </DNDContext>
      </Ckeditor>
    </CustomEditor>
  </HtmlContextProvider>
));

export default wrapContext;
