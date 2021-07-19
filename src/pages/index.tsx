import React from 'react';
import { Button } from 'antd';
import styles from './index.less';

export default function IndexPage() {
  // TODO APP主入口。判断是生成code，则直接生成数据结束。否则路由进入配置页面
  utools.onPluginEnter(({ code, type, payload }) => {
    console.log('用户进入插件', code, type, payload);
  });
  utools.copyText('ss');
  return (
    <div>
      <Button>hhh</Button>
      <h1 className={styles.title}>Page index</h1>
    </div>
  );
}
