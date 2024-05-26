import { CollectionDbSchema } from "../db-schema/collection.schema";
import { Collection } from "../types/types";

interface TreeNode<CollectionSchema> {
  _id: string | null;
  parent: string | null;
  children: TreeNode<CollectionSchema>[];
  // Dynamic properties
  [key: string]: any;
}

export function createTreeFromCollection(
  arr: CollectionDbSchema[],
): TreeNode<CollectionDbSchema>[] {
  const map = new Map<string, TreeNode<CollectionDbSchema>>();
  arr.forEach((obj) => {
    map.set(obj._id.toString(), {
      ...obj,
      children: [],
    } as unknown as TreeNode<CollectionDbSchema>);
  });
  const root: TreeNode<CollectionDbSchema> = {
    _id: null as any,
    parent: null,
    children: [],
  };
  arr.forEach((obj) => {
    if (obj.parent) {
      const parent = map.get(obj.parent.toString());
      if (parent) {
        parent.children.push(map.get(obj._id.toString())!);
      }
    } else {
      root.children.push(map.get(obj._id.toString())!);
    }
  });

  return root.children;
}

/**
 * Function to search and update the tree node
 * @param tree
 * @param id
 * @param update
 * @returns
 */
export function updateInCollectionTree(
  tree: TreeNode<Collection>[],
  id: string,
  update: Partial<Collection>,
): TreeNode<Collection>[] {
  return tree.map((node) => {
    if (node._id === id) {
      return { ...node, ...update };
    }
    if (node.children.length > 0) {
      return {
        ...node,
        children: updateInCollectionTree(node.children, id, update),
      };
    }
    return node;
  });
}

/**
 * Function to add a new node to the tree
 * @param tree
 * @param id
 * @param newNode
 * @returns
 */
export function addInCollectionTree(
  tree: TreeNode<Collection>[],
  id: string | undefined | null,
  newNode: TreeNode<Collection>,
): TreeNode<Collection>[] {
  if (tree.length === 0) {
    return [newNode];
  } else if (!id || id == null) {
    return [...tree, newNode];
  } else {
    return tree.map((node) => {
      if (node._id === id) {
        return { ...node, children: [...node.children, newNode] };
      }
      if (node.children.length > 0) {
        return {
          ...node,
          children: addInCollectionTree(node.children, id, newNode),
        };
      }
      return node;
    });
  }
}

/**
 * Function to remove a node from the tree
 * @param tree
 * @param id
 * @returns
 */
export function removeFromCollectionTree(
  tree: TreeNode<Collection>[],
  id: string,
): TreeNode<Collection>[] {
  return tree.filter((node) => {
    if (node._id === id) {
      console.log("Removing node", node._id);
      return false;
    }
    if (node.children.length > 0) {
      // return { ...node, children: removeTreeNode(node.children, id) };
      node.children = removeFromCollectionTree(node.children, id);
    }
    return true;
  });
}

/**
 * Function to search a leave element in the tree
 * @param tree
 * @param predicate
 * @returns
 */
export function findInCollectionTree(
  tree: TreeNode<Collection>[],
  predicate: (node: TreeNode<Collection>) => boolean,
): TreeNode<Collection> | null {
  if (!tree) return null;
  for (let node of tree) {
    if (predicate(node)) {
      return node;
    }
    if (node.children.length > 0) {
      const result = findInCollectionTree(node.children, predicate);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

/**
 * Function to flatten the collection tree
 * @param tree
 * @returns
 */
export function flattenCollectionTree(
  tree: Collection[] | undefined,
): Collection[] {
  if (!tree) return [];
  let result: Collection[] = [];
  tree.forEach((node) => {
    result.push(node);
    if (node.children.length > 0) {
      result = result.concat(flattenCollectionTree(node.children));
    }
  });
  return result;
}