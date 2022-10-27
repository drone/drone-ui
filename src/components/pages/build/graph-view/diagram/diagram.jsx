import { CanvasWidget } from '@projectstorm/react-canvas-core';
import createEngine, {
  DiagramModel, DagreEngine,
} from '@projectstorm/react-diagrams';
import classNames from 'classnames/bind';
import React, {
  useMemo,
  useLayoutEffect,
} from 'react';

import Controls from './controls';
import {
  NodeDefaultFactory, NodeDefaultModel,
} from './custom-nodes/node-default';
import {
  NodeEdgeFactory, NodeEdgeModel,
} from './custom-nodes/node-edge';
import css from './diagram.module.scss';

const cx = classNames.bind(css);

const isGraph = (items, diagramKind) => diagramKind === 'stage' || items.some((item) => item.options.depends_on?.length);

const connectNodes = (node1, node2, linksStore) => {
  const portOut = node1.getPort('out');
  const portIn = node2.getPort('in');
  const link = portOut.link(portIn);
  link.setWidth(1);
  link.setColor('#2477e5');
  linksStore.push(link);
};

const Diagram = (props) => {
  const {
    items, nodeSelectHandler, selectedNodeNumber, graphOffsetX, graphOffsetY,
    kind = 'step',
  } = props;
  const dagreEngine = useMemo(() => new DagreEngine({
    graph: {
      rankdir: 'LR',
      ranker: 'network-simplex',
      marginx: graphOffsetX,
      marginy: graphOffsetY,
      nodesep: 35,
      edgesep: 10,
      ranksep: 75,
    },
    includeLinks: false,
  }), [graphOffsetX, graphOffsetY]);

  // create nodes
  const nodeModels = useMemo(() => {
    const basicNodes = items?.map((item) => {
      const n = new NodeDefaultModel({
        name: item.name,
        status: item.status,
        number: item.number,
        depends_on: item.depends_on,
      });
      n.addInPort('in');
      n.addOutPort('out');
      return n;
    }) ?? [];
    if (basicNodes.length) {
      // add listeners
      basicNodes.forEach((node) => node.registerListener({
        selectionChanged: ({ entity }) => {
          // 1. handler shouldn't work with start/stop nodes
          // 2. handler shouldn't work when items have "no-data" statuses
          if (Object.prototype.hasOwnProperty.call(entity.options, ('number'))
        && !['skipped', 'declined', 'waiting_on_dependencies'].includes(entity.options.status)
          ) {
            nodeSelectHandler(entity.options.number);
          }
        },
      }));
      const startNode = new NodeEdgeModel();
      const stopNode = new NodeEdgeModel({ isStart: false });
      return [startNode].concat(basicNodes, stopNode);
    }
    return basicNodes;
  }, [items, nodeSelectHandler]);

  // create links
  const linkModels = useMemo(() => {
    const links = [];
    if (isGraph(nodeModels, kind)) {
      nodeModels.forEach((model, idx) => {
        // we do not need to work with the last node
        if (idx === nodeModels.length - 1) return;
        // link edge start node
        if (!idx) {
          connectNodes(model, nodeModels[idx + 1], links);
        }
        if (model.options.depends_on?.length) {
          nodeModels.filter((m) => model.options.depends_on.includes(m.options.name)).forEach((m) => {
            connectNodes(m, model, links);
          });
        }
      });
      // get interactive nodes (no start/stop)
      const interactiveNodeModels = nodeModels.slice(1, nodeModels.length - 1);
      const startNode = nodeModels[0];
      const stopNode = nodeModels[nodeModels.length - 1];
      // connect with edge nodes:
      interactiveNodeModels.forEach((nodeModel) => {
        // if a node doesn't have links at its in port,
        // set a link between node and start edge node
        if (!Object.keys(nodeModel.getPort('in').getLinks()).length) {
          connectNodes(startNode, nodeModel, links);
        }
        // if a node doesn't have links at its out port,
        // set a link between node and the stop edge node
        if (!Object.keys(nodeModel.getPort('out').getLinks()).length) {
          connectNodes(nodeModel, stopNode, links);
        }
      });
    } else {
      nodeModels.forEach((model, idx) => {
        // we do not need to work with the last node
        if (idx === nodeModels.length - 1) return;
        connectNodes(model, nodeModels[idx + 1], links);
      });
    }
    return links;
  }, [nodeModels, kind]);

  // setup the diagram engine
  const engine = useMemo(() => createEngine(), []);

  // setup the diagram model
  const model = useMemo(() => new DiagramModel(), []);

  // register custom factories
  engine.getNodeFactories().registerFactory(new NodeDefaultFactory());
  engine.getNodeFactories().registerFactory(new NodeEdgeFactory());

  useLayoutEffect(() => {
    if (nodeModels.length >= 3) {
      nodeModels.slice(1, nodeModels.length - 1).forEach((nodeModel) => {
        nodeModel.setIsImperativelySelected(nodeModel.getOptions().number === selectedNodeNumber);
      });
    }
  }, [nodeModels, selectedNodeNumber]);

  useLayoutEffect(() => {
    const existingNodes = model.getNodes();
    const existingLinks = model.getLinks();
    if (existingNodes.length) {
      existingNodes.map((m) => model.removeNode(m));
    }
    if (existingLinks.length) {
      existingLinks.map((l) => model.removeLink(l));
    }
    model.addAll(...nodeModels.concat(linkModels));
    dagreEngine.redistribute(model);
    engine.repaintCanvas();
  }, [engine, model, nodeModels, linkModels, dagreEngine]);

  //  load model into engine
  engine.setModel(model);

  // lock the model
  model.setLocked(true);

  return (
    <>
      <CanvasWidget
        className={cx('diagram-wrapper')}
        engine={engine}
      />
      <Controls engine={engine} />
    </>
  );
};

export default Diagram;
