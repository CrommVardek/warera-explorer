import type { RegionsById } from "../models/region/Region";

/** Distance sentinel for a region that cannot be walked to. */
export const UNREACHABLE = 255;

export interface RegionGraph {
  ids: string[];
  indexById: Map<string, number>;
  /** All-pairs hop counts, row-major: distances[from * size + to]. */
  distances: Uint8Array;
}

/**
 * Builds the hop-count matrix between every pair of regions, by running a
 * breadth-first search from each one. Neighbours are not filtered: the game
 * lets a player walk through any region, whoever owns it.
 */
export const buildRegionGraph = (regions: RegionsById): RegionGraph => {
  const ids = Object.keys(regions);
  const size = ids.length;
  const indexById = new Map(ids.map((id, index) => [id, index]));

  const neighbours = ids.map((id) =>
    (regions[id].neighbors ?? [])
      .map((neighbourId) => indexById.get(neighbourId))
      .filter((index): index is number => index !== undefined)
  );

  const distances = new Uint8Array(size * size).fill(UNREACHABLE);
  const queue = new Int32Array(size);

  for (let source = 0; source < size; source++) {
    const row = source * size;
    distances[row + source] = 0;
    queue[0] = source;
    let head = 0;
    let tail = 1;

    while (head < tail) {
      const current = queue[head++];
      const nextDistance = distances[row + current] + 1;
      for (const neighbour of neighbours[current]) {
        if (distances[row + neighbour] === UNREACHABLE) {
          distances[row + neighbour] = nextDistance;
          queue[tail++] = neighbour;
        }
      }
    }
  }

  return { ids, indexById, distances };
};

/** Longest walk the map can demand, in regions crossed. */
export const maxRegionsAcross = (graph: RegionGraph): number => {
  let longest = 0;
  for (const distance of graph.distances) {
    if (distance !== UNREACHABLE && distance > longest) longest = distance;
  }
  return longest;
};

/** Exact solving stays cheap up to this many stops. */
const EXACT_ROUTE_LIMIT = 8;

const distanceBetween = (graph: RegionGraph, from: number, to: number) =>
  graph.distances[from * graph.ids.length + to];

const routeLength = (graph: RegionGraph, start: number, order: number[]) => {
  let total = 0;
  let current = start;
  for (const stop of order) {
    total += distanceBetween(graph, current, stop);
    current = stop;
  }
  return total;
};

const permute = (values: number[]): number[][] => {
  if (values.length <= 1) return [values];
  const permutations: number[][] = [];
  for (let i = 0; i < values.length; i++) {
    const rest = [...values.slice(0, i), ...values.slice(i + 1)];
    for (const tail of permute(rest)) permutations.push([values[i], ...tail]);
  }
  return permutations;
};

/** Nearest neighbour followed by 2-opt, for the rare oversized batch. */
const approximateOrder = (
  graph: RegionGraph,
  start: number,
  targets: number[]
): number[] => {
  const remaining = [...targets];
  const order: number[] = [];
  let current = start;
  while (remaining.length) {
    let bestIndex = 0;
    for (let i = 1; i < remaining.length; i++) {
      if (
        distanceBetween(graph, current, remaining[i]) <
        distanceBetween(graph, current, remaining[bestIndex])
      ) {
        bestIndex = i;
      }
    }
    current = remaining[bestIndex];
    order.push(current);
    remaining.splice(bestIndex, 1);
  }

  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 0; i < order.length - 1; i++) {
      for (let j = i + 1; j < order.length; j++) {
        const candidate = [
          ...order.slice(0, i),
          ...order.slice(i, j + 1).reverse(),
          ...order.slice(j + 1),
        ];
        if (
          routeLength(graph, start, candidate) < routeLength(graph, start, order)
        ) {
          order.splice(0, order.length, ...candidate);
          improved = true;
        }
      }
    }
  }
  return order;
};

/**
 * Average hops per case for a player who lets `batchSize` cases pile up and
 * then walks the best route through them. Cases land on random regions, so
 * this is estimated by sampling.
 */
export const averageRegionsPerBatchedCase = (
  graph: RegionGraph,
  startId: string,
  batchSize: number,
  samples = 300
): number => {
  const size = graph.ids.length;
  const start = graph.indexById.get(startId);
  if (start === undefined || batchSize < 1 || !size) return 0;

  // Sampling only has to be reproducible, not cryptographically random.
  let seed = 1;
  const nextRandom = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  let total = 0;
  for (let sample = 0; sample < samples; sample++) {
    const targets: number[] = [];
    for (let i = 0; i < batchSize; i++) {
      targets.push(Math.floor(nextRandom() * size));
    }
    const order =
      targets.length <= EXACT_ROUTE_LIMIT
        ? permute(targets).reduce((best, candidate) =>
            routeLength(graph, start, candidate) <
            routeLength(graph, start, best)
              ? candidate
              : best
          )
        : approximateOrder(graph, start, targets);
    total += routeLength(graph, start, order);
  }

  return total / samples / batchSize;
};
