import { Fragment, useState, type CSSProperties } from 'react';
import styled from '@emotion/styled';
import { type Directory, type File, sortDir, sortFile } from '../../utils/file-manager';
import { getIcon } from '../icon';

interface FileTreeProps {
  rootDir: Directory;
  selectedFile: File | undefined;
  onSelect: (file: File) => void;
  overrideSubTreeStyle?: Record<Directory['depth'], () =>  CSSProperties>;
}

export const FileTree = (props: FileTreeProps) => {
  return <SubTree directory={props.rootDir} {...props} />;
};

interface SubTreeProps {
  directory: Directory;
  selectedFile: File | undefined;
  onSelect: (file: File) => void;
  overrideSubTreeStyle?: Record<Directory['depth'], () =>  CSSProperties>;
}

const SubTree = (props: SubTreeProps) => {
  const { overrideSubTreeStyle } = props;
  const style = overrideSubTreeStyle?.[props.directory.depth]?.() ?? {};

  return (
    <div style={style}>
      {props.directory.dirs.sort(sortDir).map((dir) => (
        <Fragment key={dir.id}>
          <DirDiv directory={dir} selectedFile={props.selectedFile} onSelect={props.onSelect} />
        </Fragment>
      ))}
      {props.directory.files.sort(sortFile).map((file) => (
        <Fragment key={file.id}>
          <FileDiv file={file} selectedFile={props.selectedFile} onClick={() => props.onSelect(file)} />
        </Fragment>
      ))}
    </div>
  );
};

const FileDiv = ({
  file,
  icon,
  selectedFile,
  onClick,
}: {
  file: File | Directory;
  icon?: string;
  selectedFile: File | undefined;
  onClick: () => void;
}) => {
  const isSelected = (selectedFile && selectedFile.id === file.id) as boolean;
  const depth = file.depth;
  return (
    <Div depth={depth} isSelected={isSelected} onClick={onClick}>
      <FileIcon name={icon} extension={file.name.split('.').pop() || ''} />
      <span style={{ marginLeft: 1 }}>{file.name}</span>
    </Div>
  );
};

const Div = styled.div<{
  depth: number;
  isSelected: boolean;
}>`
  display: flex;
  align-items: center;
  padding-left: ${(props) => props.depth * 16}px;
  background-color: ${(props) => (props.isSelected ? '#242424' : 'transparent')};

  :hover {
    cursor: pointer;
    background-color: #242424;
  }
`;

const DirDiv = ({
  directory,
  selectedFile,
  onSelect,
}: {
  directory: Directory;
  selectedFile: File | undefined;
  onSelect: (file: File) => void;
}) => {
  let defaultOpen = false;
  if (selectedFile) defaultOpen = isChildSelected(directory, selectedFile);
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <FileDiv
        file={directory}
        icon={open ? 'openDirectory' : 'closedDirectory'}
        selectedFile={selectedFile}
        onClick={() => setOpen(!open)}
      />
      {open ? <SubTree directory={directory} selectedFile={selectedFile} onSelect={onSelect} /> : null}
    </>
  );
};

const isChildSelected = (directory: Directory, selectedFile: File) => {
  let res: boolean = false;

  function isChild(dir: Directory, file: File) {
    if (selectedFile.parentId === dir.id) {
      res = true;
      return;
    }
    if (selectedFile.parentId === '0') {
      res = false;
      return;
    }
    dir.dirs.forEach((item) => {
      isChild(item, file);
    });
  }

  isChild(directory, selectedFile);
  return res;
};

const FileIcon = ({ extension, name }: { name?: string; extension?: string }) => {
  const icon = getIcon(extension || '', name || '');
  return <Span>{icon}</Span>;
};

const Span = styled.span`
  display: flex;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
`;
