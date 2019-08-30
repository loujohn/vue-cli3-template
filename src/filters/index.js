const distributionStatus = val => {
  return val ? '未分发' : '已分发';
};

const distribution = val => {
  return val ? '撤回' : '分发';
};

export { distributionStatus, distribution };
