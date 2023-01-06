// tools.js
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Warning from "@editorjs/warning";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Image from "@editorjs/image";
import Raw from "@editorjs/raw";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import CheckList from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import SimpleImage from "@editorjs/simple-image";
import NestedList from "@editorjs/nested-list";
import Underline from "@editorjs/underline";

export const EDITOR_JS_TOOLS = {
  // NOTE: Paragraph is default tool. Declare only when you want to change paragraph option.
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+P",
  },
  embed: {
    class: Embed,
    inlineToolbar: true,
    config: {
      services: {
        youtube: true,
        coub: true,
        twitter: true,
        instagram: true,
        facebook: true,
        vine: true,
        soundcloud: true,
        vimeo: true,
        gfycat: true,
        imgur: true,
        twitch: true,
        codepen: {
          regex: /https?:\/\/codepen.io\/([^\/\?\&]*)\/pen\/([^\/\?\&]*)/,
          embedUrl:
            "https://codepen.io/<%= remote_id %>?height=300&theme-id=0&default-tab=css,result&embed-version=2",
          html: "<iframe height='300' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
          height: 300,
          width: 600,
          id: (groups) => groups.join("/embed/"),
        },
        github: {
          regex: /https?:\/\/gist.github.com\/([^\/\?\&]*)\/([^\/.?\&]*)/,
          embedUrl:
            'data:text/html;charset=utf-8,<head><base target="_blank" /></head><body><script src="https://gist.github.com/<%= remote_id %>.js" ></script></body>',
          html: '<iframe width="100%" height="350" src=""></iframe>',
          height: 300,
          width: 600,
          id: (groups) => `${groups.join("/")}`,
        },
      },
    },
    shortcut: "CMD+SHIFT+M",
  },
  table: Table,
  list: {
    class: NestedList,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+L",
  },
  warning: Warning,
  code: Code,
  linkTool: LinkTool,
  image: Image,
  raw: Raw,
  header: {
    class: Header,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+H",
    config: {
      placeholder: "Header",
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: "Enter a quote",
      captionPlaceholder: "Quote's author",
    },
    shortcut: "CMD+SHIFT+O",
  },

  Marker: {
    class: Marker,
    shortcut: "CMD+SHIFT+M",
  },
  checklist: {
    class: CheckList,
    inlineToolbar: true,
  },
  delimiter: Delimiter,
  inlineCode: {
    class: InlineCode,
    shortcut: "CMD+SHIFT+M",
    inlineToolbar: true,
  },
  simpleImage: SimpleImage,
  nestedList: NestedList,
  underline: {
    class: Underline,
    shortcut: "CMD+U",
    inlineToolbar: true,
  },
};
