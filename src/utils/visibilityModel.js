import treeData from './visibilityTree.json'

function predict(node, features) {
  if (node.value !== undefined) return node.value
  const val = features[node.feature]
  return val <= node.threshold
    ? predict(node.left, features)
    : predict(node.right, features)
}

export function getMLVisibilityScore(features) {
  const score = predict(treeData, features)
  return Math.round(Math.max(0, Math.min(100, score)))
}

export function getVisibilityLabel(score) {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  if (score >= 20) return 'Poor'
  return 'Very Poor'
}