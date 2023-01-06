import React from "react";
import EditorJS, { API, EditorConfig, OutputData } from "@editorjs/editorjs";
import CheckList from "@editorjs/checklist";
import { EDITOR_JS_TOOLS } from "./tools/tools";

export interface WrapperProps extends EditorConfig {
  reInitOnPropsChange?: () => string;
  onData?: (data: OutputData) => void;
  initialData: OutputData;
}

export class CustomEditor extends React.PureComponent<WrapperProps> {
  /**
   * Editor instance
   */
  public editor?: EditorJS;

  /**
   * Node to append ref
   */
  private node = React.createRef<HTMLDivElement>();

  private renderId: string = "";

  componentDidMount() {
    this.initEditor();
  }

  async componentDidUpdate() {
    const { reInitOnPropsChange } = this.props;

    const id = reInitOnPropsChange ? reInitOnPropsChange() : this.renderId;

    if (this.renderId != "" && id !== this.renderId) {
      this.editor!.clear();
      if (this.props.initialData) {
        this.editor!.render(this.props.initialData);
      } else {
        // console.log("🚀 ~ No initialData", this.props.initialData);
      }
      this.renderId = id;
    } else {
      this.renderId = id;
    }
  }

  componentWillUnmount() {
    this.removeEditor();
  }

  async initEditor() {
    const { holder, defaultBlock, ...config } = this.props;
    // console.log("Editor.js init", defaultBlock);

    const { handleChange } = this;

    const holderNode = !holder ? this.getHolderNode() : holder;

    this.editor = new EditorJS({
      ...config,
      holder: holderNode,
      tools: EDITOR_JS_TOOLS,
      onChange: handleChange,
      onReady: () => {
        if (this.props.onReady) {
          this.props.onReady();
        }
        const initialData = this.props.initialData;
        // Set initial data after editor is ready
        if (initialData) {
          this.editor!.isReady.then(() => {
            this.editor!.clear();
            this.editor!.render(initialData);
          });
        }
        if (defaultBlock) {
          // console.log("Editor.js data rendered");
          this.editor!.blocks.insert(defaultBlock);
        } else {
          // console.log("Editor.js data not rendered", defaultBlock);
        }
      },
    });
  }

  handleChange = async (api: API, event: CustomEvent<any>) => {
    const { onChange, onData } = this.props;

    if (onChange && typeof onChange === "function") {
      onChange(api, event);
    }

    if (onData && typeof onData === "function") {
      this.emitDataEvent(onData);
    }
  };

  emitDataEvent = async (cb: (data: OutputData) => void) => {
    try {
      const output = await this.editor!.save();
      cb(output);
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.error("Saving failed: ", error);
    }
  };

  removeEditor = async () => {
    if (this.editor) {
      try {
        await this.editor.isReady;

        this.editor.destroy();
        delete this.editor;

        return true;
      } catch (err) {
        // tslint:disable-next-line: no-console
        console.error(err);
        return false;
      }
    }

    return false;
  };

  getHolderNode = () => {
    const holder = this.node.current;

    if (!holder) {
      throw new Error("No node to append Editor.js");
    }

    return holder;
  };

  render() {
    if (!this.props.holder) {
      return <div ref={this.node} />;
    }

    return null;
  }
}

export default CustomEditor;
