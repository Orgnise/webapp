import {Collection } from "@/lib/types/types";

interface TreeNode<Collection> {
    _id: string | null;
    parent: string | null;
    children: TreeNode<Collection>[];
    // Dynamic properties
    [key: string]: T;
}

export function createTreeFromCollection(arr: Collection[]): TreeNode<Collection>[] {
    const map = new Map<string, TreeNode<Collection>>();
    arr.forEach(obj => {
        map.set(obj._id.toString(), { ...obj, children: [] } as unknown as TreeNode<Collection>);
    });
    console.log(map);
    const root: TreeNode<Collection> = { _id: null as any, parent: null, children: [] } as unknown as TreeNode<Collection>;
    arr.forEach(obj => {
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
