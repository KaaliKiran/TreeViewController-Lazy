import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import '../../index.css';
import ReactDOM from 'react-dom';

import React, { Component } from 'react';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';

export class TreeTableLazyDemo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            first: 0,
            rows: 10,
            totalRecords: 0,
            loading: true
        };

        this.onPage = this.onPage.bind(this);
        this.onExpand = this.onExpand.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                loading: false,
                nodes: this.loadNodes(this.state.first, this.state.rows),
                totalRecords: 1000
            });
        }, 500);
    }

    loadNodes(first, rows) {
        let nodes = [];

        for (let i = 0; i < rows; i++) {
            let node = {
                key: (first + i),
                data: {
                    name: 'Item ' + (first + i),
                    size: Math.floor(Math.random() * 1000) + 1 + 'kb',
                    type: 'Type ' + (first + i)
                },
                leaf: false
            };

            nodes.push(node);
        }

        return nodes;
    }

    onExpand(event) {
        if (!event.node.children) {
            this.setState({
                loading: true
            });

            setTimeout(() => {
                this.loading = false;
                let lazyNode = { ...event.node };

                lazyNode.children = [
                    {
                        data: {
                            name: lazyNode.data.name + ' - 0',
                            size: Math.floor(Math.random() * 1000) + 1 + 'kb',
                            type: 'File'
                        },
                    },
                    {
                        data: {
                            name: lazyNode.data.name + ' - 1',
                            size: Math.floor(Math.random() * 1000) + 1 + 'kb',
                            type: 'File'
                        }
                    }
                ];

                let nodes = this.state.nodes.map(node => {
                    if (node.key === event.node.key) {
                        node = lazyNode;
                    }

                    return node;
                });

                this.setState({
                    loading: false,
                    nodes: nodes
                });
            }, 250);
        }
    }

    onPage(event) {
        this.setState({
            loading: true
        });

        //imitate delay of a backend call
        setTimeout(() => {
            this.setState({
                first: event.first,
                rows: event.rows,
                nodes: this.loadNodes(event.first, event.rows),
                loading: false
            });
        }, 500);
    }

    render() {
        return (
            <div>
                <div className="card">
                    <TreeTable value={this.state.nodes} lazy paginator totalRecords={this.state.totalRecords}
                        first={this.state.first} rows={this.state.rows} onPage={this.onPage} onExpand={this.onExpand} loading={this.state.loading}>
                        <Column field="name" header="Name" expander></Column>
                        <Column field="size" header="Size"></Column>
                        <Column field="type" header="Type"></Column>
                    </TreeTable>
                </div>
            </div>
        )
    }
}
                
const rootElement = document.getElementById("root");
ReactDOM.render(<TreeTableLazyDemo />, rootElement);