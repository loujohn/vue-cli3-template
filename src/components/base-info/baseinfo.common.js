export default {
  data() {
    return {
      constFieldList: [],
      fieldList: [],
      size: 'small',
      form: {},
      rules: {},
      formConfig: {},
    };
  },
  watch: {
    fields: {
      handler: function(val) {
        if (val) {
          this.constFieldList = JSON.parse(JSON.stringify(this.fields));
          const list = this.fields.filter(item => item.isEdit);
          this.fieldList = list;
          const { form, formConfig, rules } = this.getFormConfig(list);
          this.rules = rules;
          this.formConfig = formConfig;
          this.form = form;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    getValue(value, options) {
      let item = options.filter(option => option.optionKey === value);
      if (item[0]) {
        return item[0].optionValue;
      } else {
        return value;
      }
    },
    getFormConfig(fields) {
      const form = {};
      const formConfig = {};
      const rules = {};
      fields.forEach(field => {
        let config = {};
        let rule = [];
        const {
          fieldAlias,
          fieldName,
          fieldValue,
          fieldType,
          is_pc_required,
          options,
        } = field;
        config['fieldType'] = fieldType;
        config['fieldAlias'] = fieldAlias;
        form[fieldName] = fieldValue;
        if (is_pc_required) {
          rule.push({
            required: true,
            message: `${fieldAlias}不能为空`,
            trigger: 'blur',
          });
        }
        if (fieldType === 3) {
          rule.push({
            pattern: /^[+-]?[\d]+([.][\d]*)?([Ee][+-]?[\d]+)?$/,
            message: `${fieldAlias}必须为数字`,
            trigger: 'blur',
          });
        }

        rules[fieldName] = rule;
        if (fieldType === 1) {
          config['options'] = options;
        }

        formConfig[fieldName] = config;
      });
      return {
        form,
        rules,
        formConfig,
      };
    },
  },
};
