export type KeyValuePair = { key: string; value: string };

interface TreeNode {
    children: Map<string, TreeNode>;
    isEndOfWord: boolean;
    data?: KeyValuePair[];
}

class HashTree {
    private tree: Map<string, TreeNode>;

    constructor() {
        this.tree = new Map();
    }

    // Public method to add a key-value pair to the HashTree
    addToHashTree(pair: KeyValuePair): void {
        const firstChar = pair.key.toLowerCase().charAt(0);

        if (!this.tree.has(firstChar)) {
            this.tree.set(firstChar, {
                children: new Map(),
                isEndOfWord: false
            });
        }

        let currentNode = this.tree.get(firstChar)!;
        const chars = pair.key.toLowerCase().split('');

        // Start from index 1 since we already handled the first character
        for (let i = 1; i < chars.length; i++) {
            const char = chars[i];

            if (!currentNode.children.has(char)) {
                currentNode.children.set(char, {
                    children: new Map(),
                    isEndOfWord: false
                });
            }

            if (char === ' ' && i + 1 < chars.length) {
                // Handle space character special case
                const nextChar = chars[i + 1];
                const nextNode = currentNode.children.get(char)!;

                if (!this.tree.has(nextChar)) {
                    this.tree.set(nextChar, {
                        children: nextNode.children,
                        isEndOfWord: false
                    });
                }
            }

            currentNode = currentNode.children.get(char)!;
        }

        currentNode.isEndOfWord = true;
        if (!currentNode.data) {
            currentNode.data = [];
        }
        currentNode.data.push(pair);
    }

    // Public method to search the tree
    searchTree(input: string, pairs: KeyValuePair[]): void {
        const chrarr = input.toLowerCase().split("");

        if (chrarr.length === 0) {
            // Traverse the full tree
            for (const [key, node] of this.tree.entries()) {
                if (node.isEndOfWord && node.data) {
                    pairs.push(...node.data);
                }
                this.traverseNode(node, pairs);
            }
            return;
        }

        // Search for specific prefix
        const firstChar = chrarr[0];
        const firstNode = this.tree.get(firstChar);
        if (!firstNode) return;

        let currentNode = firstNode;

        // Follow the path of input characters
        for (let i = 1; i < chrarr.length; i++) {
            const child = currentNode.children.get(chrarr[i]);
            if (!child) return; // No matches found
            currentNode = child;
        }

        // Add matches from current node and its children
        if (currentNode.isEndOfWord && currentNode.data) {
            pairs.push(...currentNode.data);
        }
        this.traverseNode(currentNode, pairs);
    }

    // Helper method to traverse all children of a node
    private traverseNode(node: TreeNode, pairs: KeyValuePair[]): void {
        for (const childNode of node.children.values()) {
            if (childNode.isEndOfWord && childNode.data) {
                pairs.push(...childNode.data);
            }
            this.traverseNode(childNode, pairs);
        }
    }

    // Private method to recursively add a key-value pair to the tree
    private searchTreeAndAddToTable(link: [Map<string, any>, boolean], pair: KeyValuePair, i: number): void {
        const chrarr = pair.key.toLowerCase().split("");
        let ht = link[0];
        this.tree;

        if (!ht && i === chrarr.length) return;

        if (!ht && i !== chrarr.length) {
            ht = new Map();
            link[0] = ht;
        }

        if (ht && i === chrarr.length) {
            link[1] = true;
            return;
        }

        const keychar = chrarr[i];
        const complete = link[1];

        if (ht.has(keychar)) {
            const nxtchr = i + 1 < chrarr.length ? chrarr[i + 1] : null;

            if (keychar === " ") {
                const keyToAdd = chrarr[i + 1];
                const tblNext = ht.get(keychar)[0];

                if (this.tree.has(keyToAdd)) {
                    const keys = this.tree.get(keyToAdd);
                    if (keys && !keys.children.has(tblNext as unknown as string)) {
                        keys.children.set(tblNext as unknown as string, { children: new Map(), isEndOfWord: false });
                    }
                } else {
                    const keys = [new Map(), tblNext];
                    this.tree.set(keyToAdd, {
                        children: new Map(),
                        isEndOfWord: false,
                        data: []
                    });
                }
            }

            const nextLink = ht.get(keychar) as [Map<string, any>, boolean];
            this.searchTreeAndAddToTable(nextLink, pair, i + 1);

            if (i + 1 === chrarr.length) {
                const objLink = ht.get(keychar);
                if (objLink.length < 3) {
                    const newObjLink = [objLink[0], objLink[1], []];
                    ht.set(keychar, newObjLink);
                }

                const objLinkData = objLink[2];
                objLinkData.push([pair.key, pair.value]);
            }
        } else {
            let tblNext: Map<string, any> | null;
            let objArr: [Map<string, any> | null, boolean, any?];

            if (i === chrarr.length - 1) {
                objArr = [null, true, [[pair.key, pair.value]]];
                tblNext = null;
            } else {
                objArr = [new Map(), false];
                tblNext = objArr[0];

                if (keychar === " ") {
                    const keyToAdd = chrarr[i + 1];
                    if (this.tree.has(keyToAdd)) {
                        const keys = this.tree.get(keyToAdd);
                        if (keys && !keys.children.has(tblNext as unknown as string)) {
                            keys.children.set(tblNext as unknown as string, { children: new Map(), isEndOfWord: false });
                        }
                    } else {
                        const keys = [new Map(), tblNext];
                        this.tree.set(keyToAdd, {
                            children: new Map(),
                            isEndOfWord: false,
                            data: []
                        });
                    }
                }
            }

            this.searchTreeAndAddToTable([objArr[0] as Map<string, any>, objArr[1]], pair, i + 1);
        }
    }
}

export default HashTree;