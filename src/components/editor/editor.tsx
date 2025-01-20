// Modules
import { useEffect, useRef, useCallback } from 'react';
import Editor, { useMonaco, type OnMount, type OnValidate, type OnChange } from '@monaco-editor/react';
import styled from '@emotion/styled';

// Utils
import type { File, Directory } from '../../utils/file-manager';

type Props = {
  selectedFile: File | undefined;
  rootDir: Directory;
  onValidate: OnValidate;
  onChange: OnChange;
};

export const CodeEditor = ({ selectedFile, rootDir, onValidate, onChange }: Props) => {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const monaco = useMonaco();

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  }

  useEffect(() => {
    if (!monaco) return;

    const initEditor = async () => {
      const files: File[] = [];

      // Flatten files from the rootDir
      const collectFiles = (dir: Directory) => {
        files.push(...dir.files);
        dir.dirs.forEach(collectFiles);
      };
      collectFiles(rootDir);
  
      // Add in-memory files to Monaco
      files.forEach((file) => {
        const path = `inmemory://model/${file.name}`;
        const uri = monaco.Uri.parse(path);
  
        const existingModel = monaco.editor.getModel(uri);
  
        if (existingModel) {
          if (existingModel.getValue() !== file.content) {
            existingModel.setValue(file.content);
          }
        } else {
          monaco.editor.createModel(file.content, 'typescript', uri);
        }
      });
  
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.Latest,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        strict: true,
        lib: ['esnext'],
        typeRoots: ['node_modules/@types'],
        baseUrl: '.',
        paths: {
          '*': ['inmemory://model/*'],
          "@type-challenges/utils": ['inmemory://model/test-utils.d.ts'],
        },        
        noUnusedLocals: false,
        noUnusedParameters: false,
      });
  
      // Load TypeScript standard library types
      const libFiles = [
        'lib.d.ts',
        'lib.esnext.d.ts',
        'lib.es2015.promise.d.ts',
      ];
    
      await Promise.all(
        libFiles.map((lib) =>
          fetch(`https://unpkg.com/typescript@latest/lib/${lib}`)
            .then((response) => response.text())
            .then((libContent) => {
              monaco.languages.typescript.typescriptDefaults.addExtraLib(libContent, `inmemory://model/${lib}`);
            })
            .catch((err) => console.error(`Failed to load ${lib}:`, err))
        )
      );
    
      // Register definition provider
      monaco.languages.registerDefinitionProvider('typescript', {
        async provideDefinition(model, position) {
          const worker = await monaco.languages.typescript.getTypeScriptWorker();
          const tsWorker = await worker(model.uri);
      
          // Get the definition at the given position
          const definitions = await tsWorker.getDefinitionAtPosition(
            model.uri.toString(),
            model.getOffsetAt(position)
          );
      
          if (!definitions || definitions.length === 0) {
            return null;
          }
      
          // Convert TypeScript definitions to Monaco definitions
          return definitions.map((definition) => ({
            uri: monaco.Uri.parse(definition.fileName),
            range: new monaco.Range(
              definition.textSpan.startLine + 1,
              definition.textSpan.startColumn + 1,
              definition.textSpan.startLine + 1,
              definition.textSpan.startColumn + definition.textSpan.length + 1
            ),
          }));
        },
      });

      monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
    }

    initEditor();

    return () => {
      monaco.editor.getModels().forEach((model) => {
        model.dispose();
      })
    };
  }, [monaco, rootDir]);

  useEffect(() => {
    if (!editorRef.current || !monaco || !selectedFile) return;
    const editorModel = monaco.editor.getModel(monaco.Uri.parse(`inmemory://model/${selectedFile?.name}`));

    if (editorModel) {
      editorRef.current.setModel(editorModel);
    } else {
      const newModel = monaco.editor.createModel(
        selectedFile.content,
        'typescript',
        monaco.Uri.parse(`inmemory://model/${selectedFile.name}`)
      );
      editorRef.current.setModel(newModel);
    }

  }, [monaco, selectedFile]);

  const onCodeValidate: OnValidate = useCallback((markers) => {
    onValidate(markers);
  }, [onValidate]);

  if (!selectedFile) return null;

  let language = selectedFile.name.split('.').pop();

  if (language === 'js' || language === 'jsx') language = 'javascript';
  else if (language === 'ts' || language === 'tsx') language = 'typescript';

  return (
    <Div>
      <Editor
        height='100vh'
        onChange={onChange}
        language={language}
        defaultLanguage='typescript'
        path={`inmemory://model/${selectedFile.name}`}
        theme='vs-dark'
        onMount={handleEditorDidMount}
        onValidate={onCodeValidate}
        options={{
          automaticLayout: true,
          contextmenu: true,
          quickSuggestions: true,
          suggestOnTriggerCharacters: true,
          tabCompletion: 'on',
          wordBasedSuggestions: 'currentDocument',
          selectionHighlight: true
        }}
      />
    </Div>
  );
};

const Div = styled.div`
  margin: 0;
  font-size: 16px;
`;
