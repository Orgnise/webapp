import React, { useState, useEffect } from "react";
import { useAppService } from "../../../hooks/use-app-service";
import useAuth from "../../../hooks/use-auth";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import Validator from "../../../helper/validator";
import { useLocation } from "react-router-dom";
import { faker } from "@faker-js/faker";
import { Fold } from "../../../helper/typescript-utils";

interface IProps {
    onCollectionCreate?: (collection: any) => void;
    onCollectionUpdate?: (collection: any) => void;
    onCollectionDelete?: (collection: any) => void;
    onItemCreate?: (item: any) => void;
    onItemUpdate?: (item: any) => void;
    onItemDelete?: (id: any, parent: String) => void;
}


export default function useCollection(teamId: String, workspaceId: String,
    {
        onCollectionCreate = (_: any) => { },
        onItemCreate = (_: any) => { },
        /**
        * Update collection/ item
        * @param {Object} data - object containing id, title and content
        * @param {String} data.id - id of collection
        * @param {String} data.title - title of collection
        * @param {String} data.parent - parent id of item (if any)
        * @param {String} data.content - content of collection
        */
        onCollectionUpdate = (_: any) => { },
        onCollectionDelete = (_: any) => { },
        onItemDelete = (id: any, parent: String) => { },
        onItemUpdate = (_: any) => { }
    }: IProps): {
        isLoadingCollection: boolean;
        isCreatingCollection: boolean;
        // isDeletingCollection: boolean;
        createCollection: () => void;
        createItem: (collection: Object) => void;
        updateCollection: (body: Object) => void;
        deleteCollection: (id: String, parent: String | undefined) => void;
    } {


    const [isLoadingCollection, setIsLoadingCollection] = useState(false);
    const [isCreatingCollection, setIsCreatingCollection] = useState(false);
    const [isDeletingCollection, setIsDeletingCollection] = useState(false);

    const { collectionService } = useAppService();

    // Create collection
    function createCollection() {
        if (!Validator.hasValue(workspaceId) || isCreatingCollection) {
            return;
        }
        setIsCreatingCollection(true);
        const title = faker.name.jobTitle();
        collectionService
            .createCollection({
                teamId: teamId,
                workspaceId: workspaceId,
                title: title,
                object: "collection",
            })
            .then(({ item }: any) => {
                onCollectionCreate(item);
            })
            .catch((err) => {
                console.error("getAllCollection", err);
            })
            .finally(() => {
                setIsCreatingCollection(false);
            });
    }

    // Create item
    function createItem(collection: any) {
        if (!Validator.hasValue(workspaceId) || isCreatingCollection) {
            return;
        }
        const collectionId = collection.id;
        setIsCreatingCollection(true);
        const title = faker.name.jobTitle();
        collectionService
            .createCollection({
                teamId: teamId,
                workspaceId: workspaceId,
                title: title,
                object: "item",
                parent: collectionId,
                content: faker.lorem.paragraphs(),
            })
            .then(({ item }: any) => {
                onItemCreate(item);

                if (Validator.hasValue(collection)) {
                    if (Validator.hasValue(collection.children)) {
                        collection.children.push(item);
                    } else {
                        collection.children = [item];
                    }
                }
                onCollectionUpdate(collection);

            })
            .catch((err) => {
                console.error("getAllCollection", err);
            })
            .finally(() => {
                setIsCreatingCollection(false);
            });
    }

    /**
   * Delete collection
   * @param {Object} data - object containing id and parent
   * @param {String} data.id - id of collection
   * @param {String} data.parent - parent id of collection (if any)
   */
    function deleteCollection(id: String, parent: String | undefined) {
        if (!Validator.hasValue(workspaceId) || isDeletingCollection) {
            return;
        }

        setIsDeletingCollection(true);

        collectionService
            .deleteCollection(id)
            .then(({ item }: any) => {
                if (Validator.hasValue(parent)) {
                    onItemDelete(id, parent!);
                    toast.success("Item deleted", { position: "top-right" });
                    return;
                } else {
                    onCollectionDelete(item);
                    toast.success("Collection deleted", { position: "top-right" });
                }
            })
            .catch((err) => {
                console.error("getAllCollection", err);
                toast.error("Failed to delete collection", { position: "top-right" });
            })
            .finally(() => {
                setIsDeletingCollection(false);
            });
    }


    /**
     * Update collection/ item
     * @param {Object} data - object containing id, title and content
     * @param {String} data.id - id of collection
     * @param {String} data.title - title of collection
     * @param {String} data.parent - parent id of item (if any)
     * @param {String} data.content - content of collection
     */
    function updateCollection(data: Object) {
        if (!Validator.hasValue(workspaceId) || isCreatingCollection) {
            return;
        }
        const { id, parent, title, content }: any = data;
        setIsCreatingCollection(true);
        collectionService
            .updateCollection(id, {
                teamId: teamId,
                title,
                content,
            })
            .then(({ item }: any) => {
                if (Validator.hasValue(parent)) {
                    onItemUpdate(item);
                    toast.success("Item updated", { position: "top-right" });
                    return;
                } else {
                    onCollectionUpdate(item);
                    toast.success("Collection updated", { position: "top-right" });
                }
            }
            )
            .catch((err) => {
                console.error("getAllCollection", err);
            })
            .finally(() => {
                setIsCreatingCollection(false);
            });
    }



    return { createCollection, createItem, isLoadingCollection, isCreatingCollection, deleteCollection, updateCollection };
}