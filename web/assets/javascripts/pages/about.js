import React from 'react';

const About = React.createClass({
  render() {
    return (
      <div className='about page'>
        <h3>
          关于网站:
        </h3>
        <p>
          用来收集游戏(目前只有炉石传说)中的一些技巧，(冷)知识。这些内容来自各个角落，并非原创，侵删！
        </p>
        <h3>
          关于我
        </h3>
        <p>
          炉石ID: 不明真相的雷#5261, 中国区。非专业，任务，乱斗玩家。
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
