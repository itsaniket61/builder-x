import React, { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import plugin from 'grapesjs-tailwind';

const GrapesJSComponent = ({
  initialMarkup,
  initialStyle,
  onMarkupChange,
  onStyleChange,
}) => {
  const editorRef = useRef(null);

  const setMarkupAndStyle = (editor) => {
    if (editor) {
      const html = editor.getHtml();
      const css = editor.getCss();
      onMarkupChange(html);
      onStyleChange(css);
    }
  };

  useEffect(() => {
    const editor = grapesjs.init({
      container: editorRef.current,
      storageManager: false,
      plugins: [plugin],
      pluginsOpts: {
        [plugin]: {
          /* options */
        },
      },
    });

    editor.setComponents(initialMarkup);
    editor.setStyle(initialStyle);
    

    // Subscribe to changes in the editor and update markup and style
    const updateListener = () => setMarkupAndStyle(editor);
    editor.on('component:update', updateListener);

    return () => {
      if (editor) {
        editor.off('component:update', updateListener); // Remove event listener
        editor.destroy(); // Clean up editor instance
      }
    };
  }, [initialMarkup,initialStyle]);

  return <div ref={editorRef}></div>;
};

export default GrapesJSComponent;
