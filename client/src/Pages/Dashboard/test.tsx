// component
interface Item {
	title: string,
	path: string,
}
const navConfig: Item[] = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
  },
  {
    title: 'user',
    path: '/dashboard/user',
  },
  {
    title: 'product',
    path: '/dashboard/products',
  },
  {
    title: 'blog',
    path: '/dashboard/blog',
  },
  {
    title: 'login',
    path: '/login',
  },
  {
    title: 'Not found',
    path: '/404',
  },
];

export default navConfig;