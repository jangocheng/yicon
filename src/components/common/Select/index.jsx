import React, { Component, PropTypes } from 'react';
import RcSelect, { Option, OptGroup } from 'rc-select';
import './Select.scss';
/**
 * 评分组件
 *
 * @component Selectfield
 * @version  0.0.1
 * @description 模拟select。
 * @autor leila.wang
 */

export {
  Option,
};
export default class Select extends Component {
  static Option = Option;
  static OptGroup = OptGroup;

  static defaultProps = {
    transitionName: 'slide-up',
    choiceTransitionName: 'zoom',
    showSearch: false,
    notFoundContent: 'Not Found',
  }
  static contextTypes = {
    antLocale: React.PropTypes.object,
  }
  static propTypes = {
    prefixCls: PropTypes.string,
    showSearch: PropTypes.bool,
    optionLabelProp: PropTypes.string,
    notFoundContent: PropTypes.string,
    combobox: PropTypes.bool,
    value: PropTypes.any,
    defaultValue: PropTypes.any,
  }

  componentWillUnmount() {
    this.allowScroll();
  }

  preventScroll() {
    const body = document.getElementsByTagName('body')[0];
    body.style.height = 'auto';
    body.style.overflow = 'hidden';
  }

  allowScroll() {
    const body = document.getElementsByTagName('body')[0];
    body.style.height = '100%';
    body.style.overflow = 'auto';
  }

  render() {
    let { notFoundContent, optionLabelProp } = this.props;
    const { combobox } = this.props;
    const { antLocale } = this.context;
    if (antLocale && antLocale.Select) {
      notFoundContent = notFoundContent || antLocale.Select.notFoundContent;
    }

    if (combobox) {
      notFoundContent = null;
      // children 带 dom 结构时，无法填入输入框
      optionLabelProp = optionLabelProp || 'value';
    }

    const props = {};
    Object.assign(props, this.props);
    if (props.onSelect) {
      const _onSelect = props.onSelect;
      props.onSelect = (data) => {
        _onSelect(data);
        this.allowScroll();
      };
    } else {
      props.onSelect = () => {
        this.allowScroll();
      };
    }
    if (props.onBlur) {
      const _onBlur = props.onBlur;
      props.onBlur = (data) => {
        _onBlur(data);
        this.allowScroll();
      };
    } else {
      props.onBlur = () => {
        this.allowScroll();
      };
    }

    return (
      <div onClick={this.preventScroll}>
        <RcSelect
          {...props}
          placeholder="请选择"
          dropdownStyle={{ maxHeight: 250, overflow: 'auto' }}
          optionLabelProp={optionLabelProp || 'children'}
          notFoundContent={notFoundContent}
        />
      </div>
    );
  }
}
