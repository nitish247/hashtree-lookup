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
        const words = pair.key.toLowerCase().split(" ");

        for (const word of words) {
            const firstChar = word.charAt(0);

            if (!this.tree.has(firstChar)) {
                this.tree.set(firstChar, {
                    children: new Map(),
                    isEndOfWord: false
                });
            }

            let currentNode = this.tree.get(firstChar)!;
            const chars = word.split('');

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
    }

    // Public method to search the tree
    searchTree(input: string, pairs: KeyValuePair[]): void {
        const queries = input.toLowerCase().split(" ").filter(query => query.trim() !== "");

        if (queries.length === 0) {
            // If the input is empty, return all rows
            for (const node of this.tree.values()) {
                if (node.isEndOfWord && node.data) {
                    pairs.push(...node.data);
                }
                this.traverseNode(node, pairs);
            }
            return;
        }

        for (const query of queries) {
            const chrarr = query.split("");

            // Search for specific prefix
            const firstChar = chrarr[0];
            const firstNode = this.tree.get(firstChar);
            if (!firstNode) continue;

            let currentNode = firstNode;

            // Follow the path of input characters
            for (let i = 1; i < chrarr.length; i++) {
                const child = currentNode.children.get(chrarr[i]);
                if (!child) break; // No matches found
                currentNode = child;
            }

            // Add matches from current node and its children
            if (currentNode.isEndOfWord && currentNode.data) {
                pairs.push(...currentNode.data);
            }
            this.traverseNode(currentNode, pairs);
        }
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