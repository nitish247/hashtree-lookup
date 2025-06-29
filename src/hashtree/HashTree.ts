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
    addToTree(pair: KeyValuePair): void {
        const firstChar = pair.key.toLowerCase().charAt(0);

        if (!this.tree.has(firstChar)) {
            this.tree.set(firstChar, {
                children: new Map(),
                isEndOfWord: false
            });
        }

        let currentNode = this.tree.get(firstChar)!;
        const chars = pair.key.toLowerCase().split('');

        for (let i = 1; i < chars.length; i++) {
            const char = chars[i];

            if (!currentNode.children.has(char)) {
                currentNode.children.set(char, {
                    children: new Map(),
                    isEndOfWord: false
                });
            }

            currentNode = currentNode.children.get(char)!;
        }

        currentNode.isEndOfWord = true;
        if (!currentNode.data) {
            currentNode.data = [];
        }
        // Prevent duplicate keys
        if (!currentNode.data.some(item => item.key === pair.key)) {
            currentNode.data.push(pair);
        }
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
}

export default HashTree;