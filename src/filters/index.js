const distributionStatus = val => {
  return val ? '已分发' : '未分发';
};

const distribution = val => {
  return val ? '撤回' : '分发';
};

const sjSurveyStatus = val => {
  if (val === undefined || val === null) {
    return '';
  }
  val = val.toString();
  switch (val) {
    case '0':
      return '区县已完成';
    case '1':
      return '区县已审核';
  }
};

const qxSurveyStatus = val => {
  if (val === undefined || val === null) {
    return '';
  }
  val = val.toString();
  switch (val) {
    case '0':
      return '未开始';
    case '1':
      return '调查中';
    case '2':
      return '已完成';
  }
};

export { distributionStatus, distribution, sjSurveyStatus, qxSurveyStatus };
