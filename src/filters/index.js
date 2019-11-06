const distributionStatus = val => {
  return val ? '已分派' : '未分派';
};

const distribution = val => {
  return val ? '撤回' : '分派';
};

const checkStatus = val => {
  try {
    val = val.toString();
  } catch (error) {
    console.log('checkStatus', error);
    return '';
  }
  switch (val) {
    case '0':
      return '未调查';
    case '1':
      return '区县未审核';
    case '2':
      return '区县未通过';
    case '3':
      return '区县已通过';
    case '4':
      return '市级未通过';
    case '5':
      return '市级已通过';
  }
};

const surveyStatus = val => {
  try {
    val = val.toString();
  } catch (error) {
    console.log('surveyStatus', error);
    return '';
  }
  switch (val) {
    case '0':
      return '未调查';
    case '1':
      return '未提交';
    case '2':
      return '审核中';
    case '3':
      return '审核未通过';
    case '4':
      return '已完成';
  }
};

const getClass = val => {
  try {
    val = val.toString();
  } catch (error) {
    console.log('getClass', error);
    return '';
  }
  switch (val) {
    case '0':
      return 'no-survey';
    case '1':
      return 'qx-no-check';
    case '2':
      return 'qx-no-pass';
    case '3':
      return 'qx-has-passed';
    case '4':
      return 'sj-no-pass';
    case '5':
      return 'sj-has-passed';
  }
};

const dateFormatter = time => {
  if (time) {
    const date = new Date(time);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = month >= 10 ? month : `0${month}`;
    day = day >= 10 ? day : `0${day}`;

    return `${year}-${month}-${day}`;
  } else {
    return '';
  }
};

export {
  distributionStatus,
  distribution,
  checkStatus,
  surveyStatus,
  getClass,
  dateFormatter,
};
