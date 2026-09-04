export class WorkflowRunner {
    constructor(workflow, context, actions) {
        this.nodes = workflow.nodes;
        this.edges = workflow.edges;
        this.context = context;
        this.actions = actions;

        this.nodeMap = Object.fromEntries(
            this.nodes.map(n => [n.id, n])
        );
    }

    async run() {
        let node = this.nodes.find(n => n.type === 'triggerVolunteerSignup');
        const visited = new Set();

        while (node) {
            if (visited.has(node.id)) {
                console.warn("Workflow loop detected");
                break;
            }

            visited.add(node.id);

            if (node.type === "condition") {
                await this.executeNode(node);
                break;
            }

            await this.executeNode(node);

            const edges = this.edges.filter(e => e.source === node.id);
            if (!edges.length) break;

            node = this.nodeMap[edges[0].target];
        }
    }

    async executeNode(node) {
        const handler = this.actions[node.type];

        if (!handler) {
            console.warn(`No workflow action registered for node type "${node.type}"`);
            return;
        }

        try {
            await handler(node.data, this.context);
        } catch (err) {
            console.error("Workflow node failed", node, err);
        }
    }
}
