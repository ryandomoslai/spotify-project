/**
 * A node tree, designed for drawing paths from artists in the Spotify API
 * Created by: Ryan Domoslai, for https://github.com/ryandomoslai/spotify-project
 */

import ArtistNode from './artistNode';

class ArtistTree {

    /**
     * Creates a new ArtistTree
     * @param {*} rootItem Item that is initialized as root item.
     * @param {*} leftTree Item initialized as root left subtree.
     * @param {*} rightTree Item initialized as root right subtree.
     */
    constructor(rootItem, leftTree, rightTree) {
        this.rootNode = this.createNewNode(rootItem)
        this.setRootLeftTree(leftTree)
        this.setRootRightTree(rightTree)
    }

    /**
     * Creates a new ArtistNode for the ArtistTree.
     * @param {*} item The item to be placed in the new node.
     */
    createNewNode(item) {
        return new ArtistNode(item)
    }

    /**
     * Checks if the ArtistTree is empty.
     * @returns Whether or not the rootNode is initialized.
     */
    isEmpty() {
        return !this.rootNode
    }

    /**
     * @returns the root node of the ArtistTree.
     */
    rootNode() {
        return this.rootNode
    }

    /**
     * Replaces the current rootNode with newNode
     * @param {*} newNode An ArtistNode to replace this.rootNode.
     */
    setRootNode(newNode) {
        this.rootNode = newNode
    }

    /**
     * @returns The item contained within the rootNode.
     */
    rootItem() {
        if (this.isEmpty()) {
            // Throw exception
        } else { return this.rootNode.item() }
    }

    /**
     * Sets the item contents of the rootNode.
     * @param {*} item The new contents of the rootNode.
     */
    setRootItem(item) {
        if (this.isEmpty()) {
            // Throw exception
        } else { this.rootNode.setItem(item); }
    }

    /**
     * @returns The left subtree of the root.
     */
    rootLeftSubTree() {
        if (this.isEmpty()) {
            // Throw exception
        } else {
            let result = new ArtistTree(this.rootNode.leftNode(), null, null)
            return result
        }
    }

    /**
     * @returns The right subtree of the root.
     */
    rootRightSubTree() {
        if (this.isEmpty()) {
            // Throw exception
        } else {
            let result = new ArtistTree(this.rootNode.rightNode(), null, null)
            return result
        }
    }

    /**
     * Sets the new left subtree of the root.
     * @param {} newTree The tree to replace the current left tree.
     */
    setRootLeftTree(newTree) {
        if (this.isEmpty()) {
            // Throw exception
        } else {
            if (newTree != null) {
                this.rootNode.addNodeChild(newTree.rootNode())
            } else {
                this.rootNode.addNodeChild(null)
            }
        }
    }

    /**
     * Sets the new right subtree of the root.
     * @param {*} newTree The tree to replace the current right tree.
     */
    setRootRightTree(newTree) {
        if (this.isEmpty()) {
            // Throw exception
        } else {
            if (newTree != null) {
                this.rootNode.addNodeChild(newTree.rootNode())
            } else {
                this.rootNode.addNodeChild(null)
            }
        }
    }
}

export default ArtistTree;
