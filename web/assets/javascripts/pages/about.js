import React from 'react';

const About = React.createClass({
  render() {
    return (
      <div className='about page'>
        <h3>
          关于网站:
        </h3>
        <p>
          用来收集游戏中的一些技巧，知识。
        </p>
        <p>
          如果你有相关的内容，非常欢迎提供给我 <a href='mailto:im.yuqlee@gmai.com'> im.yuqlee(at)gmail(dot)com </a>
        </p>
      </div>
    )
  }
});

module.exports = {about: About}
