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
    constructor(rootItem) {
        this.rootNode = this.createNewNode(rootItem)
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
        } else { this.rootNode.setItem(item) }
    }

    setChild(item) {
        let newChild = new ArtistNode(item)
        this.rootNode.addNodeChild(newChild)
    }

    getChildren() {
        return this.rootNode.getChildren()
    }
}

export default ArtistTree;
