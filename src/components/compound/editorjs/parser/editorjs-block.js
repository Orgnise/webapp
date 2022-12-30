import Blocks from "editorjs-blocks-react-renderer";

export function Article({ data }) {
  if (!data) {
    return null;
  }
  return <Blocks data={dataFromEditor} />;
}
