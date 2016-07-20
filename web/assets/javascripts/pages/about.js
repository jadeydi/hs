import React from 'react';

const About = React.createClass({
  render() {
    return (
      <div className='about page'>
        <h3>
          关于网站
        </h3>
        <p>
          发现好玩的游戏，每个游戏都亲自玩过。
        </p>
        <h3>
          关于我
        </h3>
        <p>
          程序员，会点前端，会点后端，也写过小应用。
        </p>
        <p>
          如果你有相关的内容或者建议，请发邮件给我 <a href='mailto:im.yuqlee@gmai.com'> im.yuqlee(at)gmail(dot)com </a>
        </p>
        <h3>
          QA
        </h3>
        <p>
          现在还没遇到问题。
        </p>
      </div>
    )
  }
});

module.exports = {about: About}
