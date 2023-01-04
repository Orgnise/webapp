import React from "react";
import { ForceGraph2D } from "react-force-graph";
import { useLocation, useNavigate } from "react-router-dom";
import useTheme from "../../../hook/use-theme.hook";
import { LeftPanelSize } from "../../../layout/workspace-content-view";

export default function CollectionGraph({
  workspace,
  allCollection,
  leftPanelSize,
  setLeftPanelSize = (i) => {},
}) {
  if (!allCollection) {
    return <div>loading</div>;
  }
  const { darkMode } = useTheme();
  const slug = workspace?.meta?.slug;
  const pathArray = useLocation().pathname.split(slug);
  const relativePath = pathArray[0] + workspace.meta.slug;
  const currentItem = pathArray.length > 1 && pathArray[1].split("/")[1];

  const allItems =
    allCollection &&
    allCollection.reduce((acc, collection) => {
      return [
        ...acc,
        ...collection.children.map((item) => ({ ...item, collection })),
        collection,
      ];
    }, []);

  const links = [],
    node = [];

  allItems.forEach((item, index) => {
    node.push({
      id: item.id,
      name: item.title,
      size: 10 * index,
      color:
        currentItem == item.id
          ? "red"
          : item.parent
          ? darkMode
            ? "AliceBlue"
            : "black"
          : darkMode
          ? "MediumSlateBlue"
          : "SlateBlue",
    });
    // Add item
    if (item.parent) {
      links.push({
        source: item.id,
        target: item.parent,
      });
    } else {
      // add collection
      links.push({
        source: item.id,
        target: workspace.id,
      });
    }
  });

  // Add root node
  node.push({
    id: workspace.id,
    name: workspace.name,
    size: 0,
    color: "SeaGreen",
  });

  const tree2 = {
    nodes: node,
    links: links,
  };

  if (!tree2) {
    return <div>loading</div>;
  }

  const ref = React.useRef();
  const navigate = useNavigate();

  const handleClick = React.useCallback(
    (node) => {
      if (node.id === workspace.id) {
        navigate(`${relativePath}`);
        ref.current.zoomToFit(1400);
        setLeftPanelSize(LeftPanelSize.small);
        return;
      }
      navigate(`${relativePath}/${node.id}`);
      ref.current.zoomToFit(1400);
      setLeftPanelSize(LeftPanelSize.large);
    },
    [ref]
  );
  return (
    <div
      style={{ width: `${leftPanelSize}px` }}
      className="items-center flex place-content-center"
    >
      <ForceGraph2D
        ref={ref}
        graphData={tree2}
        nodeColor={(node) => node.color}
        nodeRelSize={4}
        linkColor={(link) =>
          darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
        }
        linkDirectionalParticles={3}
        linkDirectionalParticleWidth={1}
        linkDirectionalParticleSpeed={0.006}
        nodeLabel={(node) => node.name}
        warmupTicks={60}
        cooldownTicks={10}
        nodeAutoColorBy="group"
        nodeCanvasObject={(node, ctx, globalScale) => {
          // Draw node

          const label = node.name;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const backgroundDimensions = [textWidth, fontSize].map(
            (n) => n + fontSize * 1.2
          ); // some padding

          // Shadow
          if (!darkMode) {
            ctx.shadowColor = "#DADADA7D";
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          } else {
            ctx.shadowColor = "#00000052";
            ctx.fillStyle = "rgba(10, 10, 10, 0.6)";
          }

          ctx.fillRect(
            node.x - backgroundDimensions[0] / 2,
            node.y - backgroundDimensions[1] / 2,
            ...backgroundDimensions
          );

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = node.color;
          ctx.fillText(label, node.x, node.y);

          ctx.shadowBlur = 20;
          ctx.shadowOffsetX = 20;
          ctx.shadowOffsetY = 20;
        }}
        onNodeClick={handleClick}
        rendererConfig={{
          clearAlpha: 0,
          backgroundAlpha: 0,
          background: "transparent",
          showNavInfo: true,
          enablePointerInteraction: true,
        }}
        onEngineStop={() => {
          if (allItems.length > 15) {
            ref.current.zoomToFit(2000, 100);
            ref.current.centerAt(0, 30, 2000);
          } else if (allItems.length < 15) {
            ref.current.centerAt(0, 10, 2000);
            ref.current.zoom(4, 2000);
          }
        }}
      />
    </div>
  );
}
