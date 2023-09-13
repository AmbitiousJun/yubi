export default [
  { path: '/user', layout: false, routes: [{ path: '/user/login', component: './User/Login' }] },
  { path: '/welcome', icon: 'smile', component: './Welcome' },
  {
    path: '/admin',
    icon: 'crown',
    name: '管理员',
    access: 'canAdmin',
    routes: [
      { path: '/admin', name: '管理员页', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '管理员子页面', component: './Admin' },
    ],
  },
  { icon: 'table', path: '/list', name: '表格', component: './TableList' },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
