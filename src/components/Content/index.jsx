import './Content.scss';
import React, { PropTypes } from 'react';
import Main from './Main';
import Menu from './Menu';

const Content = props => {
  let classList = props.extraClass ? `global-content ${props.extraClass}` : 'global-content';
  return (
    <div className={classList}>
      <div className="content">
        {props.children}
      </div>
      <footer>
        <span><a>去哪儿网UED</a></span>
        <span><a>React</a></span>
        <span><a>Redux</a></span>
        <span><a>KOA</a></span>
        <p className="copyright">
          <i className="copyright-ico">©</i>
          <em className="copyright-year">2003-2016</em>&nbsp;qunar.com 版权所有
        </p>
      </footer>
    </div>
  );
};

Content.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array,
  ]),
  extraClass: PropTypes.string,
};

export {
  Content,
  Menu,
  Main,
};
